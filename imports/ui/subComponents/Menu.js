import { Meteor } from "meteor/meteor"
import React from "react";
import { withRouter, Link } from "react-router-dom";

import { SubjectRoutes } from "../subjectRoutes/subjectRoutes";
import "../../../client/stylesheets/authentication.css"

class Menu extends React.Component{
  extendMenu(){
    let menuItems = document.querySelectorAll(".menu-item");
    for(let i = 0; i <= menuItems.length; i++ ){
      menuItems[i].classList.toggle("menu-item-extend") 
    }
    console.log(menuItems)
  }
  render(){
    return(
      <div className="center center-v-outer">
        <div className="menu center-v-inner" ref="menu" onClick={this.extendMenu.bind(this)}>
          <h1 className="menu-header">PostNote</h1>
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
