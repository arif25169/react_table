import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import PagesShow from './PagesShow';
//import BootstrapTable from './Table';
import DataGrid from './Table';
import registerServiceWorker from './registerServiceWorker';
//import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
//import './bootstrap.min.css'


ReactDOM.render(<App />, document.getElementById('root'));
//ReactDOM.render(<PagesShow />, document.getElementById('app_pages'));
//ReactDOM.render(<BootstrapTable />, document.getElementById('table_bootstrap'));
ReactDOM.render(<DataGrid />, document.getElementById('table_bootstrap'));
registerServiceWorker();



  
