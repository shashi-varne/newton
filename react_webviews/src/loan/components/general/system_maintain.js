import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";

class SystemMaintainence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "home_screen",
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
        showLoader={this.state.show_loader}
        hidePageTitle={true}
        noFooter={true}
      >
        <div className="system-maintainence">
          <img src={require("assets/Group 252.svg")} alt="" />
        </div>
      </Container>
    );
  }
}

export default SystemMaintainence;
