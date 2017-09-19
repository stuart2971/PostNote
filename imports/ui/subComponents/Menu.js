import { Meteor } from "meteor/meteor"
import React from "react";
import { withRouter, Link } from "react-router-dom";

import { SubjectRoutes } from "../subjectRoutes/subjectRoutes";
import "../../../client/stylesheets/authentication.css"

class Menu extends React.Component{
  render(){
    return(
      <div className="center">
        <div className="menu" ref="menu">
          <h1 className="menu-header"><Link to="/">PostNote</Link></h1>
          <p className="menu-item"><Link to="/">Home</Link></p>
          <p className="menu-item"><Link to="/searchNotes">Notes</Link></p>
          <p className="menu-item"><Link to="/addNote">Add a Note</Link></p>
          <p className="menu-item noStyle"><Link to={`/users/${Meteor.userId()}`} >My Profile</Link></p>
        </div>
      </div>
    );
  }
}
export default withRouter(Menu)
