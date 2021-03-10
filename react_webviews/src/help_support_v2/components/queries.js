import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
import Tab from "./tab";

class Queries extends Component {
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
      <Container
        // skelton={this.state.skelton}
        title="My Queries"
        noFooter
      >
        <div className="help-queries">
          <div className="nav-bar">
            <Tab />
          </div>
        </div>
      </Container>
    );
  }
}

export default Queries;
