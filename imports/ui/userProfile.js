import { Meteor } from "meteor/meteor";
import React from "react";
import { withRouter } from "react-router-dom";
import { Tracker } from "meteor/tracker";

import Menu from "./subComponents/Menu";
import RenderNotesByUserId from "./subComponents/renderNotesByUserId"

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
  componentDidMount() {
    Tracker.autorun(() => {
      Meteor.subscribe('user');
      Meteor.subscribe('users');
      const user = Meteor.users.findOne(this.props.match.params.userId);
      if(user == null || user == undefined){
        return;
      }
      console.log(user)
      this.setState({email: user.emails[0].address})
    });
  }
  componentWillReceiveProps(nextProps) {
    Tracker.autorun(() => {
      const user = Meteor.users.findOne(nextProps.match.params.userId);
      if(user == null || user == undefined){
        return;
      }
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
