import React, { Component } from 'react';
    
class StorageDataTable extends Component{
    
    constructor(props){
        super(props);
    }
    render() {
        const user = this.props.user;
        const fixprogress = this.props.fixprogress;
    
        console.log(user.email)
        let messageNodes = this.props.rows.map((r) => {
            if(user.email === r.user){
            return (
                
                <tr key={r.no + r.name}>
                    <th>{r.name}</th>
                    <th>{r.contentType}</th>
                    <th>{r.size} </th>
                   <th>{fixprogress} </th>
                </tr>
            )}
            else {

            }
        });
        return (
            <div>
                <table id="t01">
                    <thead>
                        <tr>
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