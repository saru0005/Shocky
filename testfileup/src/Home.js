import React, { Component } from 'react';
import fire from './config/Fire';
import './App.css';
import { Link } from 'react-router-dom'
import logo from './config/Ling logo.png';  
import {provider,auth,provider2} from './config/Fire';
// Import the react-filepond plugin code
import FilepondPluginFileValidateType from 'filepond-plugin-file-validate-type';

//Import npm react-filepond
import { FilePond, File, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Register the image preview plugin
import FilePondImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
//Import StorageDataTable
import StorageDataTable from './Components/StorageDataTable';
registerPlugin(FilePondImagePreview);
registerPlugin(FilepondPluginFileValidateType);

class Home extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
     //   this.fileChangedHandler = this.fileChangedHandler.bind(this);
     //   this.uploadHandler = this.uploadHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fileuploadHandler = this.fileuploadHandler.bind(this);
        this.state = {
            files: [], //ใช้เก็บข้อมูล File ที่ Upload
            progressbar: 0, //ใช้เพื่อดู Process การ Upload
            filesMetadata:[], //ใช้เพื่อรับข้อมูล Metadata จาก Firebase
            rows:  [], //ใช้วาด DataTable
        };
  
    }
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user });
            }
        });
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
                var progressbar = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' +  progressbar + '% done');
                this.setState({progressbar})
               // alert('File has been uploaded!');
                //Get metadata
         storageRef.child(`images/${file.name}`).getMetadata().then((metadata) => {
            // Metadata now contains the metadata for 'filepond/${file.name}'
            let metadataFile = { 
                name: metadata.name, 
                size: metadata.size, 
                contentType: metadata.contentType, 
                user:  this.state.user.email,
                progress: 'Complete'
            }

            //Process save metadata
            const databaseRef = fire.database().ref('/image');
            databaseRef.push({  metadataFile });

        })
          })
            
        });
         
      }
 
      componentWillMount() {
        this.getMetaDataFromDatabase()
      }
  
      //โหลดข้อมูล Metadata จาก Firebase
      getMetaDataFromDatabase () {
      //    console.log("getMetaDataFromDatabase");
          const databaseRef = fire.database().ref('/image');
  
          databaseRef.on('value', snapshot => {
              this.setState({
                  filesMetadata:snapshot.val()
              }, () => this.addMetadataToList());
          });
      }

      addMetadataToList() {
        let i = 1;
        let rows = [];

        //Loop add data to rows
        for (let key in this.state.filesMetadata) {
              
            let fileData = this.state.filesMetadata[key];

            let objRows =  { 
                no:i++, 
                key:key, //ใช้เพื่อ Delete
                name: fileData.metadataFile.name, 
                fullPath: fileData.metadataFile.fullPath,
                size:(fileData.metadataFile.size),
                contentType:fileData.metadataFile.contentType,
                user: fileData.metadataFile.user,
                progress: 'Complete'
            }

            rows.push(objRows)
        }
        
        this.setState({
            rows: rows
        }, () => {
      //      console.log('Set Rows')
        })
    }

    renderUpload(){
        if (this.state.user) {  
            const { rows, filesMetadata, user } = this.state;
            var typeAy = ['image/jpeg','image/png','image/tiff'];
            return (
                <div class="App-div.container">
                   
                    <nav class="App-nav">
                        <section className="App-item">
                        <br />  <br />
                        <div class="p">
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;User : {this.state.user.displayName || this.state.user.email }&nbsp;&nbsp;&nbsp;&nbsp;</p> <br />
                            </div>
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                 <Link to="/" ><button className="loginBtn loginBtn--N" onClick = {this.logout}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Logout</button></Link>  
                            <br /><br /><br /><br /><br /><br /><br />
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <input id="file" type="file" accept=".jpg, .png, .tiff" onChange={this.handleChange.bind(this)} required multiple />
                              <br/>  <br/>  <br/>
                              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                               <button className="loginBtn2 loginBtn--U" onClick={this.fileuploadHandler}> &nbsp; &nbsp; &nbsp; &nbsp;Upload!</button> <br /><br /><br />
                                Uploading : {this.state.progressbar}
                        </section>
                    </nav>
                    <section className="display-item">
                        <article className="App-article">
                            <br /><br />

     
                      <StorageDataTable
                        rows={rows}
                        filesMetadata={filesMetadata}
                       user={user}
                    />
                        </article>
                    </section>
                </div>
            );
    
    } else {
      
    }
    }
    render() {
        return (
            <div className="App">
                {this.renderUpload()}
              
            </div>
        );
      
      }
    }

export default Home;