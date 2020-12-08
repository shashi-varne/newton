import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import JourneySteps from "../../../common/ui/JourneySteps";

const journeyMapper2 = {
  basic_details_uploaded: {
    index: "1",
  },
  ckyc: {
    index: "1",
  },
  idfc_null_failed: {
    index: "1",
  },
  idfc_null_submitted: {
    index: "1",
  },
  idfc_null_accepted: {
    index: "2",
    next_state: "loan-requirement-details"
  },
  "idfc_0.5_failed": {
    index: "2",
    next_state: "loan-requirement-details"
  },
  "idfc_0.5_submitted": {
    index: "2",
    next_state: "loan-requirement-details"
  },
  "idfc_0.5_accepted": {
    index: "2",
    next_state: "loan-status"
  },
  perfios: {
    index: "2",
    next_state: "income-details"
  },
  bt_init: {
    index: "2",
    next_state: "bt-info"
  },
  bt_processing: {
    index: "2",
    next_state: "bt-info"
  },
  bt_bypass: {
    index: "2",
    next_state: "bt-info"
  },
  // bt_processing: {
  //   index: "2",
  //   next_state: "loan-requirement-details"
  // },
  // "idfc_1.0_submitted": {
  //   index: "2",
  //   next_state: "loan-requirement-details"
  // },
  "idfc_1.0_accepted": {
    index: "2",
    next_state: "eligible-loan"
  },
  // "idfc_1.1_submitted": {
  //   index: "2",
  //   next_state: "loan-requirement-details"
  // },
  "idfc_1.1_accepted": {
    index: "2",
    next_state: "loan-eligible"
  },
  "offer_accepted": {
  // "idfc_1.1_failed": {
    index: "3",
    next_state: "additional-details"
  },
  "idfc_1.7_submitted": {
    index: "3",
  },
  "idfc_1.7_accepted": {
    index: "3",
  },
  doc_uploaded: {
    index: "4",
  },
  idfc_4_submitted: {
    index: "3",
  },
  idfc_4_accepted: {
    index: "4",
  },
};

class JourneyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "journey_screen",
      count: 0
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead || {};
    let vendor_info = lead.vendor_info || {};

    let idfc_loan_status = vendor_info.idfc_loan_status || "";
    let ckyc_state = vendor_info.ckyc_state || "";
    let perfios_state = vendor_info.perfios_state || "";

    let index = (idfc_loan_status && journeyMapper2[idfc_loan_status].index) || "0";

    let journeyData = {
      options: [
        {
          step: "1",
          title: "Enter basic details",
          titleCompleted: "Basic details uploaded ",
          subtitle:
            "Fill in personal and work details to get started with your loan application.",
          status: index && index >= "0" ? "completed" : "init",
          id: "basic_details",
          cta: "SUMMARY",
        },
        {
          step: "2",
          title: "Create loan application",
          titleCompleted: "Loan application created",
          subtitle:
            "Check your KYC status to proceed with your loan application.",
          status: index === "1" ? "init" : index > "1" ? "completed" : "pending",
          id: "create_loan_application",
          cta: idfc_loan_status === "basic_details_uploaded" ? 'START' : index === "1" ? "RESUME" : index > "1" && "SUMMARY"
        },
        {
          step: "3",
          title: "Provide income details",
          titleCompleted: "Provided income details",
          subtitle:
            "Enter your loan requirements and income details to get the best loan offer.",
          status: index === "2" ? "init" : index > "2" ? "completed" : "pending",
          id: "income_details",
          cta: idfc_loan_status === "idfc_null_accepted" ? 'START' : index === "2" ? "RESUME" : index > "2" && "SUMMARY"
        },
        {
          step: "4",
          title: "Upload documents",
          titleCompleted: "Documents uploaded",
          subtitle:
            "Provide your office address and upload documents to get your loan sanctioned.",
          status: index === "3" ? "init" : index > "3" ? "completed" : "pending",
          id: "document_upload",
          cta: idfc_loan_status === "offer_accepted" ? 'START' : index === "3" ? "RESUME" : index > "3" && "SUMMARY"
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
          cta: idfc_loan_status === "doc_uploaded" && "CHECK",
          id: "sanction_and_disbursal",
        },
      ],
    };

    this.setState({
      journeyData: journeyData,
      ckyc_state: ckyc_state,
      idfc_loan_status: idfc_loan_status,
      perfios_state: perfios_state,
      index: index,
    });
  };

  sendEvents(user_action,  data = {}) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "journey_map",
        stage: data.stage,
        summary_selected_for: data.summary_selected_for || "",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

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
    let { ckyc_state, perfios_state, idfc_loan_status, index } = this.state;
    let next_state = journeyMapper2[idfc_loan_status].next_state;

    // ---step-1
    if (id === "basic_details") {
      this.sendEvents("summary", {stage: "basic details uploaded", summary_selected_for: "basic details uploaded"});
      this.navigate("application-summary");
    }

    // ---step-2
    if (id === "create_loan_application") {
      if (ckyc_state === "init") {
        this.sendEvents('next', {stage: "loan application created"});
        this.getCkycState();
      }
      if (index > "1") {
        this.sendEvents('summary', {stage: "loan application created", summary_selected_for: "loan application created"});
        this.navigate("ckyc-summary");
      } else {
        this.sendEvents('next', {stage: "loan application created"});
        this.updateApplication({
          idfc_loan_status: "ckyc",
        });
      }
    }

    // ---step-3
    if (id === "income_details") {
      this.sendEvents('next', {stage: "provide income details"});
      if (idfc_loan_status === "idfc_0.5_accepted") {
        this.get05Callback();

      } else {
        if (idfc_loan_status === "perfios" && (perfios_state !== "failure" && perfios_state !== "init")) {
          next_state = "perfios-status"
        }
        this.navigate(next_state);
      }
    }

    if (id === "document_upload") {
      this.sendEvents('next', {stage: "documents uploaded"});
      this.navigate(next_state);
    }  

    if (id === "sanction_and_disbursal") {
      this.sendEvents('next', {stage: "Sanction and disbursal"});
      this.navigate('reports')
    }
  };

  render() {
    let { idfc_loan_status, index } = this.state;
    return (
      <Container
        events={this.sendEvents('just_set_events')}
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

          {index <= "1" && (
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
