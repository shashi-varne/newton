import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
// import { formatAmountInr } from "../../../utils/validators";
import ContactUs from "../../../common/components/contact_us";

class FinalOffer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "final_loan",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead || {};
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "application_submitted",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.sendEvents('next');
  }

  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Final loan application submitted"
        events={this.sendEvents("just_set_events")}
        handleClick={this.handleClick}
        buttonTitle="CHECK REPORT"
      >
        <div className="final-loan">
          <img
            src={require(`assets/${this.state.productName}/icn_Issue_loan.svg`)}
            style={{ width: "100%" }}
            alt=""
          />

          <div className="subtitle">
            Aamir, you application no. XXXXXX78 for a personal loan of Rs.
            2,00,000 has been submitted and is currently under process.
          </div>
          <div className="subtitle">
            You will soon get a call from IDFC First Bank's sales representative
            who will guide you through the remaining process until the loan
            amount is disbursed to your bank account.
          </div>
          <div className="subtitle">Thank you for choosing Fisdom!</div>
          <ContactUs />
        </div>
      </Container>
    );
  }
}

export default FinalOffer;
