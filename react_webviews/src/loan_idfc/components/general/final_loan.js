import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import { formatAmountInr } from "../../../utils/validators";
import ContactUs from "../../../common/components/contact_us";

class FinalOffer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "final_loan",
      first_name: "",
      vendor_info: {}
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead || {};
    let vendor_info = lead.vendor_info || {};
    let personal_info = lead.personal_info || {};
    let application_id = lead.application_id || ""

    this.setState({
      vendor_info: vendor_info,
      first_name: personal_info.first_name,
      application_id: application_id
    })
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "loan eligibility",
        stage: "eligible",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.navigate('reports')
  }

  render() {
    return (
      <Container
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
            {this.state.first_name}, you application no. {this.state.application_id} for a personal loan of {formatAmountInr(this.state.vendor_info.loanAmount)} has been submitted and is currently under process.
          </div>
          <div className="subtitle">
            You will soon get a call from IDFC First Bank's sales representative
            who will guide you through the remaining process until the loan
            amount is disbursed to your bank account.
          </div>
          <div className="subtitle">Thank you for choosing {this.state.productName}!</div>
          <ContactUs />
        </div>
      </Container>
    );
  }
}

export default FinalOffer;
