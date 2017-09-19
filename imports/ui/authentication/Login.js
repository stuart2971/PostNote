import { Meteor } from "meteor/meteor";
import React from "react";
import { withRouter, Link } from "react-router-dom";

import "../../../client/stylesheets/authentication.css"

class Login extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
      message: ""
    };
  }
  componentWillMount() {
    if(Meteor.userId()){
      this.props.history.replace("/");
    }
  }
  loginUser(e){
    e.preventDefault();
    let email = this.refs.email.value;
    let password = this.refs.password.value;

    Meteor.loginWithPassword(email, password, (err) => {
      if(err){
        this.setState({ message: err.reason })
      }else{
        this.props.history.replace("/")
      }
    });
  }
  render(){
    return (
      <div className="center-v-outer center login-container">
        <form className="center-v-inner" onSubmit={this.loginUser.bind(this)}>
          <h1>Login</h1>
          {this.state.message}
          <br />
          <input className="login-userData" type="email" ref="email" placeholder="Email"/>
          <br />
          <input className="login-userData" type="password" ref="password" placeholder="Password"/>
          <br />
          <button className="login-button">Login</button>
          <br />
          <Link to="/signup" className="authentication-link">I need an account</Link>
          <br />
        </form>
      </div>
    )
  }
}

export default withRouter(Login);
