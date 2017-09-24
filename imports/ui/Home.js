import { Meteor } from "meteor/meteor";
import React from "react";
import { withRouter, Link } from "react-router-dom";
import { Tracker } from "meteor/tracker";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data";

import { Notes } from "../methods/methods";
import SubjectRoutes from "./subjectRoutes/subjectRoutes";
import Menu from "./subComponents/Menu.js";

export default class Home extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
      notes: []
    };
  }
  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('notes-newest')
      const notes = Notes.find({},{sort: {createdAt: -1}, limit: 10}).fetch();
      console.log(notes)
      this.setState({ notes });
    })
  }
  renderNewNotes(notes){
    if(notes == null || notes == undefined){
      return;
    }
    return notes.map((note) => {
      return(
        <div key={note._id} className="note-list" onClick={() => {this.props.history.push(`/fullSize/${note._id}`)}}>
          <div className="left inline">
            <p><strong>{note.title}</strong></p>
            <span className="removeOnSmallDevice">{note.userEmail}</span>
          </div>
          <div className="right inline">
            <span>Subject: <strong>{note.subject}, {note.unit}</strong></span>
            <br />
            <span className="removeOnSmallDevice">⬆ {note.likes.length} ⬇ {note.dislikes.length}</span>
          </div>
        </div>
      )
    })
  }
  render(){
    return (
      <div className="center">
        <Menu />
        <h1>★ Newest Notes ★</h1>
        {this.renderNewNotes(this.state.notes)}
        <br />
        <Link to="/searchNotes">Find more Notes ➜ </Link>
      </div>
    )
  }
}
