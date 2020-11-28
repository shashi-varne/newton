import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import JourneySteps from "../../../common/ui/JourneySteps";

const journey = [
  {
    basic_details_uploaded: false,
  },
  {
    loan_application_created: false,
  },
  {
    income_details_provided: false,
  },
  {
    documents_uploaded: false,
  },
  {
    Sanction_and_disbursal: false,
  },
];

class JourneyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "journey_screen",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    let lead = this.state.lead || {};
    let personal_info = lead.personal_info || {};
    let professional_info = lead.professional_info || {};
    let application_info = lead.application_info || {};
    let vendor_info = lead.vendor_info || {};

    let idfc_loan_status = vendor_info.idfc_loan_status || "";
    let ckyc_state = vendor_info.ckyc_state || "";

    console.log(idfc_loan_status);
    console.log(ckyc_state)

    let journeyData = {
      options: [
        {
          step: "1",
          title: "Enter basic details",
          subtitle:
            "Fill in personal and work details to get started with your loan application.",
          status: idfc_loan_status === 'basic_details_uploaded' ? "init" : 'completed',
          id: "basic_details"
        },
        {
          step: "2",
          title: "Create loan application",
          subtitle:
            "Check your KYC status to proceed with your loan application.",
          status: "init",
          id: "create_loan_application"
        },
        {
          step: "3",
          title: "Provide income details",
          subtitle:
            "Enter your loan requirements and income details to get the best loan offer.",
          status: "pending",
          id: "income_details"
        },
        {
          step: "4",
          title: "Upload documents",
          subtitle:
            "Provide your office address and upload documents to get your loan sanctioned.",
          status: "pending",
          id: "document_upload"
        },
        {
          step: "5",
          title: "Sanction and disbursal",
          subtitle:
            "IDFC FIRST Bank will verify your application and will get in touch with you to complete the disbursal process.",
          status: "pending",
          id: "sanction_and_disbursal"
        },
      ],
    };

    this.setState({
      journeyData: journeyData,
      ckyc_state: ckyc_state
    });
  };

  handleClick = (id) => {
    console.log(id)
    let { ckyc_state } = this.state;

    if (id === 'create_loan_application') {
      if (ckyc_state === 'init') {
        console.log(ckyc_state)
      } else {
        this.updateApplication({
          idfc_loan_status: "ckyc"
        })
      }
    }

    if (id === 'basic_details') {
      this.navigate('summary')
    }
  };

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "introduction",
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
        noFooter={true}
        headerData={{
          icon: "close",
        }}
        hidePageTitle={true}
      >
        <div className="journey-track">
          <img
            className="center"
            src={require(`assets/${this.state.productName}/icn_journey_start.svg`)}
            alt=""
          />

          <div className="head-title">
            <b>Awesome!</b> Your loan application is successfully created. Now
            you're just a step away from finding out your loan offer.
          </div>

          <JourneySteps
            handleClick={this.handleClick}
            baseData={this.state.journeyData}
          />
        </div>
      </Container>
    );
  }
}

export default JourneyMap;
