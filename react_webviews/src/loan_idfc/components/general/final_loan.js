import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import {
  formatAmountInr,
  capitalizeFirstLetter,
} from "../../../utils/validators";
import ContactUs from "../../../common/components/contact_us";

class FinalOffer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: 'g',
      screen_name: "final_loan",
      first_name: "",
      vendor_info: {},
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
    let application_id = lead.application_id || "";

    this.setState({
      vendor_info: vendor_info,
      first_name: personal_info.first_name,
      application_id: application_id,
    });
  };

  sendEvents(user_action) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_application_submitted",
      properties: {
        user_action: user_action,
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
    this.navigate("reports");
  };

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.getOrCreate,
          title1: this.state.title1,
          button_text1: "Retry",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        title="Loan application submitted"
        handleClick={this.handleClick}
        buttonTitle="CHECK LOAN SUMMARY"
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="final-loan">
          <img
            src={require(`assets/${this.state.productName}/icn_Issue_loan.svg`)}
            style={{ width: "100%" }}
            alt=""
          />

          <div className="head">Loan details:</div>
          <div className="sub-head">
            <div className="tag">
              Application no: {this.state.application_id}
            </div>
            <div className="tag">
              Loan amount: {formatAmountInr(this.state.vendor_info.loanAmount)}
            </div>
          </div>

          <div className="sub-msg">
            <div className="title">What next?</div>
            <div className="sub-title">
              IDFC FIRST Bank’s sales executive will call you within the next 24
              hours and will assist you till loan disbursal.
            </div>
          </div>

          <div className="subtitle">
            Thank you for choosing{" "}
            {capitalizeFirstLetter(this.state.productName)}!
          </div>
          <ContactUs />
        </div>
      </Container>
    );
  }
}

export default FinalOffer;
