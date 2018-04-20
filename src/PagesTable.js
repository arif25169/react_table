import React,  { Component }  from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RemoteTable from './BsTable';

//import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';


class DataGrid extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        inData:[], //Initial data to have a reference 
        totalDataSize: 0,
        sizePerPage: this.props.sizePerPage,
        currentPage: 1
      }; 
      this.componentDidMount = this.componentDidMount.bind(this)
      this.fetchData = this.fetchData.bind(this);
    }
  
    onAddRow(row) {
      let newRowStr = '';
    
      for (const prop in row) {
        newRowStr += prop + ': ' + row[prop] + ' \n';
      }
      alert('The new row is:\n ' + newRowStr);
      const self = this;
      row.id = 1; //Default id
      row.publishedOn ? true: row.publishedOn = new Date() ; //Set today as date if null
      fetch("http://pagesmanagement.azurewebsites.net/api/ResponsivePages/", {
        method : 'POST',
        body : JSON.stringify(row),
        headers: {
          'content-type': 'application/json'
        }
      }).then(function(re){
          return re.json();
        })
          .then(function(reJson){
            //Update State
            let newState = self.state.data.slice();
            newState.push(reJson);
            self.setState({data: newState});
            newState = self.state.inData.slice();
            newState.push(reJson);
            self.setState({inData: newState});
          })
            .catch(function(error){
              console.log('Houston we got a problem at: ', error.message);
              alert('Error : ' + error.message);
          })
    }
    
    onDeleteRow = (rows) => {
      console.log(rows);
      const self = this;
      rows.forEach( function (page_id) {
        fetch("http://pagesmanagement.azurewebsites.net/api/ResponsivePages/"+page_id, {
          method : 'DELETE',
          headers: {
            'content-type': 'application/json'
          }
        })
      })
      //Update State
      let newState = self.state.data.slice();
      rows.forEach(function(pg_id)
      {
        newState = newState.filter(function (obj){return obj.id != pg_id}).slice();
      })
      self.setState({data: newState});

      newState = self.state.inData.slice();
      rows.forEach(function(pg_id)
      {
        newState = newState.filter(function (obj){return obj.id != pg_id}).slice();
      })
      self.setState({inData: newState});
    
    }


    onCellEdit = (row, cellName, cellValue) => {
      
      console.log(row + "cell name " + cellName + "cellvalue"+ cellValue);
      const self = this;
      //Update the value in row
      row[cellName] = cellValue;

      fetch("http://pagesmanagement.azurewebsites.net/api/ResponsivePages/"+  row.id, {
        method : 'PUT',
        body : JSON.stringify(row),
        headers: {
          'content-type': 'application/json'
        }
      })
      //Update State
      let stateIndx = self.state.data.findIndex(obj=> obj.id == row.id );
      let newState = self.state.data.slice();
      newState[stateIndx].cellName = cellValue;
      self.setState({data: newState});
      
      stateIndx = self.state.inData.findIndex(obj=> obj.id == row.id );
      newState = self.state.inData.slice();
      newState[stateIndx].cellName = cellValue;
      self.setState({inData: newState});
    }

    onSortChange(sortName, sortOrder) {
      const tmpState = this.state.data;
      if (sortOrder === 'asc') {
        tmpState.sort(function(a, b) {
          if (a[sortName] > b[sortName], 10) {
            return 1;
          } else if (b[sortName] > a[sortName]) {
            return -1;
          }
          return 0;
        });
      } else {
        tmpState.sort(function(a, b) {
          if (a[sortName] > b[sortName]) {
            return -1;
          } else if (b[sortName] > a[sortName]) {
            return 1;
          }
          return 0;
        });
      }
  
      this.setState({
        data: tmpState
      });
  }

    onSearchChange(searchText, colInfos, multiColumnSearch) {
      const text = searchText.trim();
      if (text === '') { //No search filter
        const tmpState = this.state.inData;
        this.setState({
          data: tmpState
        });
        return;
      }

      let searchTextArray = [];
      if (multiColumnSearch) {
        searchTextArray = text.split(' ');
      } 
      else {
        searchTextArray.push(text);
      }

      const data = this.state.data.filter((product) => {
        const keys = Object.keys(product);
        let valid = false;
        for (let i = 0, keysLength = keys.length; i < keysLength; i++) {
          const key = keys[i];
          if (colInfos[key] && product[key]) {
            const { format, filterFormatted, formatExtraData, searchable, hidden } = colInfos[key];
            let targetVal = product[key];
            if (!hidden && searchable) {
              if (filterFormatted && format) {
                targetVal = format(targetVal, product, formatExtraData);
              }
              for (let j = 0, textLength = searchTextArray.length; j < textLength; j++) {
                const filterVal = searchTextArray[j].toLowerCase();
                if (targetVal.toString().toLowerCase().indexOf(filterVal) !== -1) {
                  valid = true;
                  break;
                }
              }
            }
          }
        }
        return valid;
      });
      this.setState({
        data: data
      });
  }

    onPageChange(page, sizePerPage) {
      const currentIndex = (page - 1) * sizePerPage;
      let newState = this.state.inData.slice();
      this.setState({
        data: newState.slice(currentIndex, currentIndex + sizePerPage),
        currentPage: page
      });
  }

    onSizePerPageList(sizePerPage) {
      const currentIndex = (this.state.currentPage - 1) * sizePerPage;
      let newState = this.state.inData.slice();
      this.setState({
        data: newState.slice(currentIndex, currentIndex + sizePerPage),
        sizePerPage: sizePerPage
      });
  }

    componentDidMount() {
     this.fetchData();
    console.log('mounted')
    }

    fetchData() {
      const self = this;
      fetch("http://pagesmanagement.azurewebsites.net/api/ResponsivePages")
        .then(function(re){
          return re.json();
        })
          .then(function(reJson){
            console.log(reJson);
            console.log('in table');
            self.setState({data:reJson});
            self.setState({totalDataSize:reJson.length});
            self.setState({inData: reJson});
          })
            .catch(function(error){
              console.log('Houston we got a problem at: ', error.message);
              alert('Error : ' + error.message);
          })
    }


    render() {
      
      return (
        <RemoteTable 
          onAddRow= { this.onAddRow.bind(this) } 
          onCellEdit={ this.onCellEdit }
          onDeleteRow={ this.onDeleteRow }
          RemoteSorting onSortChange={ this.onSortChange.bind(this)}
          onSearchChange={ this.onSearchChange.bind(this) }
          onPageChange={ this.onPageChange.bind(this) }
          onSizePerPageList={ this.onSizePerPageList.bind(this) }
          { ...this.state } />
      );
    }
  }
  
  

  export default DataGrid;