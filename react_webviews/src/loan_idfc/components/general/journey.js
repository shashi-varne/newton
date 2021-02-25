import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import { formatAmountInr } from "utils/validators";
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
    next_state: "loan-requirement-details",
  },
  "idfc_0.5_failed": {
    index: "2",
    next_state: "loan-requirement-details",
  },
  "idfc_0.5_submitted": {
    index: "2",
    next_state: "loan-requirement-details",
  },
  "idfc_0.5_accepted": {
    index: "2",
    next_state: "loan-status",
  },
  perfios: {
    index: "2",
    next_state: "income-details",
  },
  bt_init: {
    index: "2",
    next_state: "bt-info",
  },
  bt_processing: {
    index: "2",
    next_state: "bt-info",
  },
  bt_bypass: {
    index: "2",
    next_state: "bt-info",
  },
  "idfc_1.0_failed": {
    index: "2",
    next_state: "eligible-loan",
  },
  "idfc_1.0_submitted": {
    index: "2",
    next_state: "eligible-loan",
  },
  "idfc_1.0_accepted": {
    index: "2",
    next_state: "eligible-loan",
  },
  "idfc_1.1_failed": {
    index: "2",
    next_state: "eligible-loan"
  },
  "idfc_1.1_submitted": {
    index: "2",
    next_state: "loan-requirement-details"
  },
  "idfc_1.1_accepted": {
    index: "2",
    next_state: "loan-eligible",
  },
  offer_accepted: {
    index: "3",
    next_state: "additional-details",
  },
  "idfc_1.7_submitted": {
    index: "3",
    next_state: "doc-list",
  },
  "idfc_1.7_accepted": {
    index: "3",
    next_state: "doc-list",
  },
  "idfc_1.7_failed": {
    index: "3",
    next_state: "additional-details",
  },
  doc_uploaded: {
    index: "3",
    next_state: "doc-list",
  },
  idfc_4_submitted: {
    index: "4",
  },
  idfc_4_accepted: {
    index: "4",
  },
  idfc_3_submitted: {
    index: "4",
  },
  idfc_3_accepted: {
    index: "4",
  },
  application_submitted: {
    index: "4",
  }
};
class JourneyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: 'g',
      screen_name: "journey_screen",
      count: 0,
      loaderWithData: false,
      loaderData: {},
      noHeader: false,
      resume: false
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
    let application_info = lead.application_info || {};
    let bt_info = lead.bt_info || {}

    let idfc_loan_status = vendor_info.idfc_loan_status || "";
    let ckyc_state = vendor_info.ckyc_state || "";
    let perfios_state = vendor_info.perfios_state || "";
    let application_complete = application_info.application_status === "application_complete";

    if (idfc_loan_status === "idfc_callback_rejected" || idfc_loan_status ===  "idfc_cancelled") {
      this.navigate('loan-status');
      return
    }

    let index =
      (idfc_loan_status && journeyMapper2[idfc_loan_status].index) || "0";

      let loaderData = {
        title: "Hang on while we fetch your KYC details from the centralised KYC repository",
        subtitle: 'Please confirm the details on the next screen to proceed with your loan application'
      }

    let journeyData = {
      options: [
        {
          step: "1",
          title: "Enter basic details",
          titleCompleted: "Work details uploaded",
          subtitle:
            "Verify mobile, enter self-related information and work details to get started.",
          status: index && index >= "0" ? "completed" : "init",
          id: "basic_details",
          cta: "SUMMARY",
        },
        {
          step: "2",
          title: "Create loan application",
          titleCompleted: "Loan application created",
          subtitle:
            "Enter personal and address details to proceed with loan application.",
          status:
            index === "1" ? "init" : index > "1" ? "completed" : "pending",
          id: "create_loan_application",
          cta:
            idfc_loan_status === "basic_details_uploaded"
              ? "START"
              : index === "1"
              ? "RESUME"
              : index > "1" && "SUMMARY",
        },
        {
          step: "3",
          title: "Provide income details",
          titleCompleted: "Provided income details",
          subtitle:
            "Provide your loan requirements and income details to get the best loan offer.",
          status:
            index === "2" ? "init" : index > "2" ? "completed" : "pending",
          id: "income_details",
          cta:
            idfc_loan_status === "idfc_null_accepted"
              ? "START"
              : index === "2"
              ? "RESUME"
              : index > "2" && "",
        },
        {
          step: "4",
          title: "Upload documents",
          titleCompleted: "Documents uploaded",
          subtitle:
            "Provide office address and upload documents to get loan sanctioned.",
          status:
            index === "3" ? "init" : index > "3" ? "completed" : "pending",
          id: "document_upload",
          cta:
            (idfc_loan_status === "offer_accepted")
              ? "START"
              : index === "3"
              ? "RESUME"
              : index > "3" && "",
        },
        {
          step: "5",
          title: "Sanction and disbursal",
          titleCompleted: "",
          subtitle:
            "IDFC FIRST Bank will verify application and will get in touch with you to complete the disbursal process.",
          status:
            index && index === "4"
              ? "init"
              : index < "4"
              ? "pending"
              : "",
          cta:
            index === "4" &&
            "CHECK",
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
      first_name: personal_info.first_name,
      vendor_info: vendor_info,
      bt_info: bt_info,
      application_complete: application_complete,
      loaderData: loaderData,
    });
  };

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
        submit: {
          handleClick1: () => {
            this.setState({
              skelton: false,
              showError: false,
            });
          },
          button_text1: "Dismiss",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "journey_map",
        stage: data.stage,
        summary_selected_for: data.summary_selected_for || "",
        resume: this.state.resume ? 'yes' : 'no'
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
      loaderWithData: true
    });
    
    let result = await this.getUserStatus();

    let { count } = this.state;
    let that = this;

    setTimeout(function () { 
      if (result.ckyc_status !== "init") {
        let body = {
          idfc_loan_status: "ckyc",
        };
        that.updateApplication(body, "personal-details", "loaderWithData", true);
      } else {
        if (count < 20) {
          that.setState({
            count: count + 1,
          });
  
          that.getCkycState();
        } else {
          that.navigate("error");
        }
      }
    }, 3000);
  };

  handleClick = (id) => {
    let { ckyc_state, perfios_state, idfc_loan_status, index, vendor_info, bt_info } = this.state;
    let next_state = journeyMapper2[idfc_loan_status].next_state;

    let selected_journey = this.state.journeyData.options.find((data) => data.id === id);
    let stage = selected_journey.titleCompleted.toLowerCase();
    
    // ---step-1
    if (id === "basic_details") {
      this.sendEvents("summary", {stage: stage, summary_selected_for: stage});
      this.navigate("application-summary");
    }
    // ---step-2
    if (id === "create_loan_application") {
      if (ckyc_state === "init") {
        this.sendEvents('next', {stage: stage});
        this.getCkycState();
      } else {
        this.setState({
          loaderWithData: ckyc_state === "success"
        });
        if (index > "1") {
          this.sendEvents('summary', {stage: stage, summary_selected_for: stage});
          this.navigate("ckyc-summary");
        } else {
          this.sendEvents('next', {stage: stage});

          if (idfc_loan_status !== 'ckyc') {
            this.updateApplication({
              idfc_loan_status: "ckyc",
            }, "", "skelton", "g");
          } else {
            this.setState({
              resume: true
            })
            this.navigate('personal-details')
          }
          
        }
      }
    }
    // ---step-3
    if (id === "income_details" && index <= "2") {
      if (next_state !== 'loan-requirement-details') {
        this.setState({
          resume: true
        })
      }
      this.sendEvents('next', {stage: stage});
      if (idfc_loan_status === "idfc_0.5_accepted" || idfc_loan_status === "idfc_0.5_submitted") {
        this.get05Callback();
      } else if (idfc_loan_status === "idfc_1.0_accepted" || idfc_loan_status === "idfc_1.0_submitted") {
        this.get10Callback();
      } else if (idfc_loan_status === "idfc_1.0_failed") {
        this.submitApplication({}, "one", "", "eligible-loan");
      } else if (idfc_loan_status === "idfc_1.1_accepted" || idfc_loan_status === "idfc_1.1_submitted") {
        this.get11Callback();
      } else {
        if (
          idfc_loan_status === "perfios" &&
          perfios_state &&
          perfios_state !== "failure" &&
          perfios_state !== "init"
        ) {
          next_state = "perfios-status";
        } else if ((idfc_loan_status === "bt_init" || idfc_loan_status === "bt_processing") && vendor_info.bt_selected) {
          next_state = vendor_info.bt_updated ? !bt_info.bt_personal_loan ? "credit-bt": 'loan-bt' : 'bt-info'
        }
        this.navigate(next_state);
      }
    }
    // ---step-4
    if (id === "document_upload" && index <= "3") {
      if (next_state !== 'additional-details') {
        this.setState({
          resume: true
        })
      }
      this.sendEvents('next', {stage: stage});
      this.navigate(next_state);
    }

    // ---step-5
    if (id === "sanction_and_disbursal") {
      this.sendEvents('next', {stage: stage});
      this.navigate('reports')
    }
  };

  render() {
    let { idfc_loan_status, index, vendor_info } = this.state;
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        noFooter={true}
        headerData={{
          icon: "close",
        }}
        hidePageTitle={true}
        loaderData={this.state.loaderData}
        skelton={this.state.skelton}
        loaderWithData={this.state.loaderWithData}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="journey-track">
          {index < "3" && <img
            className="center"
            src={require(`assets/${this.state.productName}/icn_journey_start.svg`)}
            alt=""
          />}

          {index >= "3" && <img
            className="center"
            src={require(`assets/${this.state.productName}/icn_lourney_end.svg`)}
            alt=""
          />}

          {index <= "1" && (
            <div className="head-title">
              Great, step 1 completed!
            </div>
          )}
          {index === "2" && (
            <div className="head-title">
              Awesome, step 2 done! Get going to know the best offer.
            </div>
          )}

          {index === "3" && (
            <div>
              <div className="head-title top-title">
                Congrats, for the loan offer of
              </div>
              <div className="amount-inr">{formatAmountInr(vendor_info.updated_offer_amount)}</div>
              <div className="head-title bottom-title">Please provide document proofs</div>
            </div>
          )}

          {index === "4" && (
            <div className="head-title">
              Congrats, for the loan offer
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