import React, { Component } from 'react';
import fire from './config/Fire';
import './App.css';
import { Link } from 'react-router-dom'
class Home extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
     //   this.fileChangedHandler = this.fileChangedHandler.bind(this);
     //   this.uploadHandler = this.uploadHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fileuploadHandler = this.fileuploadHandler.bind(this);
    }
    


    logout() {
        fire.auth().signOut();
        this.setState({user: null});
    }

    state = {selectedFile: null}
    //single
 //   fileChangedHandler = (event) => {
  //      const file = event.target.files[0];
  //      this.setState({ file });
  //  }
    //single
  //  uploadHandler = () => {
  //      const storageRef = fire.storage().ref();
  //      storageRef.child(`images/${this.state.file.name}`)
  //          .put(this.state.file).then((snapshot) => {
            
  //      });
  //    }

    //display multi
    handleChange(event) {

        const file = Array.from(event.target.files);
        this.setState({ file });   
    }
    //multi
    fileuploadHandler = () => {
      
        const storageRef = fire.storage().ref();
        this.state.file.forEach((file) => {
          storageRef
              .child(`images/${file.name}`)
              .put(file).then((snapshot) => {
                alert('File has been uploaded!');
          })
        });
      }
      
    render() {
        return (
            <div className="App">
            <div className="logApp">   
            <Link to="/" >      <button className="loginBtn loginBtn--N" onClick = {this.logout}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Logout</button> 
            </Link>       </div>
               <br/> <br/> <br/> <br/>
               <div className="upApp">      
               <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/>   
               &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
                <input id="file" type="file" accept=".jpg, .png, .tiff" onChange={this.handleChange.bind(this)} required multiple />
                
                <br/>
                
                <br/>  <br/>  <br/>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <button className="loginBtn2 loginBtn--U" onClick={this.fileuploadHandler}> &nbsp; &nbsp; &nbsp; &nbsp;Upload!</button> <br /><br /><br />
                </div>
                <p></p>
                </div>
                
                


        )
        
    }
    

}

export default Home;