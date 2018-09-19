import React, { Component } from 'react';
import fire from '../config/Fire';
import './home.css';
import { Link } from 'react-router-dom'
import logo from '../config/Ling logo.png';
import { auth } from '../config/Fire';
import IconCancel from '../IconCancel.png';
import IconPause from '../IconPause.png';
import IconPlay from '../IconPlay.png';
//Import StorageDataTable
import StorageDataTable from '../Components/StorageDataTable';
import Popup from "reactjs-popup";

class Home extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.uploadSubmit = this.uploadSubmit.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.sortsize = this.sortsize.bind(this);
        this.sortname = this.sortname.bind(this);
        this.testgetURL = this.testgetURL.bind(this);
        this.strRef = fire.storage().ref();
        this.state = {
            files: [], //ใช้เก็บข้อมูล File ที่ Upload
            progress: 0, //ใช้เพื่อดู Process การ Upload
            filesMetadata: [], //ใช้เพื่อรับข้อมูล Metadata จาก Firebase
            rows: [], //ใช้วาด DataTable
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
        this.setState({ user: null });
    }
    //new multi
    uploadSubmit(event) {
        event.preventDefault();
        const allFiles = Array.from(this.fileInput.files);
        if (allFiles.length > 0) {
            // Add each files to state
            var tempUploadFilesObj = {};
            allFiles.forEach((file, index) => {
                var fileObj = {};
                fileObj.fileName = file.name;
                fileObj.isUploading = true;
                fileObj.progressPercent = 0;
                fileObj.uploadTask = 1;
                const objKey = `file${index}`;
                tempUploadFilesObj[objKey] = fileObj;
            });
            this.setState({
                uploadFilesObj: tempUploadFilesObj
            }, () => {
                // Upload each files & update progress
                allFiles.forEach((file, index) => {
                    this.uploadFile(file, index)
                });
            });

        }


    }
    //new muti upload C.
    uploadFile(file, index) {
        var _this = this;
        var fileObjKey = `file${index}`;
        var metadata = {
            contentType: file.type
        };
        var thisSpecialStrref = this;
        var uploadTask = this.strRef.child(`images/${file.name}`).put(file, metadata);

        uploadTask.on("state_changed", (snapshot) => {
            // Progress handling
            var progressFix = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
                    console.log('Upload is running');
                    break;
                case fire.storage.TaskState.CANCELED:
                    console.log('test')
                    delete stateCopy.uploadFilesObj[fileObjKey];
                    this.setState(stateCopy);
                default:
                    console.log('No default');
            }
        }, (error) => {
            // Error handling
            console.log(error);
            var stateCopy = Object.assign({}, this.state);
            stateCopy.uploadFilesObj[fileObjKey].progressPercent = 0;
            delete stateCopy.uploadFilesObj[fileObjKey];
            this.setState(stateCopy);

        }, () => {
            // Complete handling
            console.log(`Upload #${index} completed`);
            var stateCopy = Object.assign({}, this.state);

            stateCopy.uploadFilesObj[fileObjKey].progressPercent = 100;
            this.setState(stateCopy);
            // console.log(new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp));

            this.testgetURL(file)

            // //Get metadata
            // uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            //     console.log('File available at', downloadURL);



            //     // console.log(new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp));
            //     //Get metadata
            //     thisSpecialStrref.strRef.child(`images/${file.name}`).getMetadata().then((metadata) => {


            //         let metadataFile = {
            //             name: metadata.name,
            //             size: metadata.size,
            //             contentType: metadata.contentType,
            //             user: thisSpecialStrref.state.user.email,
            //             pic64: downloadURL,
            //             timestamp: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(timestamp)
            //             //  stateCopy: this.state.stateCopy
            //         }

            //         //Process save metadata
            //         const databaseRef = fire.database().ref('/image');
            //         databaseRef.push({ metadataFile });

            //         // Delay before delete file from state

            //     })
            // });

            // // Delay before delete file from state
            //   setTimeout(() => {
            //   delete stateCopy.uploadFilesObj[fileObjKey];
            //   this.setState(stateCopy);
            //   }, 0.5);

        });





    }
    testgetURL(file) {
        var originalName = file.name // 01.jpg
        var resized64 = "resized-" + originalName; // resized512_01.jpg
        var resized64Path = "64/" + resized64; // resized/....^
        var resized512 = "resized-" + originalName; // resized512_01.jpg
        var resized512Path = "512/" + resized512; // resized/....^
        var originalPath = "images/" + originalName;
        const timestamp = Date.now();
        const keyUser = this.props.keyUser
        var _this = this
        setTimeout(function () {
            _this.strRef.child(originalPath).getDownloadURL().then(function (downloadURL3) {
                _this.strRef.child(resized64Path).getDownloadURL().then(function (downloadURL) {
                    _this.strRef.child(resized512Path).getDownloadURL().then(function (downloadURL2) {
                        //Get metadata
                        _this.strRef.child(`images/${file.name}`).getMetadata().then((metadata) => {
                

                            let metadataFile = {
                                name: metadata.name,
                                size: metadata.size,
                                contentType: metadata.contentType,
                                user: _this.state.user.email,
                                pic64: downloadURL,
                                pic512: downloadURL2,
                                pic: downloadURL3,
                                keyUser: _this.props.folderKey.key,
                                timestamp: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(timestamp)
                                //  stateCopy: this.state.stateCopy
                            }

                            //Process save metadata
                            const databaseRef = fire.database().ref('/image');
                            databaseRef.push({ metadataFile });

                            // Delay before delete file from state

                        }).catch(function (error) {
                            alert("ตรงนี่เสีย" + file.name)
                        })
                    }).catch(function (error) {
                        _this.testgetURL(file);
                    })
                }).catch(function (error) {
                    _this.testgetURL(file);

                })
            }).catch(function (error) {
                _this.testgetURL(file);
            })
        }, 500);
    }
    btnCancel(fileId) {
        // console.log(fileId)
        var uploadTaskS = Object.assign({}, this.state);
        var uploadTask = uploadTaskS.uploadFilesObj[fileId].uploadTask;
        uploadTask.cancel();

    }
    btnPlay(fileId) {
        // console.log(fileId)
        var uploadTaskS = Object.assign({}, this.state);
        var uploadTask = uploadTaskS.uploadFilesObj[fileId].uploadTask;
        uploadTask.resume();
    }
    btnPause(fileId) {
        // console.log(fileId)
        var uploadTaskS = Object.assign({}, this.state);
        var uploadTask = uploadTaskS.uploadFilesObj[fileId].uploadTask;
        uploadTask.pause();
    }
    componentWillMount() {
        this.getMetaDataFromDatabase()
    }

    //โหลดข้อมูล Metadata จาก Firebase
    getMetaDataFromDatabase() {
        //    console.log("getMetaDataFromDatabase");
        const nameref = fire.database().ref('image');

        nameref.on('value', (snapshot) => {
            let rows = [];

            snapshot.forEach(function (childSnapshot) {
                rows.push({

                    key: childSnapshot.key,
                    name: childSnapshot.val().metadataFile.name,
                    user: childSnapshot.val().metadataFile.user,
                    pic64: childSnapshot.val().metadataFile.pic64,
                    pic512: childSnapshot.val().metadataFile.pic512,
                    contentType: childSnapshot.val().metadataFile.contentType,
                    size: childSnapshot.val().metadataFile.size,
                    keyUser: childSnapshot.val().metadataFile.keyUser,
                    timestamp: childSnapshot.val().metadataFile.timestamp
                });
            });

            this.setState({
                rows: rows
            });
            console.log(rows)
        });
    }
    //sort size
    sortsize() {
        //    console.log("getMetaDataFromDatabase");
        const nameref = fire.database().ref('image').orderByChild('metadataFile/size');

        nameref.on('value', (snapshot) => {
            let rows = [];

            snapshot.forEach(function (childSnapshot) {
                rows.push({

                    key: childSnapshot.key,
                    name: childSnapshot.val().metadataFile.name,
                    user: childSnapshot.val().metadataFile.user,
                    pic64: childSnapshot.val().metadataFile.pic64,
                    pic512: childSnapshot.val().metadataFile.pic512,
                    contentType: childSnapshot.val().metadataFile.contentType,
                    size: childSnapshot.val().metadataFile.size,
                    keyUser: childSnapshot.val().metadataFile.keyUser,
                    timestamp: childSnapshot.val().metadataFile.timestamp
                });
            });

            this.setState({
                rows: rows
            });
            console.log(rows)
        });
    }

    //sort name
    sortname() {
        //    console.log("getMetaDataFromDatabase");
        const nameref = fire.database().ref('image').orderByChild('metadataFile/name');

        nameref.on('value', (snapshot) => {
            let rows = [];

            snapshot.forEach(function (childSnapshot) {
                rows.push({

                    key: childSnapshot.key,
                    name: childSnapshot.val().metadataFile.name,
                    user: childSnapshot.val().metadataFile.user,
                    pic64: childSnapshot.val().metadataFile.pic64,
                    pic512: childSnapshot.val().metadataFile.pic512,
                    contentType: childSnapshot.val().metadataFile.contentType,
                    size: childSnapshot.val().metadataFile.size,
                    keyUser: childSnapshot.val().metadataFile.keyUser,
                    timestamp: childSnapshot.val().metadataFile.timestamp
                });
            });

            this.setState({
                rows: rows
            });
            console.log(rows)
        });
    }
    //ลบข้อมูล Metada จาก Firebase
    deleteMetaDataFromDatabase(rowData) {

        const storageRef = fire.storage().ref(`images/${rowData.key}`);

        // Delete the file on storage
        storageRef.delete()
            .then(() => {
                console.log("Delete file success");

            })

            .catch((error) => {
                console.log("Delete file error : ", error.message);
            });
        let databaseRef = fire.database().ref('/image');

        // Delete the file on realtime database
        databaseRef.child(rowData.key).remove()
            .then(() => {
                console.log("Delete metada success");

            })
            .catch((error) => {
                console.log("Delete metada error : ", error.message);
            });

    }

    // addMetadataToList() {
    //     let i = 1;
    //     let rows = [];

    //     //Loop add data to rows
    //     for (let key in this.state.filesMetadata) {

    //         let fileData = this.state.filesMetadata[key];

    //         let objRows = {
    //             no: i++,
    //             key: key, //ใช้เพื่อ Delete
    //             name: fileData.metadataFile.name,
    //             fullPath: fileData.metadataFile.fullPath,
    //             size: (fileData.metadataFile.size),
    //             contentType: fileData.metadataFile.contentType,
    //             user: fileData.metadataFile.user,
    //             timestamp: (fileData.metadataFile.timestamp),
    //             //   stateCopy: fileData.metadataFile.stateCopy

    //         }

    //         rows.push(objRows)
    //     }

    //     this.setState({
    //         rows: rows
    //     }, () => {
    //         //      console.log('Set Rows')
    //     })
    // }

    renderUpload() {
        if (this.state.user) {
            const { rows, filesMetadata, user, downloadURL } = this.state;
            const { uploadFilesObj } = this.state;
            console.log(this.props.folderKey)
            const folderKey = this.props.folderKey
            return (
                <div class="App-div.container">
                    <img src={logo} className="App-logo" alt="logo" />
                    <div class="p">
                        <p>Hi ♥ {this.state.user.displayName || this.state.user.email}</p>
                        <p>You in folder: {folderKey.name}</p><Link to ="/"><button >Back</button></Link>
                        <Link to="/" ><button className="loginBtn--N" onClick={this.logout}>Logout</button></Link>
                    </div>
                    <hr />
                    <nav class="App-nav">
                        <section>
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

                            <br />
                            <br />
                            <div class="barPro">
                                {
                                    Object.keys(uploadFilesObj).map((key, index) => {
                                        const fileObj = uploadFilesObj[key];
                                        return (
                                            <div key={index}>
                                                <progress value={fileObj.progressPercent} max="100"></progress>&nbsp; &nbsp;{fileObj.progressPercent}%


                                                 <Popup trigger={<button className="button"> <img src={IconCancel} className="IconCancel" alt="Icon" /> </button>} modal>
                                                    {close => (
                                                        <div className="Dmodal">
                                                            <div className="Dheader"> Do you want to Cancel </div>
                                                            <div className="Dactions">
                                                                <button className="button" onClick={() => {

                                                                    this.btnCancel(key)
                                                                    close()
                                                                }}>Yes</button>
                                                                <button
                                                                    className="button"
                                                                    onClick={() => {
                                                                        console.log('modal closed')
                                                                        close()
                                                                    }}
                                                                >
                                                                    No</button>
                                                            </div>
                                                        </div>
                                                    )}</Popup>

                                                <button type="button"><img src={IconPause} className="IconCancel" onClick={() => this.btnPause(key)} alt="Icon" /></button>
                                                <button type="button"><img src={IconPlay} className="IconCancel" onClick={() => this.btnPlay(key)} alt="Icon" /></button>
                                                <p>{fileObj.fileName}</p>
                                                <br />
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </section>
                    </nav>
                    <section >

                        <div class="showprogress">

                            <StorageDataTable
                                rows={rows}
                                filesMetadata={filesMetadata}
                                user={user}
                                deleteData={this.deleteMetaDataFromDatabase}
                                sortsize={this.sortsize}
                                sortname={this.sortname}
                                folderKey={folderKey}
                            /> </div>

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