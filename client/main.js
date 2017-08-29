import React from "react";
import ReactDOM from "react-dom";
import { Tracker } from "meteor/tracker";

import Routes from "../imports/routes/routes";

Meteor.startup(() => {
  Tracker.autorun(function () {
    const signedIn = !!Meteor.userId();
    if(signedIn){
      console.log("Signed In -- from client")
      console.log(Meteor.userId())
    }else{
      console.log("Signed Out -- from client")
    }
  });
  ReactDOM.render(<Routes />, document.getElementById("app"));
});
