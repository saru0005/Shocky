import React, { Component } from 'react';
import DocumentInput from './DocumentInput';
import axios from 'axios';
var shortid = require('shortid');

class DocumentsFieldSet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      documents: [],
      name:'newfolder',
    }

    this.add = this.add.bind(this);
  }
  add() {
    const documents = this.state.documents.concat(this.state.name);

    this.setState({ documents }, () => console.log(this.state.documents));
  }
  render() {

    const documents = this.state.documents.map((element, index) => {
      return (
        <DocumentInput
         key={shortid.generate()}
          index={element+index}
        >
        </DocumentInput>
      )

    });

    return <div>

      <button onClick={this.add}>Add</button>
      <div className="inputs">
        {documents}
      </div>
    </div>
  }

}
export default DocumentsFieldSet;