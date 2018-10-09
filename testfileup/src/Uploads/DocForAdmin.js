// import React, { Component } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom'
// import fire from '../config/Fire';
// import { auth } from '../config/Fire';
// import Home from '../Uploads/Home';
// class DocForAdmin extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     const user = this.props.user;
//     const dataRef = fire.database().ref('Folders');
//     //console.log(user.email)
//     // const keyDtb = this.props.keyDtb
//     // console.log(keyDtb)
//     let messageNodes = this.props.rows.map((r) => {
//         {
//         return (
            
//             <tr key={r.no + r.name}>
                 
//                 <th >{r.UserId}</th>
                
//                 <th> <button className="button" onClick= {(e) => this.props.goUpload(e, r) }>Upload</button>  </th>   
                    
                                    
//             </tr>
//         )}
//     });
//     return (
        
//         <div className="thbor">
       
//                     {messageNodes}

//         </div>
//       );
// }
// }
// export default DocForAdmin;