import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";

class ApplicationStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
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
        screen_name: "know_more",
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
        title="Application rejected"
        buttonTitle="START NEW APPLICATION"
        handleClick={this.handleClick}
      >
        <div className="idfc-loan-status">
          <img
            src={require(`assets/${this.state.productName}/ils_loan_failed.svg`)}
            alt=""
          />
          <div className="subtitle">
            We’re unable to approve your loan request because as per IDFC’s loan
            policy your monthly salary does not qualify you for a personal loan
            at this point.
          </div>

          <div className="subtitle">
            We’re unable to approve your loan request because as per IDFC’s loan
            policy your salary receipt mode does not make you eligible for a
            personal loan at this point.
          </div>

          <div className="subtitle">
            We're unable to take your loan application forward as you don't fall
            under the minimum age criteria as per IDFC's loan policy.
          </div>
        </div>
      </Container>
    );
  }
}

export default ApplicationStatus;
