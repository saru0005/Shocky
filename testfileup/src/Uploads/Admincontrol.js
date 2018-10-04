import React, { Component } from 'react';
import firebase from '../config/Fire';
import { Link } from 'react-router-dom'
import logo from '../config/Ling logo.png';
<<<<<<< HEAD
import fire from '../config/Fire';
import { auth } from '../config/Fire';
import AdminTable from './AdminTable';
import AdminPage from './AdminPage';
=======
import DocForAdmin from './DocForAdmin';
import Home from './Home';
import fire from '../config/Fire';
import { auth } from '../config/Fire';
var shortid = require('shortid');
var dateFormat = require('dateformat');
>>>>>>> 3fd6491bde4f2c8eca6476c01d3a444d633c2cac
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
<<<<<<< HEAD
        this.renderFolder = this.renderFolder.bind(this);
        this.viewUpload = this.viewUpload.bind(this);
=======
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sendDTB = this.sendDTB.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.renderFolder = this.renderFolder.bind(this);
>>>>>>> 3fd6491bde4f2c8eca6476c01d3a444d633c2cac
    }
    componentWillMount() {
        this.getdataFromDatabase()
    }
<<<<<<< HEAD
=======
    handleChange(event) {
        this.setState({ value: event.target.value })
    }
    handleSubmit(event) {
        const folderName = this.state.value
        event.preventDefault();
        this.setState({ folderName: folderName })
        const documents = this.state.documents.concat(DocForAdmin);

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
>>>>>>> 3fd6491bde4f2c8eca6476c01d3a444d633c2cac
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user });
            }
        });
    }
<<<<<<< HEAD
=======


>>>>>>> 3fd6491bde4f2c8eca6476c01d3a444d633c2cac
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 3fd6491bde4f2c8eca6476c01d3a444d633c2cac
                    folderKey={folderKey}
                    />
                    </div>
                )
<<<<<<< HEAD
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
=======
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
                                        <DocForAdmin
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
>>>>>>> 3fd6491bde4f2c8eca6476c01d3a444d633c2cac

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