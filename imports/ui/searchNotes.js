import React from "react";
import { withRouter, Switch, BrowserRouter, Route, Redirect, Link } from "react-router-dom";

import { SubjectRoutes } from "./subjectRoutes/subjectRoutes";
import Note from "./Note"

class searchNotes extends React.Component{
  renderSubjects(){
    return SubjectRoutes.map((subject) => {
      return <option key={subject}>{subject}</option>
    });
  }
  filterNotes(e){
    e.preventDefault();
    let subject = this.refs.subjects.value;
    this.props.history.push(`/searchNotes/${subject}`);
  }
  render(){
    return (
      <div className="center center-v-outer">
        <form className="center-v-inner" onSubmit={this.filterNotes.bind(this)}>
          <h1>What kind of Notes are you looking for?</h1>
          <select ref="subjects">
            <option selected disabled value="">Choose a subject</option>
            {this.renderSubjects()}
          </select>
          <button>Find Notes!</button>
          <br />
          <Link to="/">← Go Back</Link>
        </form>
      </div>
    )
  }
}

export default withRouter(searchNotes)
