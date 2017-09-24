import { Meteor } from "meteor/meteor"
import React from "react";
import { withRouter, Switch, BrowserRouter, Route, Redirect, Link } from "react-router-dom";

import RenderNotesBySubject from "./subComponents/renderNotesBySubject";
import RenderNotesByUnit from "./subComponents/renderNotesByUnit"
import Menu from "./subComponents/Menu"
import { SubjectRoutes } from "./subjectRoutes/subjectRoutes"
import FilterNotesMenu from "./subComponents/filterNotesMenu"

class Notes extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
      notes: []
    };
  }
  checkIfSubject(){
    if(SubjectRoutes.includes(this.props.match.params.subject)){
      return <h1>Here are all the {this.props.match.params.subject} notes.</h1>
    }else{
      return <h2>Subject not found...:(</h2>
    }
  }
  render(){
    return (
      <div className="center">
        <Menu />
        {this.checkIfSubject()}
        <FilterNotesMenu subject={this.props.match.params.subject}/>
        {this.state.notes}
      </div>
    )
  }
}

export default withRouter(Notes);
