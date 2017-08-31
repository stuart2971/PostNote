import { Meteor } from "meteor/meteor";
import React from "react";
import { withRouter } from "react-router-dom";
import { Tracker } from "meteor/tracker";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data"

import { Notes } from "../methods/methods";
import SubjectRoutes from "./subjectRoutes/subjectRoutes";
import RenderNotesBySubject from "./subComponents/renderNotesBySubject";
import Menu from "./subComponents/Menu.js";

class Home extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
      notes: []
    };
  }
  componentDidMount() {
    Meteor.subscribe('notes-newest')
    this.tracker = Tracker.autorun(() => {
      const notes = this.props.list
      if(notes == null || notes == undefined){
        return;
      }
      console.log(this.props)
      this.setState({ notes });
    })
  }
  renderNewNotes(){
    let notes = this.state.notes;
    let count = 10;
  }
  render(){
    return (
      <div className="center">
        <Menu />
        <h1>New Notes</h1>
        <p>not yet available...</p>
        {this.renderNewNotes()}
      </div>
    )
  }
}

export default createContainer(({props}) =>{
  Meteor.subscribe("notes-newest", props);
  return {
    list: Notes.find().fetch()
  }
}, Home);
