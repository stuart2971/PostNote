import { Meteor } from "meteor/meteor"
import React from "react";
import { withRouter, Switch, BrowserRouter, Route, Redirect, Link } from "react-router-dom";
import { Tracker } from "meteor/tracker";

import Login from "../ui/authentication/Login";
import Signup from "../ui/authentication/Signup";
import Home from "../ui/Home";
import searchNotes from "../ui/searchNotes"
import Note from "../ui/Note";
import fullSize from "../ui/fullSize"
import userProfile from "../ui/userProfile";
import AddNote from "../ui/AddNote";
import questions from "../ui/questions"
import NotFound from "../ui/NotFound";

export default class Routes extends React.Component{
  render(){
    return (
        <BrowserRouter>
          <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/signup"component={Signup} />
            <Route path="/" component={Home} exact/>
            <Route path={`/searchNotes/:subject`} component={Note} />
            <Route path={`/searchNotes`} component={searchNotes} />
            <Route path={`/fullSize/:noteId`} component={fullSize}/>
            <Route path="/addNote" component={AddNote}/>
            <Route path="/questions" component={questions} />
            <Route component={userProfile} path={`/users/:userId`} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
    )
  }
}
// export default withRouter(Routes)
