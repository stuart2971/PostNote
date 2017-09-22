import { Meteor } from "meteor/meteor";
import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import { Tracker } from "meteor/tracker";

import Menu from "./subComponents/Menu";
import RenderNotesByUserId from "./subComponents/renderNotesByUserId"
import "../../client/stylesheets/userProfile.css"

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
      console.log(user)
      if(user == null || user == undefined){
        return;
      }
      if(Meteor.userId() == this.props.match.params.userId){
        this.setState({ email: "My Profile"})
      }else{
        this.setState({email: user.emails[0].address})
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    Tracker.autorun(() => {
      const user = Meteor.users.findOne(nextProps.match.params.userId);
      if(user == null || user == undefined){
        return;
      }
      if(Meteor.userId() == this.props.match.params.userId){
        this.setState({ email: "My Profile"})
      }else{
        this.setState({email: user.emails[0].address})
      }
    });
  }
  render(){
    if(!Meteor.userId()){
      return <Redirect to="/login" />
    }
    return(
      <div className="container-profile">
        <div className="center">
          <Menu />
        </div>
        <h1 className="header-profile">{this.state.email}</h1>
        <button className="logout-button" onClick={this.logoutUser.bind(this)}>Logout</button>
        <RenderNotesByUserId filter={this.props.match.params.userId}/>
      </div>
    )
  }
}
export default withRouter(userProfile);
