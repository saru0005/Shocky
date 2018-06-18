import React, { Component } from 'react';
import {auth} from '../config/Fire';
class StorageDataTable extends Component{
    
    constructor(props){
        super(props);
    }
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user });
            }
        });
      }
    render() {
        
        let messageNodes = this.props.rows.map((r) => {
            return (
                <tr key={r.no + r.name}>
                    <th>{r.no}</th>
                    <th>{r.name}</th>
                    <th>{r.contentType}</th>
                    <th>{r.size} Mb</th>
                </tr>
            )
        });
        return (
            <div>
                <table id="t01">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>File Name</th>
                            <th>File Type</th>
                            <th>File Size</th>
                            <th>Progress</th>
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