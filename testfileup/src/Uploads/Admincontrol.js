import React, { Component } from 'react';
import firebase from '../config/Fire';
import { Link } from 'react-router-dom'
import logo from '../config/Ling logo.png';
import fire from '../config/Fire';
import { auth } from '../config/Fire';
import AdminTable from './AdminTable';
import AdminPage from './AdminPage';
class Admincontrol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            keyDtb: '',
            documents: [],
            rows: [],
            folderKey: '',
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
            console.log(rows)
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

                return (
                    <div>
                        <p>Hi ♥ {this.state.user.displayName || this.state.user.email}</p>
                        <div>
                            <AdminTable
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
export default Admincontrol;