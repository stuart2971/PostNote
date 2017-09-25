import { Meteor } from "meteor/meteor"
import { Tracker } from "meteor/tracker"
import React from "react";
import { withRouter, Link } from "react-router-dom";

import { Notes } from "../../methods/methods";
import RenderNotesByUnit from "./renderNotesByUnit";
import RenderNotesBySubject from "./renderNotesBySubject";
import RenderNotesByEmail from "./renderNotesByEmail";
import RenderNotesByLike from "./renderNotesByLike";
import RenderNotesByTime from "./renderNotesByTime"

class FilterNotesMenu extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
      notes: <RenderNotesBySubject filter={this.props.subject} />
    };
  }
  removeInputs(){
    let email = this.refs.email;
    let unit = this.refs.unit;
    email.classList.remove("visible");
    unit.classList.remove("visible");
    email.classList.add("invisible");
    unit.classList.add("invisible");
    email.value = "";
    unit.value = "";
  }
  toggleInputs(toggle1, toggle2){
    toggle1.classList.add("visible")
    toggle1.classList.remove("invisible");
    toggle2.classList.add("invisible")
    toggle2.classList.remove("visible");
    toggle1.value = "";
    toggle2.value = "";
  }
  toggleEmail(){this.toggleInputs(this.refs.email, this.refs.unit);}
  toggleUnit(){this.toggleInputs(this.refs.unit, this.refs.email);}
  filterByUnit(){
    let unit = this.refs.unit.value;
    if(unit){
      this.setState({ notes: <RenderNotesByUnit unit={unit} subject={this.props.subject} /> });
      console.log(this.state.notes)
    }else{
      this.setState({ notes: <RenderNotesBySubject filter={this.props.subject} /> })
    }
  }
  filterByEmail(){
    let email = this.refs.email.value;
    if(email){
      this.setState({ notes: <RenderNotesByEmail email={email} subject={this.props.subject} /> });
      console.log(this.state.notes)
    }else{
      this.setState({ notes: <RenderNotesBySubject filter={this.props.subject} /> })
    }
  }
  toggleLikes(){
    this.removeInputs();
    this.setState({ notes: <RenderNotesByLike subject={this.props.subject} />})
  }
  toggleRecent(){
    this.removeInputs();
    this.setState({ notes: <RenderNotesByTime subject={this.props.subject} />})
  }
  render(){
    return (
      <div className="filterMenu">
        <span>Filter by: </span>
        <input type="radio" id="email" name="filterOptions" />
        <label htmlFor="email" className="filterOption" onClick={this.toggleEmail.bind(this)}>@</label>
        <input type="radio" id="heart" name="filterOptions" />
        <label htmlFor="heart" className="filterOption" onClick={this.toggleLikes.bind(this)}>heart</label>
        <input type="radio" id="time" name="filterOptions" />
        <label htmlFor="time" className="filterOption" onClick={this.toggleRecent.bind(this)}>time</label>
        <input type="radio" id="unit" name="filterOptions" />
        <label htmlFor="unit" className="filterOption" onClick={this.toggleUnit.bind(this)}>unit</label>

        <br />
        <input ref="email" className="invisible" placeholder="Search Email" type="text" onChange={this.filterByEmail.bind(this)} />
        <input ref="unit" className="" placeholder="Search Unit" type="text" onChange={this.filterByUnit.bind(this)} />

        {this.state.notes}
      </div>
    )
  }
}
export default withRouter(FilterNotesMenu)
