import React,  { Component }  from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';


class DataGrid extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: []
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
      row.Type = 1;
      row.IsActive=true;
      row.PublishedOn = new Date();
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
            console.log(reJson);
            console.log('in table');
            //Update State
            const newState = self.state.data;
            newState.push(reJson);
            self.setState({data: newState})
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
        //Update State
        const newState = self.state.data.filter(function (obj){return obj.id != page_id})
        self.setState({data: newState})
      })
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
      const stateIndx = self.state.data.findIndex(obj=> obj.id == row.id );
      const newState = self.state.data;
      newState[stateIndx].cellName = cellValue;
      self.setState({data: newState});
    };

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
            self.setState({data:reJson})
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
          { ...this.state } />
      );
    }
  }
  
  class RemoteTable extends Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      const cellEditProp = {
        mode: 'click'
      };
      const selectRow = {
        mode: 'checkbox',
        cliclToSelct: true
      };
      return (
        <BootstrapTable data={ this.props.data }
                        remote={ true }
                        selectRow={ selectRow }
                        cellEdit={ cellEditProp }
                        insertRow deleteRow 
                        search = {true}
                        pagination = {true}
                        striped hover
                        options={ { 
                          sizePerPageList: [ 
                              {text: '5', value: 5},
                              {text: '10', value: 10}
                              //{text: 'All', value: this.props.data.length}
                          ],
                          sizePerPage: 5,  // which size per page you want to locate as default
                          pageStartIndex: 0, // where to start counting the pages
                          paginationSize: 3,  // the pagination bar size.
                          prePage: 'Prev', // Previous page button text
                          nextPage: 'Next', // Next page button text
                          firstPage: 'First', // First page button text
                          lastPage: 'Last', // Last page button text
                          
                          onAddRow: this.props.onAddRow,
                          onDeleteRow: this.props.onDeleteRow,
                          onCellEdit: this.props.onCellEdit
                          
                          } }>
          <TableHeaderColumn dataField='id' isKey={ true }>Page ID</TableHeaderColumn>
          <TableHeaderColumn dataField='title'>Page Title</TableHeaderColumn>
          <TableHeaderColumn dataField='description'>Page Description</TableHeaderColumn>
        </BootstrapTable>
      );
    }
  }

  export default DataGrid;