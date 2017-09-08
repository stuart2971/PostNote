import { Meteor } from "meteor/meteor"
import React from "react";
import { withRouter, Link } from "react-router-dom";
import SimpleSchema from "simpl-schema";

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

    if(!Meteor.userId()){
      this.setState({
        message: "You need to login before you can add a note",
        loginMessage: <Link to="/login">Login</Link>
      })
      throw new Meteor.Error(400, "User is not signed in.")
    }
    if(title && subject && description && imageURL){
      let noteInfo = { title, subject, description, imageURL, userId, userEmail, createdAt }
      Meteor.call("notes.insert", noteInfo, (err, res) => {
        if(err){
          this.setState({message: err.reason});
          console.log(err)
        }else{
          this.props.history.push("/")
        }
      })
    }
  }
  addLink(){
    if(this.refs.imageURL.value){
      const URLSchema = new SimpleSchema({
        imageURL:{
            type:String,
            label:"Your image URL",
            regEx: SimpleSchema.RegEx.Url
        }
      }).validate({ imageURL:this.refs.imageURL.value })

      var urls = this.state.urls.concat([this.refs.imageURL.value]);
      this.setState({ urls });
    }
  }
  readImage(){
    let preview = document.getElementById("preview");
    let file = document.getElementById("fileInput").files[0];
    let reader = new FileReader();

    console.log(`fileVar: ${file}, previewVar: ${preview}`);

    reader.addEventListener("load", function () {
      preview.src = reader.result;
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
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
          <input id="title" ref="title" type="text" placeholder="Title" />
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
          <input id="description" ref="description" placeholder="Description Here..."/>
          <br />
          <label htmlFor="imageURl">Image Url: </label>
          <br />
          <p className="inline">
            <input id="imageUrl" ref="imageURL" placeholder="Enter image URL here"/>
            <span onClick={this.addLink.bind(this)} id="addLink">+</span>
            <span>({this.state.urls.length})</span>
          </p>
          <input type="file" onChange={this.readImage} id="fileInput" /><br />
          <img id="preview" src="" height="200" alt="Image preview..." /><br />
          <br />
          <Link to="/questions">What is this?</Link>
          <br />
          <button>Add Note</button>
          <br />
          {this.state.message}
          <br />
          {this.state.loginMessage}
        </form>
      </div>
    )
  }
}

export default withRouter(AddNote);
