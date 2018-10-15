import React, { Component } from 'react';
import DocumentInput from './DocumentInput';
import Home from './Home';
import fire from '../config/Fire';
import { auth } from '../config/Fire';
import Popup from "reactjs-popup";
import './tablestyle.css';
var dateFormat = require('dateformat');
class UploadFolders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            keyDtb: '',
            documents: [],
            rows: [],
            folderKey: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sendDTB = this.sendDTB.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.renderFolder = this.renderFolder.bind(this);
    }
    componentWillMount() {
        this.getdataFromDatabase()
        this.getImageFromDatabase()
    }
    handleChange(event) {
        this.setState({ value: event.target.value })
        // console.log(this.state.value)
    }
    handleSubmit(event) {
        // console.log(this.state.value)
        const folderName = this.state.value
        event.preventDefault();
        this.setState({ folderName: folderName })
        const documents = this.state.documents.concat(DocumentInput);

        this.setState({ documents }, () => console.log(this.state.documents));
        this.sendDTB(folderName)


    }
    sendDTB(folderName) {

        let sendName = {
            name: folderName,
            create: dateFormat(new Date(), "h:MM:ss TT"),
            UserId: this.state.user.email
        }
        // let usertt = this.props.index
        const databaseRef = fire.database().ref('/Folders');
        const FolderDTB = databaseRef.push({ sendName });
        const keyDtb = FolderDTB.key
        this.setState({ keyDtb: keyDtb })
        console.log(keyDtb)
    }
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user });
            }
        });
    }


    getdataFromDatabase() {
        //    console.log("getMetaDataFromDatabase");
        const dataRef = fire.database().ref('Folders');

        dataRef.on('value', (snapshot) => {
            let rows = [];

            snapshot.forEach(function (childSnapshot) {
                rows.push({

                    key: childSnapshot.key,
                    name: childSnapshot.val().sendName.name,
                    create: childSnapshot.val().sendName.create,
                    UserId: childSnapshot.val().sendName.UserId,
                });
            });

            this.setState({
                rows: rows
            });
            console.log(rows)
        });
    }
    getImageFromDatabase() {
        //    console.log("getMetaDataFromDatabase");
        const dataRef = fire.database().ref('image');

        dataRef.on('value', (snapshot) => {
            let imageRows = [];

            snapshot.forEach(function (childSnapshot) {
                imageRows.push({

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
                imageRows: imageRows
            });
        });
    }
    fileUpload(event, folderKey) {
        event.preventDefault();
        console.log("this is folder key :" + folderKey.key)
        this.setState({ folderKey: folderKey })
        //    this.setState(folderKey)

    }
    ClearUser = () => {
        this.setState({ folderKey: "" })
    }
    DelFolder = (event, rowData) => {
        event.preventDefault();
        console.log(this.state.imageRows)
        var arrays = []
        this.state.imageRows.forEach((r) => {
            if (r.keyUser === rowData.key) {
                arrays.push(r)
            }
        });
        arrays.forEach((rowData) => {
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
        console.log(arrays)
        let databaseRef = fire.database().ref('/Folders');

        // Delete the file on realtime database
        databaseRef.child(rowData.key).remove()
            .then(() => {
                console.log("Delete metada success");

            })
            .catch((error) => {
                console.log("Delete metada error : ", error.message);
            });

    }
    renderFolder() {
        if (this.state.user) {
            if (this.state.folderKey) {
                const { folderKey } = this.state
                return (
                    <div>
                        <Home
                            ClearUser={this.ClearUser}
                            folderKey={folderKey}
                        />
                    </div>
                )
            } else {
                const { user, rows } = this.state;


                // const documents = this.state.documents.map((element, index) => {
                //     return (
                //         <DocumentInput
                //             key={shortid.generate()}
                //             index={element + index}
                //         >
                //         </DocumentInput>
                //     )
                // });

                return (
                    <div>
                        <p class="p">Hi {this.state.user.displayName || this.state.user.email}</p>
                        <Popup trigger={<button className="buttonDel"> Create Folder </button>} modal>
                            {close => (
                                <div className="Dmodal">
                                    <div className="Dheader">  Name:
                        <input type="text" value={this.state.value} name="name" onChange={this.handleChange} /></div>
                                    <div className="Dactions">
                                        <button className="buttonDel2" onClick={(e) => {
                                            this.handleSubmit(e)
                                            close()
                                        }}>Create</button>
                                        <button
                                            className="buttonDel3"
                                            onClick={() => {
                                                console.log('modal closed')
                                                close()
                                            }}
                                        >
                                            Cancel</button>
                                    </div>
                                </div>
                            )}</Popup>
                        {/* <form onSubmit={this.handleSubmit}>
                                        Name:
                        <input type="text" value={this.state.value} name="name" onChange={this.handleChange} />
                                        <input type="submit" value="Submit" />
                                    </form> */}
                        <div align="center">
                            {/* <br /> <br /> <br /> <br /> <br />
                                    {folderName}
                                    <br />
                                    {documents} */}
                            <DocumentInput
                                rows={rows}
                                user={user}
                                goUpload={this.fileUpload}
                                DelFolder={this.DelFolder}
                            />
                        </div>
                        {/* <Home 
                                    keyDtb={keyDtb} /> */}
                    </div>
                )

            }

        }
    }
    render() {
        return (
            <div>
                {this.renderFolder()}
            </div>
        )

    }
}
export default UploadFolders;