import { Meteor } from "meteor/meteor"
import React from "react";
import { Tracker } from "meteor/tracker";
import { Link } from "react-router-dom";
import { Accounts } from "meteor/accounts-base"

import Menu from "./subComponents/Menu"
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
      this.checkIfReacted(doc)
      this.setState({ doc, likes: doc.likes.length, dislikes: doc.dislikes.length });
      this.checkIfUserCreated(doc);
    })

  }
  checkIfUserCreated(doc){
    console.log(doc);
    if(Meteor.userId() == doc.userId){
      document.getElementById("delete_button").className = "delete"
    }else{
      document.getElementById("delete_button").className = "not-profile"
    }
  }
  checkIfReacted(doc){
    const user = Meteor.user().emails[0].address;
    let reactButtons = document.getElementsByClassName("react");
    const changeAllButtons = () => {
      for(let i = 0; i<reactButtons.length; i++){
        reactButtons[i].disabled = true;
      }
    }
    if(doc.likes.includes(user)){
      document.getElementById("like").style.color = "#379956";
      changeAllButtons();
    }
    if(doc.dislikes.includes(user)){
      document.getElementById("dislike").style.color = "#E20049";
      changeAllButtons()
    }
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
  renderImages(){
    let images = this.state.doc.imageURL;
    if(images == null || images == undefined){
      return;
    }
    return images.map((image) => {
      return <img src={image} />
    })
  }
  renderNote(doc){
    return(
      <div className="fullSize-container">
        <div className="left">
          {this.renderImages()}
          <p className="center react-data">
            <button id="like" className="react" onClick={() => {
              Meteor.call("like", doc._id, Meteor.user().emails[0].address);
            }}>⬆</button>
            {this.state.likes}
            <button id="dislike" className="react" onClick={() => {
              Meteor.call("dislike", doc._id, Meteor.user().emails[0].address);
            }}>⬇</button>
            {this.state.dislikes}
          </p>
        </div>
        <div className="right">
          <div className="hover-delete">
            <span className="slide-left">{doc.title}</span>
            <div id="delete_button" onClick={() => {
              Meteor.call("notes.remove", doc._id, (err, res) => {
                if(!err){this.props.history.push("/")}
              });
            }}>🗑️</div>
          </div>
          <br />
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
