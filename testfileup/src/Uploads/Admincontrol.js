import React, { Component } from 'react';
import fire from '../config/Fire';
import { auth } from '../config/Fire';
import AdminTable from './AdminTable';
import AdminFolder from './AdminFolder';
import { Link } from 'react-router-dom'
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
        this.ClearUser = this.ClearUser.bind(this);
        this.logout = this.logout.bind(this);
    }
    logout() {
        fire.auth().signOut();
        this.setState({ user: null });
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


            this.removeDuplicates(rows, 'UserId')
            // console.log(rows)
        });
    }
    removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject = {};

        for (var i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }

        for (i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        this.setState({
            rows: newArray
        });
    }


    viewUpload(event, UserNameID) {
        event.preventDefault();
        console.log("this is folder key :" + UserNameID.UserId)
        this.setState({ UserNameID: UserNameID })
        //    this.setState(folderKey)

    }
    ClearUser(event, UserNameID) {
        event.preventDefault();
        // console.log("this is folder key :" + UserNameID.UserId)
        this.setState({ UserNameID: "" })
        //    this.setState(folderKey)

    }
    renderFolder() {
        if (this.state.user) {
            if (this.state.UserNameID) {
                const { UserNameID } = this.state
                return (
                    <div>
                        <AdminFolder
                            UserNameID={UserNameID}
                            ClearUser={this.ClearUser}
                        />
                    </div>
                )
            } else {
                const { rows } = this.state;

                return (
                    <div >
                        <div class="p">
                            <p>Hi ♥ {this.state.user.displayName || this.state.user.email}</p>
                            <Link to="/" ><button className="loginBtn--N" onClick={this.logout}>Logout</button></Link>
                        </div>
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