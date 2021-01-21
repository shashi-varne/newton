import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";
import HowToSteps from "../../../common/ui/HowToSteps";
import PartnerCard from "./partner_card";
import { nativeCallback } from "utils/native_callback";
import Card from "../../../common/ui/Card";
import { getConfig } from "utils/functions";

class Home extends Component {
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
            System is under maintainence
            <div style={{fontSize:'15px', marginTop:'10px'}}>Please try again after some time ...</div>
        </div>
      </Container>
    );
  }
}

export default Home;
