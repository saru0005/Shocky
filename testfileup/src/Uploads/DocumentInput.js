import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import fire from '../config/Fire';
import { auth } from '../config/Fire';
import Home from '../Uploads/Home';
class DocumentInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const user = this.props.user;
    //console.log(user.email)
    const keyDtb = this.props.keyDtb
    console.log(keyDtb)
    let messageNodes = this.props.rows.map((r) => {
        if(user.email === r.UserId){
        return (
            
            <tr key={r.no + r.name}>
                 <th >{r.key}</th>
                <th >{r.name}</th>
                <th>{r.create}</th> 
                <th>{r.UserId} </th>   
                <th>    <button className="button" onClick= {this.props.fileUpload() }>Upload</button>  </th>   
                    
                                    
            </tr>
        )}
    });
    return (
        
        <div className="thbor">
       
                    {messageNodes}

        </div>
      );
}
}
export default DocumentInput;