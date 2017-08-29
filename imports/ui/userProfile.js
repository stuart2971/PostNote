import { Meteor } from "meteor/meteor";
import React from "react";
import { withRouter } from "react-router-dom";
import { Tracker } from "meteor/tracker";

import Menu from "./Menu";
import RenderNotesByUserId from "./renderNotesByUserId"

class userProfile extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
      email: ""
    };
  }
  logoutUser(e){
    e.preventDefault()
    Accounts.logout(() => {
      this.props.history.push("/login");
    });
  }
  componentWillMount() {
    Meteor.subscribe('user');
    Meteor.subscribe('users');
  }
  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      const user = Meteor.users.findOne(this.props.match.params.userId)
      this.setState({email: user.emails[0].address})
    });
  }
  componentWillReceiveProps(nextProps) {
    this.tracker = Tracker.autorun(() => {
      const user = Meteor.users.findOne(nextProps.match.params.userId)
      this.setState({email: user.emails[0].address})
    });
  }
  render(){
    return(
      <div className="center">
        <Menu />
        <button onClick={this.logoutUser.bind(this)}>Logout</button>
        <h1>{this.state.email}</h1>
        <RenderNotesByUserId filter={this.props.match.params.userId}/>
      </div>
    )
  }
}
export default withRouter(userProfile);
