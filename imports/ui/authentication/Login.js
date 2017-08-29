import { Meteor } from "meteor/meteor";
import React from "react";
import { withRouter, Link } from "react-router-dom";


class Login extends React.Component{
  componentWillMount() {
    if(Meteor.userId()){
      this.props.history.replace("/")
    }
  }
  loginUser(e){
    e.preventDefault();
    let email = this.refs.email.value;
    let password = this.refs.password.value;

    Meteor.loginWithPassword(email, password, (err) => {
      if(err){
        console.log(err.reason)
      }else{
        this.props.history.replace("/")
      }
    })
  }
  render(){
    return (
      <div className="center-v-outer center">
        <form className="center-v-inner" onSubmit={this.loginUser.bind(this)}>
          <h1>Login</h1>
          <input type="email" ref="email" placeholder="Email"/>
          <br />
          <input type="password" ref="password" placeholder="Password"/>
          <br />
          <button>Login</button>
          <br />
          <Link to="/signup">I need an account</Link>
        </form>
      </div>
    )
  }
}

export default withRouter(Login);
