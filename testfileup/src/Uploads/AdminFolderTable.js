import React, { Component } from 'react';


class AdminFolderTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const UserNameID = this.props.UserNameID;
    let messageNodes = this.props.rows.map((r) => {
      if(r.UserId === UserNameID.UserId)
        return (
            
            <tr key={r.no + r.name}>
                 
                <th >{r.UserId}</th>
                <th>{r.name}</th>  
                <th>{r.create}</th>  
                <th><button className="buttonDel3" onClick= {(e) => this.props.goUpload(e, r) }>View Folder</button>  </th>   
                <th><button className="buttonDel2" onClick= {(e) => this.props.DelFolder(e,r) }>Delete Folder</button></th>    
                                    
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
export default AdminFolderTable;