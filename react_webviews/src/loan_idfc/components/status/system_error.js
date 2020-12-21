import React, { Component } from "react";
import Container from "../../common/Container";
import ContactUs from "../../../common/components/contact_us";
import { initialize } from "../../common/functions";
import { nativeCallback } from "utils/native_callback";

const commonMapper = {
  idfc_null_failed: {
    stage: "after address details"
  },
  idfc_callback_rejected: {
    stage: "after loan requirement details",
  },
  "idfc_0.5_rejected": {
    stage: "after loan requirement details",
  },
  "idfc_10_rejected": {
    stage: "after loan requirement details",
  },
  "idfc_0.5_submitted": {
    top_icon: "ils_loan_status",
    // top_title: "Congratulations,",
    button_title: "NEXT",
    cta_state: "/loan/idfc/income-details",
    close_state: "/loan/idfc/home",
    screenName: "profile_success",
  },
  "idfc_0.5_accepted": {
    top_icon: "ils_loan_status",
    top_title: "Congratulations,",
    button_title: "NEXT",
    cta_state: "/loan/idfc/income-details",
    close_state: "/loan/idfc/home",
    screenName: "profile_success",
  },
  idfc_cancelled: {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
    screenName: "application_rejected",
  },
  "idfc_0.5_failed": {
    stage: "after loan requirement details",
  },
  "idfc_1.1_failed": {
    stage: "after loan offer",
  },
  "idfc_1.7_failed": {
    stage: "after additional details",
  },
  "Salary receipt mode": {
    stage: "after basic details",
  },
  Salary: {
    stage: "after basic details",
  },
  Age: {
    stage: "after basic details",
  },
  is_dedupe: {
    stage: "after loan requirement details",
  },
  "idfc_1.0_failed": {
    stage: "after credit card details",
  },
  'idfc_1.0_accepted': {
    stage: "after loan requirement details",
  },
};

class SystemError extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      vendor_application_status: "",
      screen_name: "system_error",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let vendor_application_status = this.state.vendor_application_status;
    let rejection_reason = this.state.rejection_reason;
    let is_dedupe = this.state.is_dedupe;
    let common_mapper = {}
    if (rejection_reason) {
      common_mapper= commonMapper[rejection_reason] || {};
    } else if (is_dedupe) {
      common_mapper= commonMapper["is_dedupe"] || {};
    } else {
      common_mapper= commonMapper[vendor_application_status] || {};
    }
    this.setState({
      stage: common_mapper.stage || '',
    });
  };

  handleClick = () => {
    this.sendEvents('next');
    this.navigate("home");
  };

  goBack = () => {
    this.sendEvents("back")
    this.navigate("home");
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "system_error",
        stage: this.state.stage || '',
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
        title="System error"
        buttonTitle="OK"
        handleClick={this.handleClick}
        headerData={{
          icon: "close",
          goBack: this.goBack,
        }}
      >
        <div className="idfc-loan-status">
          <img
            src={require(`assets/${this.state.productName}/error_illustration.svg`)}
            className="center"
            alt=""
          />
          <div className="subtitle">
            Oops something's not right. We are checking this with IDFC First Bank and will get back to you as soon as possible.
          </div>
          <ContactUs />
        </div>
      </Container>
    );
  }
}

export default SystemError;
