import React, { Component } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom'
//Import Firebase
import fire from './config/Fire';
import Home from './Uploads/Home'
import Login from './LoginPage/Login'
import Register from './RegisterTest/Register'
import Reset from './RegisterTest/Reset'
import UploadFolders from './Uploads/UploadFolders'
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
        <Route exact path="/UploadFolders" component={UploadFolders} />
            </Switch>
        
          </div> 
        );
      }
    }
     
export default App;