import React, { Component } from 'react';
import Popup from "reactjs-popup";
import fire from '../config/Fire';
class StorageDataTable extends Component{
    
    constructor(props){
        super(props);
    }

    render() {
        const user = this.props.user;
        const folderKey = this.props.folderKey
        //console.log(user.email)
        let messageNodes = this.props.rows.map((r) => {
            if(user === r.user){
                if(r.keyUser === folderKey.key){
                    return (
                        
                        <tr key={r.no + r.name}>
                            <th >{r.name}</th>
                            <th>{r.contentType}</th>
                            <th className="mbt">{((r.size)/1000000).toFixed(3)}</th>       
                            <th>{r.timestamp} </th>   
                            {/* <th className="tht"><Popup trigger={<div><img  src = {r.pic64} alt = "pic64*64" /></div>} modal>
                                                            {close => (
                                                                <div className="Dmodal">
                                                                <img  src = {r.pic}  alt = "pic64*64" />
                                                                </div>
                                                            )}</Popup></th>            */}
                            <th><button className="button" onClick= {(e) => this.props.goto(e, r) }>view Folder</button>  </th>  
                            <th className="tht"><a class="button"  download="http://en.es-static.us/upl/2017/02/sirius-2-19-2018-Jim-Livingston-Custer-SD-lg-e1519156718851.jpg">Download image</a></th>           
                            <th className="tht"><Popup trigger={<button className="buttonDel"> Delete </button>} modal>
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
                    )
                }
          }
            else {

            }
        });
        return (
            
            <div className="thbor">
                <table>
                    <thead>
                        <tr >
                            <th className="tht2"><a onClick={this.props.sortname}>File Name</a></th>
                            <th className="tht2">File Type</th>
                            <th className="tht2"><a onClick={this.props.sortsize}>File Size (MB)</a><br/></th> 
                            <th className="tht2">Date</th>      
                            <th className="tht2">Preview</th>    
                            <th className="tht2">Delete</th>        
                                                           
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