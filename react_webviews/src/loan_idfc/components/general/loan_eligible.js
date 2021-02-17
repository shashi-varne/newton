import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import { formatAmountInr } from "../../../utils/validators";

class LoanEligible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "loan_eligible",
      first_name: "",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead || {};
    let application_info = lead.application_info || {};
    let vendor_info = lead.vendor_info || {};

    this.setState({
      vendor_info: vendor_info,
      application_info: application_info,
    });
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "final_loan_offer",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.sendEvents("next");
    let body = {
      idfc_loan_status: "offer_accepted",
    };

    this.updateApplication(body);
  };

  render() {
    let vendor_info = this.state.vendor_info || {};

    return (
      <Container
        showLoader={this.state.show_loader}
        title=""
        events={this.sendEvents("just_set_events")}
        handleClick={this.handleClick}
        buttonTitle="NEXT"
        hidePageTitle={true}
      >
        <div className="loan-status">
          <img
            src={require(`assets/${this.state.productName}/congratulations.svg`)}
            id="congratulations"
            alt=""
          />

          <div className="loan-eligible">
            Congrats, {this.state.first_name.trim(" ")}!
          </div>

          <div className="sub-head">Your final loan amount is</div>

          <div className="loan-amount">
            {formatAmountInr(vendor_info.updated_offer_amount)}
          </div>

          <div className="loan-value">
            <div>
              <div className="title">EMI amount</div>
              <div className="values">
                {formatAmountInr(vendor_info.updated_offer_emi)}
              </div>
            </div>
            <div>
              <div className="title">Tenure</div>
              <div className="values">
                {vendor_info.updated_offer_tenor} months
              </div>
            </div>
            <div>
              <div className="title">Rate of interest</div>
              <div className="values">{Math.round(vendor_info.updated_offer_roi)}% p.a.</div>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default LoanEligible;
