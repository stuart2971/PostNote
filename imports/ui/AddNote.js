import { Meteor } from "meteor/meteor"
import React from "react";
import { withRouter, Link, Redirect } from "react-router-dom";
import SimpleSchema from "simpl-schema";
import axios from "axios";
import cloudinary from "cloudinary"

import { SubjectRoutes } from "./subjectRoutes/subjectRoutes";
import "../methods/methods";
import Menu from "./subComponents/Menu";

class AddNote extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
      message: "",
      loginMessage: (<div></div>),
      urls: [],
      cloudinaryFiles: []
    };
  }
  renderSubjects(subjects){
    return subjects.map((item) => {
      return <option key={item}>{item}</option>
    })
  }
  componentDidMount() {
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
    console.log(this.refs.fileInput.files[0])
    const inputFieldLimits = new SimpleSchema({
      title: {max: 20, type: String},
      description: {max: 400, type: String},
      unit: {max: 20, type: String}
    }).validate({ title, description, unit })

    if(title && subject && unit){
      if(imageURL.length == 0 && file == undefined){
        this.setState({ message: "You need to enter an image." });
        return;
      }

      if(imageURL.length > 0 && file){
        let noteInfo = { title, subject, description, imageURL, userId, userEmail, createdAt, unit };

        this.state.cloudinaryFiles.map((file) => {
          this.uploadToCloudinary(file, (err, res) => {
            let urls = imageURL.push( res.data.secure_url );
          })
        })

        this.uploadToCloudinary(file, (err, res) => {
          imageURL.push(res.data.secure_url);
          Meteor.call("notes.insert", noteInfo, (err, res) => {
            if(err){
              this.setState({message: err.reason});
              console.log(err);
            }else{
              this.props.history.push("/");
            }
          })
        });
      }else if(imageURL.length > 0){
        let noteInfo = { title, subject, description, imageURL, userId, userEmail, createdAt, unit };

        Meteor.call("notes.insert", noteInfo, (err, res) => {
          if(err){
            this.setState({ message: "Please enter a valid image URL." });
          }else{
            this.props.history.push("/")
          }
        })
      }else if(file){
        let noteInfo = { title, subject, description, imageURL, userId, userEmail, createdAt, unit };

        this.state.cloudinaryFiles.map((file) => {
          this.uploadToCloudinary(file, (err, res) => {
            let urls = imageURL.push( res.data.secure_url );
          })
        })

        this.uploadToCloudinary(file, (err, res) => {
          imageURL.push(res.data.secure_url);
          noteInfo.cloudinaryData = res;
          Meteor.call("notes.insert", noteInfo, (err, res) => {
            if(err){
              this.setState({message: err.reason});
              console.log(err);
            }else{
              this.props.history.push("/");
            }
          })
        });
      }
    }
  }
  addLink(){
    if(this.refs.imageURL.value){
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
        this.setState({ message: "Only allowed 10 notes per upload.  " })
      }
    }else{
      this.setState({ message: "Please enter a note." })
    }
  }
  addCloudinaryLink(){
    let file = this.refs.fileInput.files[0];
    console.log("cliked")
    if(file != undefined){
      if(this.state.cloudinaryFiles.length < 10){
        if(!this.state.cloudinaryFiles.includes(file)){
          let cloudinaryFiles = this.state.cloudinaryFiles.concat([ file ]);
          this.setState({ cloudinaryFiles });
          console.log(this.state.cloudinaryFiles);
        //can not filter duplicates with .includes since the file creates a lastModifiedDate element that changes.
        }
      }else{this.setState({message: "Too many notes.  "})}
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
  }
  checkIfError(){
    if(this.state.message){
      return <div id="errorMessage" className="alert alert-danger">Error: {this.state.message}</div>
    }else{
      return <div></div>
    }
  }
  render(){
    if(!Meteor.userId()){
      return <Redirect to="/login" />
    }
    return(
      <div>
        <form onSubmit={this.addNote.bind(this)}>
          <Menu />
          <p>*Just a friendly reminder: If you cannot read the note yourself,
          others cannot as well.  Please make sure your notes are clear and
          easy to read.*</p>
          <h1>Add a note</h1>
          <input className="addNote-input" id="title" ref="title" type="text" placeholder="Title" autoComplete="off" />
          <select ref="subject" className="selectSubject">
            <option selected disabled value="">Choose a subject</option>
            {this.renderSubjects(SubjectRoutes)}
          </select>
          <br />
          <textarea className="addNote-input" id="description" ref="description" placeholder="Description Here..." autoComplete="off" />
          <br />
          <Link to="/questions">What is this?</Link><br />
          <input id="imageUrl" className="addNote-input insert-link inline eightyPercent" ref="imageURL" placeholder="Enter image URL here" autoComplete="off" />
          <div className="inline">
            <span onClick={this.addLink.bind(this)} id="addLink">+</span>
            <span>({this.state.urls.length})</span>
          </div>
          <input className="addNote-input noBorder eightyPercent" type="file" ref="fileInput" onChange={this.readImage} id="fileInput" autoComplete="off"/>
          <div class="inline">
            <span onClick={this.addCloudinaryLink.bind(this)} id="addLink">+</span>
            <span>({this.state.cloudinaryFiles.length})</span>
          </div>
          <input className="addNote-input" placeholder="Subject Unit" type="text" ref="unit" autocomplete="off" />
          <br />
          <button ref="addNoteButton">Add Note</button>
          <br />
          {this.checkIfError()}

          <br />
          {this.state.loginMessage}
        </form>
      </div>
    )
  }
}

export default withRouter(AddNote)
