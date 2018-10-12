import React, { Component } from 'react';
import fire from '../config/Fire';
import { auth } from '../config/Fire';
import AdminFolderTable from './AdminFolderTable';
import AdminPage from './AdminPage';
class AdminFolder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: []
        }
        this.renderFolder = this.renderFolder.bind(this);
        this.viewUpload = this.viewUpload.bind(this);
    }
    componentWillMount() {
        this.getdataFromDatabase()
        this.getImageFromDatabase()
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



    viewUpload(event, folderKey) {
        event.preventDefault();
        console.log("this is folder key :" + folderKey.key)
        this.setState({ folderKey: folderKey })
        //    this.setState(folderKey)

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
        var _this = this
        const UserNameID = this.props.UserNameID
        if (this.state.user) {
            if (this.state.folderKey) {
                const { folderKey } = this.state
                return (
                    <div>
                        <AdminPage
                            UserNameID={UserNameID}
                            folderKey={folderKey}
                            ClearUser={_this.props.ClearUser}
                        />
                    </div>
                )
            } else {
                const { user, rows } = this.state;

                return (
                    <div>
                        <p>You are in user :{UserNameID.UserId}</p>
                        <div>
                            <AdminFolderTable
                                UserNameID={UserNameID}
                                rows={rows}
                                goUpload={this.viewUpload}
                                DelFolder={this.DelFolder}
                            />
                        </div>
                    </div>
                )

            }

        }
        else {
            return (
                <div>
                    OMFG
            </div>
            )
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
export default AdminFolder;