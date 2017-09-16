import { Meteor } from "meteor/meteor"
import React from "react";
import { withRouter, Link } from "react-router-dom";
import SimpleSchema from "simpl-schema";
import axios from "axios"

import { SubjectRoutes } from "./subjectRoutes/subjectRoutes";
import "../methods/methods";
import Menu from "./subComponents/Menu";

class AddNote extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
      message: "",
      loginMessage: (<div></div>),
      urls: []
    };
  }
  renderSubjects(subjects){
    return subjects.map((item) => {
      return <option key={item}>{item}</option>
    })
  }
  componentWillMount() {
    Meteor.subscribe('user');
  }
  addNote(e){
    e.preventDefault();
    let title = this.refs.title.value;
    let subject = this.refs.subject.value;
    let description = this.refs.description.value;
    let allUrls = [this.refs.imageURL.value].concat(this.state.urls);
    let imageURL = allUrls.filter(function(entry) { return entry.trim() != ''; });
    let userId = Meteor.userId();
    let userEmail = Meteor.user().emails[0].address;
    let createdAt = Date.parse(new Date());
    let unit = this.refs.unit.value;
    let file = this.refs.fileInput.files[0];

    if(!Meteor.userId()){
      this.setState({
        message: "You need to login before you can add a note",
        loginMessage: <Link to="/login">Login</Link>
      })
      throw new Meteor.Error(400, "User is not signed in.")
    }

    if(title && subject && description && unit){
      if(imageURL.length == 0 && file == undefined){
        this.setState({ message: "You need to enter an image." })
        return;
      }
      console.log(imageURL.length, file)
      if(imageURL){
        let noteInfo = { title, subject, description, imageURL, userId, userEmail, createdAt, unit };

        Meteor.call("notes.insert", noteInfo, (err, res) => {
          if(err){
            this.setState({ message: "Please enter a valid image URL." });
          }else{
            this.props.history.push("/")
          }
        })
      }
      if(file){
        let noteInfo = { title, subject, description, imageURL, userId, userEmail, createdAt, unit };

        this.uploadToCloudinary(file, (err, res) => {
          imageURL.push(res.data.secure_url);
          console.log("Outside")
          Meteor.call("notes.insert", noteInfo, (err, res) => {
            //problem .......inserting 2 docs, one empty and one with proper data
            console.log("Inside");
            if(err){
              this.setState({message: err.reason});
              console.log(err);
            }else{
              this.props.history.push("/")
            }
          })
        });
      }
    }
  }
  addLink(){
    let file = this.refs.fileInput.files[0];
    if(this.refs.imageURL.value || file != undefined){
      if(this.state.urls.length < 10){
        if(!this.state.urls.includes(this.refs.imageURL.value)){
          const URLSchema = new SimpleSchema({
            imageURL:{
                type:String,
                label:"Your image URL",
                regEx: SimpleSchema.RegEx.Url
            }
          }).validate({ imageURL:this.refs.imageURL.value })

          let urls = this.state.urls.concat([this.refs.imageURL.value]);
          this.setState({ urls });
          this.refs.imageURL.value == "";
        }else{
          this.setState({ message: "You already inserted this note." })
        }
      }else{
        this.setState({ message: "Only allowed 10 notes per upload.  "})
      }
    }else{
      this.setState({ message: "Please enter a note." })
    }
  }
  uploadToCloudinary(file, callback){
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/djomgi4gv/upload";
    const CLOUDIARY_UPLOAD_PRESET = "dkw66w2k"
    let formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", CLOUDIARY_UPLOAD_PRESET)

    axios({
      url: CLOUDINARY_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: formData
    }).then(function(res){
      callback(new Meteor.Error(400, "Error, cannot connect to cloudinary."), res);
    }).catch(function(err){
      console.log(err);
    })
    console.log(file);
  }
  render(){
    return(
      <div>
        <form onSubmit={this.addNote.bind(this)}>
          <Menu />
          <p>*Just a friendly reminder: If you cannot read the note yourself,
          others cannot as well.  Please make sure your notes are clear and
          easy to read.*</p>
          <h1>Add a note</h1>
          <br />
          <input className="addNote-input" id="title" ref="title" type="text" placeholder="Title" autoComplete="off" />
          <br />
          <select ref="subject">
            <option selected disabled value="">Choose a subject</option>
            {this.renderSubjects(SubjectRoutes)}
          </select>
          <br />
          <input className="addNote-input" id="description" ref="description" placeholder="Description Here..." autoComplete="off" />
          <br />
          <Link to="/questions">What is this?</Link><br />
          <div className="inline full">
            <div className="left">
              <input id="imageUrl" className="addNote-input insert-link" ref="imageURL" placeholder="Enter image URL here" autoComplete="off" />
            </div>
            or
            <div className="right">
              <input className="addNote-input inline" type="file" ref="fileInput" onChange={this.readImage} id="fileInput" autoComplete="off"/>
            </div>
            <div className="full inline-block">
              <span onClick={this.addLink.bind(this)} id="addLink">+</span>
              <span>({this.state.urls.length})</span>
            </div>
          </div>

          <input className="addNote-input" placeholder="Subject Unit" type="text" ref="unit" autocomplete="off" />
          <br />
          <button>Add Note</button>
          <br />
          <div className="alert alert-danger">Error: {this.state.message}</div>
          <br />
          {this.state.loginMessage}
        </form>
      </div>
    )
  }
}

export default withRouter(AddNote);
