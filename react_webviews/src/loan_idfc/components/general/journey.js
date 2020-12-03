import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { getOrCreate, initialize } from "../../common/functions";
import JourneySteps from "../../../common/ui/JourneySteps";

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

  onload = () => {
    let lead = this.state.lead || {};
    // let personal_info = lead.personal_info || {};
    // let professional_info = lead.professional_info || {};
    // let application_info = lead.application_info || {};
    let vendor_info = lead.vendor_info || {};

    let idfc_loan_status = vendor_info.idfc_loan_status || "";
    let ckyc_state = vendor_info.ckyc_state || "";

    let journey = {
      basic_details_uploaded: "1",
      ckyc: "1",
      idfc_null_submitted: "2",
      idfc_null_accepted: "2",
      idfc_null_rejected: "2",
      "idfc_0.5_submitted": "3",
      "idfc_0.5_accepted": "3",
      "idfc_0.5_rejected": "3",
    };
    let index = (idfc_loan_status && journey[idfc_loan_status]) || "0";

    let journeyData = {
      options: [
        {
          step: "1",
          title: "Enter basic details",
          titleCompleted: "Basic details uploaded ",
          subtitle:
            "Fill in personal and work details to get started with your loan application.",
          status: index && index === "0" ? "init" : "completed",
          id: "basic_details",
          cta: "SUMMARY",
        },
        {
          step: "2",
          title: "Create loan application",
          titleCompleted: "Loan application created",
          subtitle:
            "Check your KYC status to proceed with your loan application.",
          status: index && index === "1" ? "init" : "completed",
          id: "create_loan_application",
          cta:
            idfc_loan_status === "ckyc"
              ? "RESUME"
              : index > "1"
              ? "SUMMARY"
              : "START",
        },
        {
          step: "3",
          title: "Provide income details",
          titleCompleted: "Provided income details",
          subtitle:
            "Enter your loan requirements and income details to get the best loan offer.",
          status:
            index && index === "2"
              ? "init"
              : index < "2"
              ? "pending"
              : "completed",
          id: "income_details",
        },
        {
          step: "4",
          title: "Upload documents",
          titleCompleted: "Documents uploaded",
          subtitle:
            "Provide your office address and upload documents to get your loan sanctioned.",
          status:
            index && index === "3"
              ? "init"
              : index < "3"
              ? "pending"
              : "completed",
          id: "document_upload",
        },
        {
          step: "5",
          title: "Sanction and disbursal",
          titleCompleted: "",
          subtitle:
            "IDFC FIRST Bank will verify your application and will get in touch with you to complete the disbursal process.",
          status:
            index && index === "4"
              ? "init"
              : index < "4"
              ? "pending"
              : "completed",
          id: "sanction_and_disbursal",
        },
      ],
    };

    this.setState({
      journeyData: journeyData,
      ckyc_state: ckyc_state,
      idfc_loan_status: idfc_loan_status,
      index: index,
    });
  };

  getCkycState = async () => {
    this.setState({
      show_loader: true,
    });

    await this.getOrCreate();

    let lead = this.state.lead || {};
    let vendor_info = lead.vendor_info || {};

    if (vendor_info.ckyc_state !== "init") {
      this.updateApplication({
        idfc_loan_status: "ckyc",
      });
    } else {
      this.getCkycState();
    }
  };

  handleClick = (id) => {
    let { ckyc_state, idfc_loan_status } = this.state;

    if (id === "create_loan_application") {
      if (ckyc_state === "init") {
        this.getCkycState();
      } else {
        this.updateApplication({
          idfc_loan_status: "ckyc",
        });
      }
    }

    if (id === "basic_details") {
      this.navigate("application-summary");
    }

    if (id === "income_details") {
      this.navigate("loan-requirement-details");
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
    let { idfc_loan_status, index } = this.state;
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

          {index === "1" && (
            <div className="head-title">
              <b>Ta-da! You’ve</b> successfully uploaded your basic details.
            </div>
          )}

          {index === "2" && (
            <div className="head-title">
              <b>Awesome!</b> Your loan application is successfully created. Now
              you're just a step away from finding out your loan offer.
            </div>
          )}

          {idfc_loan_status && (
            <JourneySteps
              handleClick={this.handleClick}
              baseData={this.state.journeyData}
            />
          )}
        </div>
      </Container>
    );
  }
}

export default JourneyMap;
