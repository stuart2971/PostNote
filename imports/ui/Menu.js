import { Meteor } from "meteor/meteor"
import React from "react";
import { withRouter, Link } from "react-router-dom";

import { SubjectRoutes } from "./subjectRoutes/subjectRoutes";
import AddNote from "./AddNote";

class Menu extends React.Component{
  render(){
    return(
      <div>
        <div className="menu">
          <div className="left collapse">
            <h1><Link to="/">PostNote</Link></h1>
          </div>
          <div className="right collapse item-container">
            <span className="menu-item"><Link to="/">Home</Link></span>
            <span className="menu-item"><Link to="/searchNotes">Notes</Link></span>
            <span className="menu-item"><Link to="/addNote">Add a Note</Link></span>
            <span className="menu-item"><Link to={`/users/${Meteor.userId()}`} >My Profile</Link></span>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Menu)
