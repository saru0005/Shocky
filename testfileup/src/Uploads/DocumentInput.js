import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import fire from '../config/Fire';
import { auth } from '../config/Fire';
import Home from '../Uploads/Home';
import './tablestyle.css';
class DocumentInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const user = this.props.user;
        //console.log(user.email)
        // const keyDtb = this.props.keyDtb
        // console.log(keyDtb)
        let messageNodes = this.props.rows.map((r) => {
            if (user.email === r.UserId) {
                return (

                    <tr id="t02" key={r.no + r.name}>

                        <th >{r.name}</th>
                        <th>{r.create}</th>
                        <th>
                        <button className="buttonDel3" onClick={(e) => this.props.goUpload(e, r)}>Upload</button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                        <button className="buttonDel2" onClick={(e) => this.props.DelFolder(e, r)}>Delete Folder</button></th>

                    </tr>
                )
            }
        });
        return (
            <div class="foldersel">
                <table>
                    <thead>
                        <tr>
                            <th class="tht2">Folder Name</th>
                            <th class="tht2">Date</th>
                            <th id="t02" class="tht2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {messageNodes}
                    </tbody>
                </table>
                {/* <button id="addBtn" onClick={this.onClick}>ADD</button> */}
            </div>
        );
    }
}
export default DocumentInput;