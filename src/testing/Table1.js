import React,  { Component }  from 'react';
import PagesShow from './PagesShow';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';


class DataGrid extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      PagesShow: []
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.fetchData = this.fetchData.bind(this);
    //this.updateState = this.updateState.bind(this);
    //this.onTableChange = this.onTableChange.bind(this);
  }

  /*updateState(new_PageShow){
    this.setState({PagesShow:new_PageShow});
    console.log('I updated the state!');
  }*/

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
    /*
    const options = {
      onPageChange: this.handlePageChange,
      onSizePerPageList: this.handleSizePerPageChange,
      page: this.state.page,
      sizePerPage: this.state.sizePerPage,
    };*/

    const columns = [{
      dataField: 'id',
      text: 'Page ID',
      sort: true,
      filter:textFilter()
    }, {
      dataField: 'title',
      text: 'Page Title',
      sort: true,
      filter:textFilter()
    }, {
      dataField: 'description',
      text: 'Page Description',
      sort: true,
      filter:textFilter()
    }
    ];
    console.log(this.state.PagesShow);
    const selectRow = {
      mode : 'checkbox',
      //hideSelectColumn: true,
      //clickToSelect: true,
      style: { backgroundColor: '#c8e6c9' }
    }

    const onTableChange = (type, newState) => {
      // handle any data change here
      alert("I'm here! Changed cell: value of '" + newState.cellEdit.dataField+ "' will be : '" + newState.cellEdit.newValue + "'");
      //const updData = {description: "one updated page", id: 1239, isActive: false, publishedOn: "2018-03-26T11:32:01.73", title: "dfgfd", type: 0}
      const updRow = newState.data.find(function (obj){return obj.id == newState.cellEdit.rowId});
      updRow[newState.cellEdit.dataField] = newState.cellEdit.newValue;
      //{this.updateState(updRow)};
      fetch("http://pagesmanagement.azurewebsites.net/api/ResponsivePages/"+  newState.cellEdit.rowId, {
        method : 'PUT',
        body : JSON.stringify(updRow),
        headers: {
          'content-type': 'application/json'
        }
      })
    }
    return (
      <BootstrapTable 
        keyField='id' 
        data={ this.state.PagesShow}
         
        columns={ columns } 
        striped  
        pagination={ paginationFactory() } 
        cellEdit={ cellEditFactory({mode: 'click'}) }
        insertRow
        remote={ {
          cellEdit: true
        } }
        deleteRow={ true }
        selectRow={ selectRow }
        onTableChange ={onTableChange}
        filter={ filterFactory() }
    />
      
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