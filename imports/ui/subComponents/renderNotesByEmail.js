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
    return notes.map((note) => {
      return(
        <div key={note._id} className="note-list" onClick={() => {this.props.history.push(`/fullSize/${note._id}`)}}>
          <div className="overlay center-v-outer">
            <div className="transparent center-v-inner">
              <p>⬆ {note.likes.length} ⬇ {note.dislikes.length}</p>
              <p>{note.unit}</p>
            </div>
          </div>
          <img src={note.imageURL[0]} className="note_display" />
          <p>{note.title}</p>
          <p>{note.userEmail}</p>
        </div>
      );
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
