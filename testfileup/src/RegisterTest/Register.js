import React, { Component } from 'react';
import firebase from '../config/Fire';
import '../App.css';
import { Link } from 'react-router-dom'
import logo from '../config/Ling logo.png';
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.registerU = this.registerU.bind(this);
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }
      
    registerU(e) {
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
            alert('Register Complete');
        }).catch((error) => {
            console.log(error);
          });
        
        
    }

    
      

    
    
  render() {
    return (
        <div className="App">
             <div className="loading container wrapper">
                      <img src={logo} className="App-logo" alt="logo" />
                      <br />
                          <p class="sansserif">Register</p>
                      <div class="form-group">
                  <label for="exampleInputEmail1">Email address</label>
                  <br/><br/>
                  <input  value={this.state.email} onChange={this.handleChange} type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" /><br/><br/><br/>
              </div>
              <div class="form-group">
                <label for="exampleInputPassword1">Password</label><br/><br/>
                <input  value={this.state.password} onChange={this.handleChange} type="password" name="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
              </div><br/>
              <button type="submit" onClick={this.registerU} class="loginBtn loginBtn--L">Register</button>      
                      <br /> <br />
                      <Link to="/" >Back     
                      </Link> 
                <br /> <br />     
                  </div>
  
        </div>
    );
  }
  }

export default Register;