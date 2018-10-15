import React, { Component } from 'react';
import fire from '../config/Fire';
import './home.css';
import { Link } from 'react-router-dom'
import logo from '../config/Ling logo.png';
import { auth } from '../config/Fire';
import AdminPageFile from './AdminPageFile';
import "react-sweet-progress/lib/style.css";
class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            keyDtb: '',
            arrayName: [],
            rows: [],
            folderKey: '',
        }
        this.logout = this.logout.bind(this);
        this.renderUpload = this.renderUpload.bind(this);
        this.deleteMetaDataFromDatabase = this.deleteMetaDataFromDatabase.bind(this);
        this.getfileurl = this.getfileurl.bind(this);
        this.strRef = fire.storage().ref();
        this.sortsize = this.sortsize.bind(this);
        this.sortname = this.sortname.bind(this);
    } 
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user });
            }
        });
    }
    componentWillMount() {
        this.getMetaDataFromDatabase()
    }
    logout() {
        fire.auth().signOut();
        this.setState({ user: null });
    }
    getfileurl(event, row) {
        event.preventDefault();
        var kurl = 'images/' + row.name;
        this.strRef.child(kurl).getDownloadURL().then(function (url) {
            // `url` is the download URL for 'images/stars.jpg'

            // This can be downloaded directly:
            var xhr = new XMLHttpRequest();

            xhr.responseType = 'blob';
            xhr.onload = function (event) {
                var a = document.createElement('a');
                a.href = window.URL.createObjectURL(xhr.response);
                a.download = 'images/' + row.name; // Name the file anything you'd like.
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
            };
            xhr.open('GET', url);
            xhr.send();

        }).catch(function (error) {

            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/object-not-found':
                    // File doesn't exist
                    break;

                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;

                case 'storage/canceled':
                    // User canceled the upload
                    break;

                case 'storage/unknown':
                    // Unknown error occurred, inspect the server response
                    break;
            }
        });
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
                    pic: childSnapshot.val().metadataFile.pic,
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
    deleteMetaDataFromDatabase(rowData) {
        console.log(rowData)
        const storageRef = fire.storage().ref(`images/${rowData.name}`);
        const storageRef64 = fire.storage().ref(`64/resized-${rowData.name}`);
        const storageRef512 = fire.storage().ref(`512/resized-${rowData.name}`);

        // Delete the file on storage
        storageRef.delete()
        storageRef64.delete()
        storageRef512.delete()
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
    deleteAll = (arrayName) => {
        console.log(arrayName)
        arrayName.forEach((rowData) => {
            const storageRef = fire.storage().ref(`images/${rowData.name}`);
        const storageRef64 = fire.storage().ref(`64/resized-${rowData.name}`);
        const storageRef512 = fire.storage().ref(`512/resized-${rowData.name}`);

        // Delete the file on storage
        storageRef.delete()
        storageRef64.delete()
        storageRef512.delete()
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
        })
    }
    downloadAll = (arrayName) => {
        console.log(arrayName)
        arrayName.forEach((row) => {
            var kurl = 'images/' + row.name;
            this.strRef.child(kurl).getDownloadURL().then(function (url) {
                // `url` is the download URL for 'images/stars.jpg'
    
                // This can be downloaded directly:
                var xhr = new XMLHttpRequest();
    
                xhr.responseType = 'blob';
                xhr.onload = function (event) {
                    var a = document.createElement('a');
                    a.href = window.URL.createObjectURL(xhr.response);
                    a.download = 'images/' + row.name; // Name the file anything you'd like.
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                };
                xhr.open('GET', url);
                xhr.send();
    
            }).catch(function (error) {
    
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/object-not-found':
                        // File doesn't exist
                        break;
    
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
    
                    case 'storage/canceled':
                        // User canceled the upload
                        break;
    
                    case 'storage/unknown':
                        // Unknown error occurred, inspect the server response
                        break;
                }
            });
        })
    }
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
    renderUpload() {
        if (this.state.user) {
            const { rows } = this.state;
            console.log(this.props.folderKey)
            const folderKey = this.props.folderKey
            return (
                <div class="App-div.container">
                    <img src={logo} className="App-logo" alt="logo" />
                    <div class="p">
                        <p>Hi ♥ {this.state.user.displayName || this.state.user.email}</p>
                        <p>You in folder: {folderKey.name} User: {folderKey.UserId}</p>
                        <button className="loginBtn--N" onClick={(e) => this.props.ClearUser(e, folderKey)} >Back</button>
                        <Link to="/" ><button className="loginBtn--N" onClick={this.logout}>Logout</button></Link>
                    </div>
                    <hr />

                    <section >

                        <div class="showprogress">

                            <AdminPageFile
                                rows={rows}
                                user={folderKey.UserId}
                                folderKey={folderKey}
                                deleteData={this.deleteMetaDataFromDatabase}
                                goto={this.getfileurl}
                                deleteAll={this.deleteAll}
                                downloadAll={this.downloadAll}
                                sortsize={this.sortsize}
                                sortname={this.sortname}
                            />
                        </div>

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
export default AdminPage;