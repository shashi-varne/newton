import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import HowToSteps from "../../../common/ui/HowToSteps";

class BtInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "bt_info_screen",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  handleClick = () => {};

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "income_details",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        hidePageTitle={true}
        buttonTitle="OPTING FOR BT"
      >
        <div className="bt-info">
          <div className="head">How does BT work?</div>
          <div className="sub-head">
            A 'balance transfer' is a unique feature that allows you to transfer
            the outstanding principal amount of your existing personal loans or
            credit cards (taken from other lenders) to IDFC FIRST Bank (if any).
          </div>

          <HowToSteps
            style={{ marginTop: '10px', marginBottom: 0 }}
            baseData={this.state.screenData.benefits}
          />

          <HowToSteps
            style={{ marginTop: '-20px', marginBottom: '30px' }}
            baseData={this.state.screenData.required_info}
          />
        </div>
      </Container>
    );
  }
}

export default BtInformation;
