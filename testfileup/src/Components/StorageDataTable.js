import React, { Component } from 'react';
import Popup from "reactjs-popup";
import './StorageDataTable.css';
import fire from '../config/Fire';
class StorageDataTable extends Component{
    
    constructor(props){
        super(props);
    }

    render() {
        const user = this.props.user;
        
        //console.log(user.email)
        let messageNodes = this.props.rows.map((r) => {
            var restname = 'resized-'+r.name;
            if(user.email === r.user){
            return (
                <tr key={r.no + r.name}>
                    <th >{r.name}</th>
                    <th>{r.contentType}</th>
                    <th className="mbt">{((r.size)/1000000).toFixed(3)}</th>       
                    <th>{r.timestamp} </th>   
                    <th className="tht"><Popup trigger={<div><img  src = {r.pic64}  alt = "pic64*64" /></div>} modal>
                                                    {close => (
                                                        <div className="Dmodal">
                                                        <img  src = {r.pic512}  alt = "pic64*64" />
                                                        </div>
                                                    )}</Popup></th>           
                    <th className="tht"><Popup trigger={<button className="button"> Delete </button>} modal>
                                                    {close => (
                                                        <div className="Dmodal">
                                                            <div className="Dheader"> Do you want to Delete </div>
                                                            <div className="Dactions">
                                                                <button className="button" onClick={() => {this.props.deleteData(r)
                                                                    close()}}>Yes</button>
                                                                <button
                                                                    className="button"
                                                                    onClick={() => {
                                                                        console.log('modal closed')
                                                                        close()
                                                                    }}
                                                                >
                                                                    No</button>
                                                            </div>
                                                        </div>
                                                    )}</Popup></th>
                                                  
                                        
                </tr>
            )}
            else {

            }
        });
        return (
            
            <div>
                <table id="t01">
                    <thead>
                        <tr >
                            <th className="tht"><a onClick={this.props.sortname}>File Name</a></th>
                            <th className="tht">File Type</th>
                            <th className="tht"><a onClick={this.props.sortsize}>File Size (MB)</a><br/></th> 
                            <th className="tht">Date</th>      
                            <th className="tht">Preview</th>    
                            <th className="tht">Delete</th>        
                                                           
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

export default StorageDataTable;