import { Meteor } from "meteor/meteor"
import React from "react";
import { Tracker } from "meteor/tracker";
import { Link, Redirect } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";'meteor/accounts-base';
import cloudinary from "cloudinary"

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
      document.getElementById("delete_button").className = "visible"
    }else{
      document.getElementById("delete_button").className = "invisible"
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
  renderImages(doc){
    let images = this.state.doc.imageURL;
    if(images == null || images == undefined){
      return;
    }
    return images.map((image) => {
      // cloudinary.image(this.state.doc.cloudinaryData.data.public_id, {quality: 80})
      return <img className="fullSize-image " src={image} onClick={() => {
        window.location.href = image || doc.cloudinaryData.data.secure_url
      }}/>
    })
  }
  renderNote(doc){
    if(!Meteor.userId()){
      return <Redirect to="/login" />
    }
    return (
      <div>
        <div className="titleBar">
          <div className="left">
            <Link to={`/users/${doc.userId}`} className="inline title">{doc.userEmail}</Link>
          </div>
          <div className="right">
          <button id="delete_button" onClick={(e) => {
                e.preventDefault();
                if(doc.cloudinaryData != null){
                  Meteor.call("cloudinary.remove", doc.cloudinaryData.data.public_id)
                }
                Meteor.call("notes.remove", doc._id, (err, res) => {
                  if(!err){this.props.history.push("/");}
                });
              }}>Delete</button>
          </div>
          </div>
          <p>*You can click on an image to make it bigger*</p>
          <div className="imageContainer">
            {this.renderImages(doc)}
          </div>
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
