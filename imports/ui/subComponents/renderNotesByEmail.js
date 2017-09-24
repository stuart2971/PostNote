import React from "react";
import { Tracker } from "meteor/tracker";
import { Link, withRouter } from "react-router-dom"

import { Notes } from "./../../methods/methods";

 class RenderNotesByEmail extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
      notes: []
    };
  }
  renderNotes(notes){
    console.log(this.props.unit)
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
  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('notes');
      //regex: contains the string, doesn't have to be exact.  options: i is for incase-sensitive
      const notes = Notes.find({ userEmail : {$regex: this.props.email, $options: 'i'}, subject: this.props.subject }, {sort: {createdAt: -1}}).fetch();
      this.setState({ notes })
    });
  }
  componentWillReceiveProps(nextProps) {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('notes');
      const notes = Notes.find({ userEmail : {$regex: nextProps.email, $options: 'i'}, subject: nextProps.subject }, {sort: {createdAt: -1}}).fetch();
      this.setState({ notes })
    });
  }
  componentWillUnmount() {
    this.tracker.stop()
  }
  render(){
    return(
      <div className="center">
        {this.renderNotes(this.state.notes)}
      </div>
    )
  }
}
export default withRouter(RenderNotesByEmail);
