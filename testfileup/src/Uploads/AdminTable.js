import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import fire from '../config/Fire';
import { auth } from '../config/Fire';

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
      
        return (
            
            <tr key={r.no + r.name}>
                 
                <th >{r.UserId}</th>
                {/* <th>{r.name}</th>  
                <th>{r.create}</th>   */}
                <th><button className="buttonDel3" onClick= {(e) => this.props.goUpload(e, r) }>View Folder</button>  </th>   
                    
                                    
            </tr>
        )
    });
    return (
        
        <div className="thbor" align="center">
       
                    {messageNodes}

        </div>
      );
}
}
export default DocumentInput;