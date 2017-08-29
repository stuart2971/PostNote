import { Meteor } from "meteor/meteor";
import React from "react";
import { withRouter } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";

import SubjectRoutes from "./subjectRoutes/subjectRoutes";
import RenderNotesBySubject from "./renderNotesBySubject"
import Menu from "./Menu.js";

class Home extends React.Component{
  render(){
    return (
      <div>
        <Menu />
        <RenderNotesBySubject filter="Science"/>
      </div>
    )
  }
}

export default withRouter(Home);
