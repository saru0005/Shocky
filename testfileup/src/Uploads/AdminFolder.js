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

   
   
    viewUpload(event ,folderKey){
        event.preventDefault();
        console.log("this is folder key :" + folderKey.key)
        this.setState({folderKey : folderKey})
    //    this.setState(folderKey)
    
}
    renderFolder() {
        var _this = this
        if (this.state.user) {
            if (this.state.folderKey) {
                const { folderKey } = this.state
                return (
                    <div>
                        <AdminPage
                    folderKey={folderKey}
                    />
                    </div>
                )
            } else {
                const { user, rows } = this.state;
                const UserNameID = this.props.UserNameID
                return (
                    <div>
                        <p>You are in user :{UserNameID.UserId}</p>
                        <div>
                            <AdminFolderTable
                                UserNameID={UserNameID}
                                rows={rows}
                                goUpload={this.viewUpload}
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