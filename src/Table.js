import React,  { Component }  from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';


class DataGrid extends React.Component {
    constructor(props) {
      super(props);
      //this.props.products = fetchData2();
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
            //Update state
            const tmp_state = self.state.data;
            tmp_state.push(reJson);
            self.setState({data: tmp_state})
          })
            .catch(function(error){
              console.log('Houston we got a problem at: ', error.message);
              alert('Error : ' + error.message);
          })
      
      
      
      /*const tmp_state = this.state.data;
      tmp_state.push(row);
      this.setState({
        data: tmp_state
      });*/
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
            self.setState({data:reJson})
          })
            .catch(function(error){
              console.log('Houston we got a problem at: ', error.message);
              alert('Error : ' + error.message);
          })
    }

   

    render() {
      
      return (
        <RemoteInsertRow onAddRow={ this.onAddRow.bind(this) } { ...this.state } />
      );
    }
  }
  
  class RemoteInsertRow extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <BootstrapTable data={ this.props.data }
                        remote={ true }
                        insertRow={ true }
                        options={ { onAddRow: this.props.onAddRow } }>
          <TableHeaderColumn dataField='id' isKey={ true }>Product ID</TableHeaderColumn>
          <TableHeaderColumn dataField='title'>Product Name</TableHeaderColumn>
          <TableHeaderColumn dataField='description'>Product Price</TableHeaderColumn>
        </BootstrapTable>
      );
    }
  }

  function fetchData2() {
    fetch("http://pagesmanagement.azurewebsites.net/api/ResponsivePages")
      .then(function(re){
        return re.json();
      })
        .then(function(reJson){
          console.log(reJson);
          console.log('in table');
          //self.setState({PagesShow:reJson})
          return reJson;
        })
          .catch(function(error){
            console.log('Houston we got a problem at: ', error.message);
            alert('Error : ' + error.message);
        })
  }
  export default DataGrid;