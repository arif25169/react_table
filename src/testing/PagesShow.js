import React, { Component } from 'react';
//import logo from './logo.svg';
//import './App.css';

class PagesShow extends Component {
  constructor(props){
    super(props);
    this.state = {
      PagesShow: []
    }
    this.componentDidMount = this.componentDidMount.bind(this)
  }
  componentDidMount(){
    const self = this;
    fetch("http://pagesmanagement.azurewebsites.net/api/ResponsivePages")
      .then(function(re){
        return re.json();
      })
        .then(function(reJson){
          console.log(reJson);
          self.setState({PagesShow:reJson})
        })
          .catch(function(error){
            console.log('Houston we got a problem at: ', error.message);
            alert('Error : ' + error.message);
        })
  }
  render() {
    let a_pages = this.state.PagesShow.map((var_page) =>(
      <li id={var_page.id}> Title: {var_page.title} Description: {var_page.description} </li>
      )
  )
    return (
      <div className="PagesShow">
        <h1>{a_pages}</h1>
      </div>
    );
  }
}


export default PagesShow;
