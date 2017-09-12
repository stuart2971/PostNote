import React from "react";
import { Tracker } from "meteor/tracker";
import { Link, withRouter } from "react-router-dom"

import { Notes } from "./../../methods/methods";

class RenderNotesByUserId extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
      notes: []
    };
  }
  renderNotes(notes){
    //return empty, then renders notes, then something empties it again...Not sure what is....
    if(notes == null || notes == undefined){
      return;
    }
    return notes.map((note) => {
      return(
        <div key={note._id} className="note-list" onClick={() => {this.props.history.push(`/fullSize/${note._id}`)}}>
          <div className="left inline">
            <p><strong>{note.userEmail}</strong></p>
            <span>{note.title}</span>
          </div>
          <div className="right inline">
            <span>Subject: <strong>{note.subject}, {note.unit}</strong></span>
            <br />
            <span>⬆ {note.likes.length} ⬇ {note.dislikes.length}</span>
          </div>
        </div>
      )
    })
  }
  componentDidMount() {
    Tracker.autorun(() => {
      Meteor.subscribe('notes');
      const notes = Notes.find({ userId : this.props.filter }, {sort: {createdAt: -1}}).fetch();
      this.setState({ notes })
    });
  }
  componentWillReceiveProps(nextProps) {
    Tracker.autorun(() => {
      Meteor.subscribe('notes');
      const notes = Notes.find({ userId : nextProps.filter }, {sort: {createdAt: -1}}).fetch()
      this.setState({ notes })
    });
  }
  render(){
    return(
      <div className="center">
        {this.renderNotes(this.state.notes)}
      </div>
    )
  }
}
export default withRouter(RenderNotesByUserId)
