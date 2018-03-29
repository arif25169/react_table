import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  /*
  componentDidMount(){
    fetch("http://pagesmanagement.azurewebsites.net/api/ResponsivePages")
      .then(res => res.json())
        .then(
          (result) => {
            alert('We have a result!');
            return result;
          },
          (error) => {
            console.log('Houston we have a problem')
          }
        )
  }
  */
  /*componentDidMount(){
    fetch("http://pagesmanagement.azurewebsites.net/api/ResponsivePages")
      .then(function(re){
        return re.json();
      })
        .then(function(reJson){
          console.log(reJson);
        })
          .catch(function(error){
            console.log('Houston we got a problem at: ', error.message);
            alert('Error : ' + error.message);
        })

  }*/
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">First time with React</h1>
        </header>
        <p className="App-intro">
        Καλημέρες.
        </p>
      </div>
    );
  }
}


export default App;
