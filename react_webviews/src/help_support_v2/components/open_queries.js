import React, { Component } from "react";
import { initialize } from "../common/functions";

class OpenQueries extends Component {
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
          <div>ghghgjgv</div>
      )
  }
}

export default OpenQueries;