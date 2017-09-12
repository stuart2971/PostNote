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
      urls: [],
      cloudinaryUrls: []
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
    console.log(unit)
    if(!Meteor.userId()){
      this.setState({
        message: "You need to login before you can add a note",
        loginMessage: <Link to="/login">Login</Link>
      })
      throw new Meteor.Error(400, "User is not signed in.")
    }
    if(title && subject && description && imageURL && unit){
      let noteInfo = { title, subject, description, imageURL, userId, userEmail, createdAt, unit }
      Meteor.call("notes.insert", noteInfo, (err, res) => {
        if(err){
          this.setState({message: err.reason});
          console.log(err)
        }else{
          this.props.history.push("/")
        }
      })
    }else {
      this.setState({message: "You must fill in all the blanks.  "})
    }
  }
  addLink(){
    if(this.refs.imageURL.value){
      if(this.state.urls.length < 10){
        const URLSchema = new SimpleSchema({
          imageURL:{
              type:String,
              label:"Your image URL",
              regEx: SimpleSchema.RegEx.Url
          }
        }).validate({ imageURL:this.refs.imageURL.value })

        var urls = this.state.urls.concat([this.refs.imageURL.value]);
        this.setState({ urls });
      }else{
        this.setState({ message: "Only allowed 10 notes per upload.  "})
      }
    }
  }
  readImage(e){
    let file = e.target.files[0];
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/djomgi4gv/upload";
    const CLOUDIARY_UPLOAD_PRESET = "dkw66w2k"
    let formData = new FormData();
    let cloudinaryURLS = [];

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
      console.log(res)
      cloudinaryURLS.push(res.data.secure_url);
      console.log(cloudinaryURLS);
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
          <label htmlFor="title">Note Title</label>
          <br />
          <input className="addNote-input" id="title" ref="title" type="text" placeholder="Title" />
          <br />
          <span>What subject is your note?</span>
          <br />
          <select ref="subject">
            <option selected disabled value="">Choose a subject</option>
            {this.renderSubjects(SubjectRoutes)}
          </select>
          <br />
          <label htmlFor="description">Add a description: </label>
          <br />
          <input className="addNote-input" id="description" ref="description" placeholder="Description Here..."/>
          <br />
          <label htmlFor="imageURl">Image Url: </label>
          <br />
          <p className="inline">
            <input id="imageUrl" ref="imageURL" placeholder="Enter image URL here"/>
            <span onClick={this.addLink.bind(this)} id="addLink">+</span>
            <span>({this.state.urls.length})</span>
          </p>

          <input className="addNote-input" type="file" onChange={this.readImage} id="fileInput" /><br />
          <img src="https://res.cloudinary.com/djomgi4gv/image/upload/v1505257026/gpxr86jdkv2f6yzewpzi.jpg"/>
          <br />
          <Link to="/questions">What is this?</Link>
          <br />
          <input className="addNote-input" placeholder="Subject Unit" type="text" ref="unit"/>
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
