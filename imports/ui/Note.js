import { Meteor } from "meteor/meteor"
import React from "react";
import { withRouter, Switch, BrowserRouter, Route, Redirect, Link } from "react-router-dom";

import RenderNotesBySubject from "./renderNotesBySubject";
import Menu from "./Menu"
import { SubjectRoutes } from "./subjectRoutes/subjectRoutes"

class Notes extends React.Component{
  checkIfSubject(){
    if(SubjectRoutes.includes(this.props.match.params.subject)){
      return <h1>Here are all the {this.props.match.params.subject} notes.</h1>
    }else{
      return <h2>Subject not found....:(</h2>
    }
  }
  render(){
    return (
      <div className="center">
        <Menu />
        {this.checkIfSubject()}
        <RenderNotesBySubject filter={this.props.match.params.subject}/>
      </div>
    )
  }
}

export default withRouter(Notes);
