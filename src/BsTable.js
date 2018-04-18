import React,  { Component }  from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
//import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
  
  class RemoteTable extends Component {
        
    render() {
      const cellEditProp = {
        mode: 'click'
      };
      const selectRow = {
        mode: 'checkbox',
        cliclToSelct: true
      };
      
      const fetchInfo = {
        dataTotalSize: this.props.totalDataSize // or checkbox
      };

      const pageType = {
        0: 'Menu',
        1: 'Events',
        2: 'Content'
      };

      function enumFormatter(cell, row, enumObject) {
        return enumObject[cell];
      }

      function titleValidator(value, row){
        const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
        if (!value) {
          response.isValid = false;
          response.notification.type = 'error';
          response.notification.msg = 'Title must be inserted';
          response.notification.title = 'Requested Value';
        } else if (value.length > 50) {
          response.isValid = false;
          response.notification.type = 'error';
          response.notification.msg = 'Title must have max 50 characters';
          response.notification.title = 'Invalid Value';
        }
      return response;
      }

      function descrValidator(value, row){
        const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
        if (!value) {
          response.isValid = false;
          response.notification.type = 'error';
          response.notification.msg = 'Description must be inserted';
          response.notification.title = 'Requested Value';
        } else if (value.length > 200) {
          response.isValid = false;
          response.notification.type = 'error';
          response.notification.msg = 'Description must have max 200 characters';
          response.notification.title = 'Invalid Value';
        }
      return response;
      }
      
      return (
        <BootstrapTable data={ this.props.data }
                        remote={ true }
                        selectRow={ selectRow }
                        cellEdit={ cellEditProp }
                        insertRow deleteRow 
                        search = {true}
                        //pagination = {true}
                        fetchInfo={ fetchInfo }
                        striped hover
                        options={ { 
                         /* onPageChange: this.props.onPageChange,
                          sizePerPageList: [ 5, 10 ],
                          page: this.props.currentPage,
                          onSizePerPageList: this.props.onSizePerPageList,
                          sizePerPage: this.props.sizePerPage,
                          //sizePerPage: 5,  // which size per page you want to locate as default
                          //pageStartIndex: 0, // where to start counting the pages
                          //paginationSize: 3,  // the pagination bar size.
                          //prePage: 'Prev', // Previous page button text
                          //nextPage: 'Next', // Next page button text
                          //firstPage: 'First', // First page button text
                          //lastPage: 'Last', // Last page button text
                          */
                          onAddRow: this.props.onAddRow,
                          onDeleteRow: this.props.onDeleteRow,
                          onCellEdit: this.props.onCellEdit,
                          onSortChange: this.props.onSortChange, 

                          onSearchChange: this.props.onSearchChange,
                          clearSearch: true 
                          
                          } }>
          <TableHeaderColumn dataField='id' isKey={ true } dataSort={true} hiddenOnInsert>Page ID</TableHeaderColumn>
          <TableHeaderColumn dataField='title' dataSort={true} editable={{ validator: titleValidator}}>Page Title</TableHeaderColumn>
          <TableHeaderColumn dataField='description' dataSort={true} editable={{ validator: descrValidator}}>Page Description</TableHeaderColumn>
          <TableHeaderColumn dataField='type' dataFormat={ enumFormatter } formatExtraData={ pageType } editable={ { type: 'select', options: { values: [{value:0, text:'Menu'},{value:1, text:'Events'},{value:2, text:'Content'}] } } } dataSort={true}>Page Type</TableHeaderColumn>
          <TableHeaderColumn dataField='isActive' editable={ { type: 'select', options: { values: [{value:true, text:"true"},{value:false, text:"false"}] } } } dataSort={true}>Active</TableHeaderColumn>
          <TableHeaderColumn dataField='publishedOn' editable={ {type:'date'} } dataSort={true}>Publish Date</TableHeaderColumn>
        </BootstrapTable>
      );
    }
  }

  export default RemoteTable;