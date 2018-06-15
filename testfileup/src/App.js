import React, { Component } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom'
//Import Firebase
import fire from './config/Fire';
import { Link } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Reset from './Reset'
class App extends Component {
    constructor(props){
        super(props);
        this.state = {
          user: null ,
        }
      }
    
      componentDidMount(){
        this.authListener();
      }
    
      authListener() {
        fire.auth().onAuthStateChanged((user) => {
          //console.log(user);
          if (user) {
            this.setState({user});
           // localStorage.setItem('user', user.uid);
          }
          else {
            this.setState({user : null});
           // localStorage.removeItem('user');
          }
        });
      }
    
      
      
    
      render() {
        
        return (
          <div className="App">
              <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/Home" component={Home} />
        <Route exact path="/Register" component={Register} />
        <Route exact path="/Reset" component={Reset} />
            </Switch>
        
          </div> 
        );
      }
    }
     
export default App;