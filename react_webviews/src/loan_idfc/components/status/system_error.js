import React, { Component } from "react";
import Container from "../../common/Container";
import ContactUs from "../../../common/components/contact_us";
import { initialize } from "../../common/functions";
import { nativeCallback } from "utils/native_callback";

const commonMapper = {
  idfc_null_failed: {
    stage: "after address details",
  },
  idfc_callback_rejected: {
    stage: "after loan requirement details",
  },
  "idfc_0.5_rejected": {
    stage: "after loan requirement details",
  },
  "idfc_1.0_rejected": {
    stage: "after loan requirement details",
  },
  "idfc_0.5_submitted": {
    stage: "after loan requirement details",
  },
  "idfc_0.5_accepted": {
    stage: "after loan requirement details",
  },
  idfc_cancelled: {
    stage: "",
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
  "idfc_1.0_accepted": {
    stage: "after credit card details",
  },
};

class SystemError extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: 'g',
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
    let bt_eligible = this.state.bt_eligible;
    if (!bt_eligible) {
      commonMapper["idfc_1.0_failed"].stage = "after loan requirement details";
      commonMapper["idfc_1.0_accepted"].stage =
        "after loan requirement details";
    }
    let common_mapper = {};
    if (rejection_reason) {
      common_mapper = commonMapper[rejection_reason] || {};
    } else if (is_dedupe) {
      common_mapper = commonMapper["is_dedupe"] || {};
    } else {
      common_mapper = commonMapper[vendor_application_status] || {};
    }
    this.setState({
      stage: common_mapper.stage || "",
    });
  };

  handleClick = () => {
    this.sendEvents("next");
    this.navigate("loan-know-more");
  };

  goBack = () => {
    this.sendEvents("back");
    this.navigate("loan-know-more");
  };

  sendEvents(user_action) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_system_error",
      properties: {
        user_action: user_action,
        stage: this.state.stage || "",
        event_name: "idfc_system_error",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.getOrCreate,
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
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        title="System error"
        buttonTitle="OKAY"
        handleClick={this.handleClick}
        headerData={{
          icon: "close",
          goBack: this.goBack,
        }}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="idfc-loan-status">
          <img
            src={require(`assets/${this.state.productName}/error_illustration.svg`)}
            className="center"
            alt=""
          />
          <div className="subtitle">
            <b>Oops!</b> Something is not right. We are checking this with IDFC
            FIRST Bank and will get back to you as soon as possible.
          </div>
          <ContactUs />
        </div>
      </Container>
    );
  }
}

export default SystemError;
