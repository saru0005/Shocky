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
<<<<<<< HEAD
import Admin from './Uploads/Admincontrol'
=======
import Admincontrol from './Uploads/Admincontrol'


>>>>>>> 3fd6491bde4f2c8eca6476c01d3a444d633c2cac
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
        <Route exact path="/Admin" component={Admin} />
        <Route exact path="/UploadFolders" component={UploadFolders} />
        <Route exact path="/Admincontrol" component={Admincontrol} />
            </Switch>
        
          </div> 
        );
      }
    }
     
export default App;