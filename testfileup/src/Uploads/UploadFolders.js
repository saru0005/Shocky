import React, { Component } from 'react';
import firebase from '../config/Fire';
import { Link } from 'react-router-dom'
import logo from '../config/Ling logo.png';
import DocumentInput from './DocumentInput';
import Home from './Home';
import fire from '../config/Fire';
import { auth } from '../config/Fire';
var shortid = require('shortid');
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

        let sendName = {
            name: folderName,
            create: dateFormat(new Date(), "h:MM:ss TT"),
            UserId: this.state.user.email
        }
        // let usertt = this.props.index
        const databaseRef = fire.database().ref('/Folders');
        const FolderDTB =  databaseRef.push({ sendName });
        const keyDtb = FolderDTB.key
        this.setState({keyDtb : keyDtb})
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
        fileUpload(event ,folderKey){
            event.preventDefault();
            console.log("this is folder key :" + folderKey.key)
            this.setState({folderKey : folderKey})
        //    this.setState(folderKey)
        
    }
    renderFolder() {
        var _this = this
        if (this.state.user) {
            if(this.state.folderKey){
                const {folderKey} = this.state
                return(
                    <div>
                    <Home
                    folderKey={folderKey}
                    />
                    </div>
                )
            }else{
                const {  user, rows,keyDtb } = this.state;
                
                           
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
                                    <div>
                                        {/* <br /> <br /> <br /> <br /> <br />
                                    {folderName}
                                    <br />
                                    {documents} */}
                                        <DocumentInput
                                        rows={rows}
                                            user={user}
                                            goUpload={this.fileUpload}
                                        />
                                    </div>
                                    {/* <Home 
                                    keyDtb={keyDtb} /> */}
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
export default UploadFolders;