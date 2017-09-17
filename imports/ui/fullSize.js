import { Meteor } from "meteor/meteor"
import React from "react";
import { Tracker } from "meteor/tracker";
import { Link } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";'meteor/accounts-base';

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
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe("notes");
      Meteor.subscribe("user");
      let doc = Notes.findOne(this.props.match.params.noteId);
      if(doc == null || doc == undefined){
        return;
      };
      this.checkIfReacted(doc)
      this.setState({ doc, likes: doc.likes.length, dislikes: doc.dislikes.length });
      this.checkIfUserCreated(doc);
    })

  }
  checkIfUserCreated(doc){
    if(Meteor.userId() == doc.userId){
      document.getElementById("delete_button").className = "delete"
    }else{
      document.getElementById("delete_button").className = "not-profile"
    }
  }
  checkIfReacted(doc){
    if(doc == null || doc == undefined){
      return;
    }
    console.log(doc)
    const user = Meteor.user().emails[0].address;
    let reactButtons = document.getElementsByClassName("react");
    const changeAllButtons = () => {
      for(let i = 0; i<reactButtons.length; i++){
        reactButtons[i].disabled = true;
      }
    }
    if(user == null || user == undefined){
      return;
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
        if(doc == null || doc == undefined){
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
  deleteImage(publicId){
    Meteor.call("cloudinary.remove", publicId)
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
              this.deleteImage(doc.cloudinaryData.data.public_id, doc.cloudinaryData.data.resource_type)
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
