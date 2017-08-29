import { Meteor } from "meteor/meteor"
import React from "react";
import { Tracker } from "meteor/tracker";
import { Link } from "react-router-dom";
import { Accounts } from "meteor/accounts-base"

import Menu from "./Menu"
import { Notes } from "../methods/methods";
import "../methods/methods"

export default class fullSize extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      doc: {},
      likes: 0,
      dislikes: 0
    };
  }
  componentDidMount() {
    Meteor.subscribe("notes");
    Meteor.subscribe("user");
    this.tracker = Tracker.autorun(() => {
      let doc = Notes.findOne(this.props.match.params.noteId);
      if(doc == null ){
        return;
      };
      const user = Meteor.user().emails[0].address;
      if(doc.likes.includes(user)){
        document.getElementById("like").style.color = "#379956"
      }
      if(doc.dislikes.includes(user)){
        document.getElementById("dislike").style.color = "#E20049"
      }
      this.setState({ doc, likes: doc.likes.length, dislikes: doc.dislikes.length })
    })
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.noteId != nextProps.match.params.noteId)
      this.tracker = Tracker.autorun(() => {
        const doc = Notes.findOne(nextProps.match.params.noteId);
        if(doc == null ){
          return;
        }
        this.setState({ doc, likes: doc.likes.length, dislikes: doc.dislikes.length });
      })
  }
  renderNote(doc){
    return(
      <div className="fullSize-container">
        <div className="left">
          <img className="fullSize-image" src={doc.imageURL} />
          <p className="center react-data">
            <span id="like" className="react" onClick={() => {
              Meteor.call("like", doc._id, Meteor.user().emails[0].address);
            }}>⬆</span>
            {this.state.likes}
            <span id="dislike" className="react" onClick={() => {
              Meteor.call("dislike", doc._id, Meteor.user().emails[0].address);
            }}>⬇</span>
            {this.state.dislikes}
          </p>
        </div>
        <div className="right">
          <h2>{doc.title}</h2>
          <Link to={`/users/${doc.userId}`}>{doc.userEmail}</Link>
          <br />
          <span className="description">{doc.description}</span>
        </div>
      </div>
    )
  }

  render(){
    return (
      <div className="center">
        <Menu />
        {this.renderNote(this.state.doc)}
      </div>
    )
  }
}
