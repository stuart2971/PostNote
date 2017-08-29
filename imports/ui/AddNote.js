import { Meteor } from "meteor/meteor"
import React from "react";
import { withRouter, Link } from "react-router-dom";

import { SubjectRoutes } from "./subjectRoutes/subjectRoutes";
import "../methods/methods";
import Menu from "./Menu"

class AddNote extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
      message: "",
      loginMessage: (<div></div>)
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
    let imageURL = this.refs.imageURL.value;
    let userId = Meteor.userId();
    let userEmail = Meteor.user().emails[0].address

    if(!Meteor.userId()){
      this.setState({
        message: "You need to login before you can add a note",
        loginMessage: <Link to="/login">Login</Link>
      })
      throw new Meteor.Error(400, "User is not signed in.")
    }

    if(title && subject && description && imageURL){
      let noteInfo = { title, subject, description, imageURL, userId, userEmail }
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
  render(){
    return(
      <div>
        <form onSubmit={this.addNote.bind(this)}>
          <Menu />
          <p>*Just a friendly reminder: If you cannot read the note yourself, others cannot as well.  Please make sure your notes are clear and easy to read.*</p>
          <h1>Add a note</h1>
          <label htmlFor="title">Note Title</label>
          <input id="title" ref="title" type="text" placeholder="Title" />
          <br />
          <span>What subject is your note?</span>
          <select ref="subject">
            <option selected disabled value="">Choose a subject</option>
            {this.renderSubjects(SubjectRoutes)}
          </select>
          <br />
          <label htmlFor="description">Add a description: </label>
          <input id="description" ref="description" placeholder="Description Here..."/>
          <br />
          <label htmlFor="imageURl">Image Url: </label>
          <input id="imageUrl" ref="imageURL" placeholder="Enter image URL here"/>
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
