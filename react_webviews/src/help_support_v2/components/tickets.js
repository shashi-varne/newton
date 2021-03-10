import React, { Component } from "react";
import { initialize } from "../common/functions";

class OpenTickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  render() {
      return (
        <div className="help-tickets">
          <div className="tickets">
            
          </div>
        </div>
      )
  }
}

export default OpenTickets;