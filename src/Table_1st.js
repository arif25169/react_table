import React,  { Component }  from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

class DataGrid extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      PagesShow: []
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.fetchData = this.fetchData.bind(this);
    //this.onTableChange = this.onTableChange.bind(this);
    //this.afterSaveCell = this.afterSaveCell.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData(page = this.state.page, sizePerPage = this.state.sizePerPage) {
    const self = this;
    fetch("http://pagesmanagement.azurewebsites.net/api/ResponsivePages")
      .then(function(re){
        return re.json();
      })
        .then(function(reJson){
          console.log(reJson);
          console.log('in table');
          self.setState({PagesShow:reJson})
        })
          .catch(function(error){
            console.log('Houston we got a problem at: ', error.message);
            alert('Error : ' + error.message);
        })
  }


  render() {

    const selectRow = {
      mode : 'checkbox',
      //hideSelectColumn: true,
      //clickToSelect: true,
      style: { backgroundColor: '#c8e6c9' }
    };

    const afterSaveCell = (row, cellName, cellValue) => {
      
      console.log(row + "cell name " + cellName + "cellvalue"+ cellValue);
      //Update the value in row
      row[cellName] = cellValue;

      fetch("http://pagesmanagement.azurewebsites.net/api/ResponsivePages/"+  row.id, {
        method : 'PUT',
        body : JSON.stringify(row),
        headers: {
          'content-type': 'application/json'
        }
      })
    };

    /*const  onAfterInsertRow = (row) =>{
      let newRowStr = '';
    
      for (const prop in row) {
        newRowStr += prop + ': ' + row[prop] + ' \n';
      }
      row.Type = 1;
      row.IsActive=true;
      row.PublishedOn = new Date();
      alert('The new row is:\n ' + newRowStr);
      fetch("http://pagesmanagement.azurewebsites.net/api/ResponsivePages/", {
        method : 'POST',
        body : JSON.stringify(row),
        headers: {
          'content-type': 'application/json'
        }
      })
      //Refresh Data?
      this.fetchData();
    };
    */
    const onDeleteRow = (rows) => {
      console.log(rows);
      //JUST ADD THE FETCH!
      rows.forEach( function (page_id) {
        fetch("http://pagesmanagement.azurewebsites.net/api/ResponsivePages/"+page_id, {
          method : 'DELETE',
          //body : JSON.stringify(row),
          headers: {
            'content-type': 'application/json'
          }
        })
      }) 
    };

    const cellEditProp = {
      mode: 'click',
      afterSaveCell : afterSaveCell  // a hook for after saving cell
    };

    const options = {
      //afterInsertRow: onAfterInsertRow,   // A hook for after insert rows
      onDeleteRow: onDeleteRow
    };

    
    
    return (
      <BootstrapTable 
        //keyField='id' 
        data= { this.state.PagesShow}
        remote= {true}
        insertRow={ true }
        striped  
        cellEdit={cellEditProp}
        options={ options }
        //pagination={ paginationFactory() } 
        //cellEdit={ cellEditFactory({mode: 'click'}) }
        //remote={ {
          //cellEdit: true
        //} }
        deleteRow={true}
        selectRow={ selectRow }
        //onTableChange ={onTableChange}
        //filter={ filterFactory() }
    >
    <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={ true }>Page ID</TableHeaderColumn>
      <TableHeaderColumn dataField="title" dataSort={ true } >Page Title</TableHeaderColumn>
      <TableHeaderColumn dataField="description" >Page Description</TableHeaderColumn>
      {/* <TableHeaderColumn dataField="type" >Page type</TableHeaderColumn>
      <TableHeaderColumn dataField="IsActive" >Page isActive</TableHeaderColumn>
      <TableHeaderColumn dataField="PublishedOn" >Page Published</TableHeaderColumn> */}
      </BootstrapTable>
      
      /*<BootstrapTable
        data={this.state.items}
        options={options}
        fetchInfo={{dataTotalSize: this.state.totalSize}}
        remote
        pagination
        striped
        hover
        condensed
      >
        <TableHeaderColumn dataField="id" isKey dataAlign="center">Id</TableHeaderColumn>
        <TableHeaderColumn dataField="name" dataAlign="center">Name</TableHeaderColumn>
        <TableHeaderColumn dataField="surname" dataAlign="center">Surname</TableHeaderColumn>
      </BootstrapTable>
      */
    );
  }
}


/*
const products = [ 
  {id: 1, name: 'ham-burger', price: 30}, 
  {id: 2, name: 'beer', price: 10},
  {id: 3, name: 'beer', price: 10},
  {id: 4, name: 'beer', price: 10},
  {id: 5, name: 'beer', price: 10},
  {id: 6, name: 'beer', price: 10},
  {id: 7, name: 'beer', price: 10},
  {id: 8, name: 'beer', price: 10},
  {id: 9, name: 'beer', price: 10},
  {id: 10, name: 'beer', price: 10},
  {id: 11, name: 'beer', price: 10},
  {id: 12, name: 'beer', price: 10},
  {id: 13, name: 'beer', price: 10}
];
const columns = [{
  dataField: 'id',
  text: 'Product ID',
  sort: true,
  filter:textFilter()
}, {
  dataField: 'name',
  text: 'Product Name',
  sort: true,
  filter:textFilter()
}, {
  dataField: 'price',
  text: 'Product Price',
  sort: true,
  filter:textFilter()
}
];

export default () =>
  <BootstrapTable 
    keyField='id' 
    data={ products } 
    columns={ columns } 
    striped  
    pagination={ paginationFactory() } 
    cellEdit={ cellEditFactory({mode: 'click'}) }
    filter={ filterFactory() }
    />
*/
    export default DataGrid;