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
      loaderWithData: false,
      loaderData: {}
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let progressHeaderData = {
      title: 'income details and loan offer',
      steps: [
        {
          title: "Income details",
          status: "completed",
        },
        {
          title: "BT details",
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

    let loaderData = {
      title: `Hang on, while IDFC calculates your eligible loan amount as per their proprietary algorithms based on the information you have provided`,
      subtitle: "This may take around 2 minutes!",
    };

    this.setState({
      "idfc_07_state": vendor_info.idfc_07_state,
      loaderData: loaderData
    })
  };

  handleClickTwo = () => {
    this.sendEvents('opt_for_bt');
    let body = {
      idfc_loan_status: "bt_processing",
      bt_selected: 'True',
    };
    this.updateApplication(body, "loan-bt");
  };

  handleClickOne = () => {
    this.sendEvents('not_opt_for_bt');
    this.setState({
      loaderWithData: true
    })
    let body = {
      idfc_loan_status: "bt_bypass",
      bt_selected: 'False',
    };

    this.updateApplication(body)

    // if (this.state.idfc_07_state !== 'success') {
    //   this.submitApplication({}, "one", "", "eligible-loan");
    // }
  }

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "bt_transfer_details",
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
        events={this.sendEvents('just_set_events')}
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
        loaderWithData={this.state.loaderWithData}
        loaderData={this.state.loaderData}
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
