import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";

class LoanStatus extends Component {
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
        buttonTitle="NEXT"
        handleClick={this.handleClick}
      >
        <div className="idfc-loan-status">
          <img
            src={require(`assets/${this.state.productName}/ils_loan_failed.svg`)}
            alt=""
          />
          <div className="subtitle">
            Your profile has been successfully evaluated and basis the checks
            you're most likely to get a loan offer.
          </div>

          <div className="subtitle">
            To view the final loan amount, provide your income details.
          </div>

          <div className="subtitle">
            Oops! Something's not right. Please check back in some time.
          </div>

          <div className="subtitle">
            We're so sorry to inform you that IDFC has rejected your loan
            application as it did not meet their loan policy.
          </div>
        </div>
      </Container>
    );
  }
}

export default LoanStatus;
