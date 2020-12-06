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

    let progressHeaderData = {
      title: 'Income and loan offer',
      steps: [
        {
          title: "Income details",
          status: "completed",
        },
        {
          title: "BT transfer details",
          status: "init",
        },
        {
          title: "Loan offer",
          status: "pending",
        },
      ],
    };

    this.setState({
      progressHeaderData: progressHeaderData,
    });
  }

  onload = () => {
    let lead = this.state.lead || {};
    let vendor_info = lead.vendor_info || {};

    this.setState({
      "idfc_07_state": vendor_info.idfc_07_state
    })
  };

  handleClickTwo = () => {
    let body = {
      idfc_loan_status: "bt_processing",
      bt_selected: true,
    };
    this.updateApplication(body, "loan-bt");
  };

  handleClickOne = () => {
    let body = {
      idfc_loan_status: "bt_bypass",
    };

    this.updateApplication(body)

    // if (this.state.idfc_07_state !== 'success') {
    //   this.submitApplication({}, "one", "", "eligible-loan");
    // }
  }

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
        twoButton={true}
        dualbuttonwithouticon={true}
        buttonOneTitle="NOT OPTING FOR BT"
        buttonTwoTitle="OPTING FOR BT"
        handleClickOne={this.handleClickOne}
        handleClickTwo={this.handleClickTwo}
        headerData={{
          progressHeaderData: this.state.progressHeaderData,
        }}
      >
        <div className="bt-info">
          <div className="head">How does BT work?</div>
          <div className="sub-head">
            A 'balance transfer' is a unique feature that allows you to transfer
            the outstanding principal amount of your existing personal loans or
            credit cards (taken from other lenders) to IDFC FIRST Bank (if any).
          </div>

          <HowToSteps
            style={{ marginTop: "10px", marginBottom: 0 }}
            baseData={this.state.screenData.benefits}
          />

          <HowToSteps
            style={{ marginTop: "-20px", marginBottom: "30px" }}
            baseData={this.state.screenData.required_info}
          />
        </div>
      </Container>
    );
  }
}

export default BtInformation;
