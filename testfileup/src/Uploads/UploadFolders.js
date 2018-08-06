import React, { Component } from 'react';
import firebase from '../config/Fire';
import { Link } from 'react-router-dom'
import logo from '../config/Ling logo.png';
import DocumentInput from './DocumentInput';
import fire from '../config/Fire';
import { auth } from '../config/Fire';
var shortid = require('shortid');
var dateFormat = require('dateformat');
class UploadFolders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            folderName: '',
            documents: [],
            rows: [],
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sendDTB = this.sendDTB.bind(this);
    }
    componentWillMount() {
        this.getdataFromDatabase()
    }
    handleChange(event) {
        this.setState({ value: event.target.value })
    }
    handleSubmit(event) {
        const folderName = this.state.value
        event.preventDefault();
        this.setState({ folderName: folderName })
        const documents = this.state.documents.concat(DocumentInput);

        this.setState({ documents }, () => console.log(this.state.documents));
        this.sendDTB(folderName)
    }
    sendDTB(folderName) {
        console.log("OMG This is a Name" + folderName)
        let sendName = {
            name: folderName,
            create: dateFormat(new Date(), "h:MM:ss TT"),
            UserId: this.state.user.email
        }
        console.log("This is a papika" + sendName)
        // let usertt = this.props.index
        const databaseRef = fire.database().ref('/Folders');
        databaseRef.push({ sendName });
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
    renderFolder() {
        if (this.state.user) {
            const { folderName, user, rows } = this.state;
            console.log("testtttttttttt"+rows)
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
                    <p>Hi ♥ {this.state.user.displayName || this.state.user.email}</p>
                    <form onSubmit={this.handleSubmit}>
                        Name:
        <input type="text" value={this.state.value} name="name" onChange={this.handleChange} />
                        <input type="submit" value="Submit" />
                    </form>
                    <button onClick={this.showDialog}>Show</button>
                    <div>
                        {/* <br /> <br /> <br /> <br /> <br />
                    {folderName}
                    <br />
                    {documents} */}
                        <DocumentInput
                        rows={rows}
                            user={user}
                        />
                    </div>
                </div>
            )
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
export default UploadFolders;