import { Meteor } from "meteor/meteor"
import React from "react";
import { withRouter, Link } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";
import SimpleSchema from "simpl-schema";

import "../../../client/stylesheets/authentication.css"

class Signup extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
      message: ""
    };
  }
  componentWillMount() {
    if(Meteor.userId()){
      this.props.history.replace("/")
    }
  }
  signupUser(e){
    e.preventDefault();
    let email = this.refs.email.value;
    let password = this.refs.password.value;

    let accountValidation = new SimpleSchema({
      password: {
        type: String,
        label: "Password",
        max: 50,
      },
      email: {
        type: SimpleSchema.RegEx.Email
      }
    }).validate({ password, email });
    
    Accounts.createUser({ email, password }, (err) => {
      if(err){
        this.setState({ message: err.reason })
      }else{
        console.log("Success");
        this.props.history.push("/");
      }
    });
  }
  render(){
    return (
      <div className="center center-v-outer login-container">
        <form className="center-v-inner" onSubmit={this.signupUser.bind(this)}>
          <h1>Signup</h1>
          {this.state.message}
          <br />
          <input className="login-userData" type="email" ref="email" placeholder="Email"/>
          <br />
          <input className="login-userData" type="password" ref="password" placeholder="Password"/>
          <br />
          <button className="login-button signup-button">Signup</button>
          <br />
          <Link to="/login">I already have an account</Link>
          <br />
        </form>
      </div>
    )
  }
}

export default withRouter(Signup);
