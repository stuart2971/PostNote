import { Meteor } from "meteor/meteor"
import React from "react";
import { withRouter, Link } from "react-router-dom";
import { Accounts } from "meteor/accounts-base"

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

    Accounts.createUser({ email, password }, (err) => {
      if(err){
        console.log(err)
      }else{
        console.log("Success");
        this.props.history.push("/");
      }
    });
  }
  render(){
    return (
      <div className="center center-v-outer">
        <form className="center-v-inner" onSubmit={this.signupUser.bind(this)}>
          <h1>Signup</h1>
          {this.state.message}
          <br />
          <input type="email" ref="email" placeholder="Email"/>
          <br />
          <input type="password" ref="password" placeholder="Password"/>
          <br />
          <button>Signup</button>
          <br />
          <Link to="/login">I already have an account</Link>
        </form>
      </div>
    )
  }
}

export default withRouter(Signup);
