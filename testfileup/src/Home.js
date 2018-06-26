import React, { Component } from 'react';
import fire from './config/Fire';
import './home.css';
import { Link } from 'react-router-dom'
import logo from './config/Ling logo.png';
import {auth} from './config/Fire';

//Import StorageDataTable
import StorageDataTable from './Components/StorageDataTable';


class Home extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);   
        this.uploadSubmit = this.uploadSubmit.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.strRef = fire.storage().ref();
        this.state = {
            files: [], //ใช้เก็บข้อมูล File ที่ Upload
            progress: 0, //ใช้เพื่อดู Process การ Upload
            filesMetadata:[], //ใช้เพื่อรับข้อมูล Metadata จาก Firebase
            rows:  [], //ใช้วาด DataTable
            uploadFilesObj: {}  
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
    //new multi
    uploadSubmit(event) {
        event.preventDefault();
        const allFiles = Array.from(this.fileInput.files);
        if (allFiles.length > 0) {
            // Add each files to state
            var tempUploadFilesObj = {};
            allFiles.forEach( (file, index) => {
                var fileObj = {};
                fileObj.fileName = file.name;
                fileObj.isUploading = true;
                fileObj.progressPercent = 0;
                const objKey = `file${index}`;
                tempUploadFilesObj[objKey] = fileObj;
            });
            this.setState({
                uploadFilesObj: tempUploadFilesObj
            });

            // Upload each files & update progress
            allFiles.forEach( (file, index) => {
                this.uploadFile(file, index)
            });
        }
        
        
    }
    //new muti upload C.
    uploadFile(file, index) {
        var fileObjKey = `file${index}`;
        var metadata = {
            contentType: file.type
        };
        var uploadTask = this.strRef.child(`images/${file.name}`).put(file, metadata);

        uploadTask.on("state_changed", (snapshot) => {
            // Progress handling
            var progressFix= (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            var progressPercent = progressFix.toFixed(2)
            console.log(`Upload #${index} is ${progressPercent}% done`);
            var stateCopy = Object.assign({}, this.state);
            stateCopy.uploadFilesObj[fileObjKey].progressPercent = progressPercent;
            this.setState(stateCopy);  
            switch (snapshot.state) {
                case fire.storage.TaskState.PAUSED:
                    console.log('Upload is paused');
                    break;
                case fire.storage.TaskState.RUNNING:
                    //console.log('Upload is running');
                    break;
                case fire.storage.TaskState.CANCEL:
                break;
                default:
                    console.log('No default');
            }
        }, (error) => {
            // Error handling
            console.log(error);
            var stateCopy = Object.assign({}, this.state);
            stateCopy.uploadFilesObj[fileObjKey].progressPercent = 0;
            this.setState(stateCopy);
        }, () => {
            // Complete handling
            console.log(`Upload #${index} completed`);
            var stateCopy = Object.assign({}, this.state);
            const timestamp = Date.now();
            stateCopy.uploadFilesObj[fileObjKey].progressPercent = 100;
     
            this.setState(stateCopy);
            console.log(new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp));
            //Get metadata
            this.strRef.child(`images/${file.name}`).getMetadata().then((metadata) => {
                // Metadata now contains the metadata for 'filepond/${file.name}'
                let metadataFile = { 
                    name: metadata.name, 
                    size: metadata.size, 
                    contentType: metadata.contentType, 
                    user:  this.state.user.email,
                   timestamp: new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp)
               //  stateCopy: this.state.stateCopy
                }
    
                //Process save metadata
                const databaseRef = fire.database().ref('/image');
                databaseRef.push({  metadataFile });
    
            })
           

            // Delay before delete file from state
         //   setTimeout(() => {
         //       delete stateCopy.uploadFilesObj[fileObjKey];
         //       this.setState(stateCopy);
         //   }, 0.5);
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
       //ลบข้อมูล Metada จาก Firebase
  deleteMetaDataFromDatabase(e, rowData) {
    
        const storageRef = fire.storage().ref(`images/${rowData.name}`);
    
        // Delete the file on storage
        storageRef.delete()
          .then(() => {
            console.log("Delete file success");
    
            let databaseRef = fire.database().ref('/image');
    
            // Delete the file on realtime database
            databaseRef.child(rowData.key).remove()
              .then(() => {
                console.log("Delete metada success");
                this.getMetaDataFromDatabase()
              })
              .catch((error) => {
                console.log("Delete metada error : ", error.message);
              });
    
          })
    
          .catch((error) => {
            console.log("Delete file error : ", error.message);
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
               timestamp:(fileData.metadataFile.timestamp),
             //   stateCopy: fileData.metadataFile.stateCopy
               
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
            const {uploadFilesObj} = this.state;
            return (
                <div class="App-div.container">
                   <img src={logo} className="App-logo" alt="logo" />
                   <div class="p">
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hi ♥ {this.state.user.displayName || this.state.user.email }&nbsp;&nbsp;&nbsp;&nbsp;</p> 
                            <Link to="/" ><button className="loginBtn--N" onClick = {this.logout}>Logout</button></Link>  
                            </div>                 
                            <hr/>
                    <nav class="App-nav">
                        <section className="App-item">
                            <form onSubmit={this.uploadSubmit}>
                            <div class="inpc">
                    <input 
                        type="file" 
                        accept=".jpg, .png, .tiff"
                        multiple 
                        ref={input => {
                            this.fileInput = input;
                        }} />
                           <button className="loginBtn2 loginBtn--U" type="submit">Upload</button>
                        
                        </div>
                 
                </form>
              
                <br/>
                <br/>
                <div class="barPro">
                {
                    Object.keys(uploadFilesObj).map( (key, index) => {
                        const fileObj = uploadFilesObj[key];
                        return (
                            <div key={index}>
                                <progress value={fileObj.progressPercent} max="100"></progress>&nbsp; &nbsp;{fileObj.progressPercent}%
                                <p>{fileObj.fileName}</p>
                                <br/>
                            </div>
                        );
                    })
                }
                </div>
                        </section>
                    </nav>
                    <section className="display-item">
                        <article className="App-article">
                            <div class="showprogress">
     
                      <StorageDataTable
                        rows={rows}
                        filesMetadata={filesMetadata}
                       user={user}
                       deleteData={this.deleteMetaDataFromDatabase}

                    /> </div>
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