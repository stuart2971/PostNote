import { Meteor } from "meteor/meteor"
import React from "react";
import { withRouter, Switch, BrowserRouter, Route, Redirect, Link } from "react-router-dom";

import RenderNotesBySubject from "./subComponents/renderNotesBySubject";
import RenderNotesByUnit from "./subComponents/renderNotesByUnit"
import Menu from "./subComponents/Menu"
import { SubjectRoutes } from "./subjectRoutes/subjectRoutes"

class Notes extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
      notes: []
    };
  }
  checkIfSubject(){
    if(SubjectRoutes.includes(this.props.match.params.subject)){
      return <h1>Here are all the {this.props.match.params.subject} notes.</h1>
    }else{
      return <h2>Subject not found...:(</h2>
    }
  }
  componentDidMount() {
    if(!this.refs.unitSearch.value){
      this.setState({notes: <RenderNotesBySubject filter={this.props.match.params.subject}/>})
    }
  }
  searchByUnit(){
    let search = this.refs.unitSearch.value;
    if(search){
      this.setState({ notes: <RenderNotesByUnit subject={this.props.match.params.subject} unit={search} />})
    }else{
      this.setState({notes: <RenderNotesBySubject filter={this.props.match.params.subject} /> })
    }
  }

  render(){
    return (
      <div className="center">
        <Menu />
        {this.checkIfSubject()}
        <input type="text" placeholder="Search by unit" ref="unitSearch" onChange={this.searchByUnit.bind(this)}/>
        {this.state.notes}
      </div>
    )
  }
}

export default withRouter(Notes);
