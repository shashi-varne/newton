import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";
import HowToSteps from "../../../common/ui/HowToSteps";
import JourneySteps from "../../../common/ui/JourneySteps";
import { nativeCallback } from "utils/native_callback";
import { getConfig } from "utils/functions";

class LoanKnowMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "main_landing_screen",
      partnerData: {},
      top_cta_title: "APPLY NOW",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let { screenData, provider } = this.state;

    let employement_type = "salaried";
    let eligibility = {};
    if (provider === "idfc") {
      employement_type === "salaried"
        ? (eligibility = screenData.loan_partners[provider].salariedEligibility)
        : (eligibility =
            screenData.loan_partners[provider].selfEmployeeEligibility);
    } else {
      eligibility = screenData.loan_partners[provider].eligibility;
    }

    this.setState({
      partnerData: screenData.loan_partners[provider].partnerData,
      journeyData: screenData.loan_partners[provider].journeyData,
      eligibility: eligibility,
      documents: screenData.loan_partners[provider].documents,
    });

    if (provider === "dmi") {
      let lead = this.state.lead || {};
      let application_info = lead.application_info || {};
      let vendor_info = lead.vendor_info || {};

      let rejection_reason = application_info.rejection_reason || "";

      this.setState({
        reason: rejection_reason,
      });

      if (vendor_info.dmi_loan_status === "complete") {
        this.navigate("report");
        return;
      }

      let process_done = false;
      let isResume = true;
      let top_cta_title = "RESUME";

      if (
        !application_info.latitude ||
        !application_info.network_service_provider
      ) {
        this.setState({
          location_needed: true,
        });

        isResume = false;
        top_cta_title = "APPLY NOW";

        this.setState({
          isResume: isResume,
        });
      }

      if (
        [
          "callback_awaited_disbursement_approval",
          "disbursement_approved",
        ].indexOf(vendor_info.dmi_loan_status) !== -1
      ) {
        process_done = true;
      }

      this.setState({
        application_info: application_info,
        vendor_info: vendor_info,
        isResume: isResume,
        process_done: process_done,
        top_cta_title: top_cta_title,
      });
    }

    if (provider === 'idfc') {
      this.setState({
        top_cta_title:
          this.state.application_exists && this.state.otp_verified
            ? "RESUME"
            : "APPLY NOW",
        next_state:
          this.state.application_exists && this.state.otp_verified
            ? "journey"
            : "edit-number",
      });
    }
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "know_more",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  getNextState = () => {
    let dmi_loan_status = this.state.vendor_info.dmi_loan_status || '';
    let application_status = this.state.application_info.application_status || '';

    let state = '';
    if(this.state.process_done) {
      state = 'report-details';
    } else {
      if(this.state.location_needed) {//condition for mobile
        state = 'permissions';
      } else if(dmi_loan_status === 'application_rejected' || application_status === 'internally_rejected') {
        state = 'instant-kyc-status';
      }else {
        state = 'journey';
      }
    }

    return state;
  }

  handleClick = () => {
    this.sendEvents("next");
    let { provider } = this.state;

    if (provider === 'dmi') {
      let state =  this.getNextState();
      let rejection_reason = this.state.reason || '';
  
      if (state === 'instant-kyc-status') {
        let searchParams = getConfig().searchParams + '&status=loan_not_eligible';
        this.navigate(state, {
          searchParams: searchParams,
          params: {
            rejection_reason: rejection_reason
          }
        });
      
      } else {
        this.navigate(state);
      }
    }

    if (provider === 'idfc') {
      let params = {
        create_new:
          this.state.application_exists && this.state.otp_verified ? false : true,
      };
  
      let { vendor_application_status, pan_status, is_dedupe, rejection_reason } = this.state;
  
      let rejection_cases = [
        "idfc_null_rejected",
        "idfc_0.5_rejected",
        "idfc_1.0_rejected",
        "idfc_1.1_rejected",
        "idfc_1.7_rejected",
        "idfc_4_rejected",
        "idfc_callback_rejected",
        "Age",
        "Salary",
        "Salary reciept mode"
      ];
  
      if (this.state.cta_title === "RESUME") {
        if (rejection_cases.indexOf(vendor_application_status || rejection_reason) !== -1 || is_dedupe) {
          this.navigate("loan-status");
        }
  
        if (rejection_cases.indexOf(rejection_reason) !== -1) {
          this.navigate("loan-status");
        }
  
        if (!pan_status || vendor_application_status === "pan") {
          this.navigate("basic-details");
        } else if (rejection_cases.indexOf(vendor_application_status) === -1 && !is_dedupe) {
          this.navigate("journey");
        }
  
      } else {
        this.getOrCreate(params);
      }
    }
  };

  render() {
    let { partnerData, eligibility, journeyData, documents } = this.state;
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        title="Know more"
        buttonTitle={this.state.top_cta_title}
        handleClick={this.handleClick}
      >
        <div className="loan-know-more">
          <div className="block1-info">
            <div className="partner">
              <div>
                <div>{partnerData.title}</div>
                <div>{partnerData.subtitle}</div>
              </div>
              {partnerData.logo && (
                <img
                  src={require(`assets/${partnerData.logo}.svg`)}
                  alt="idfc logo"
                />
              )}
            </div>
            <div className="sub-text">Apply for loan up to</div>
            <div className="loan-amount">{partnerData.loan_amount}</div>
          </div>

          {journeyData && <JourneySteps static={true} baseData={journeyData} />}

          {eligibility && (
            <HowToSteps
              style={{ marginTop: 20, marginBottom: 0 }}
              baseData={eligibility}
            />
          )}

          {documents && (
            <>
              <div className="generic-hr"></div>
              <div
                className="Flex block2"
                onClick={() => {
                  this.sendEvents("documents");
                }}
              >
                <img
                  className="accident-plan-read-icon"
                  src={require(`assets/${this.state.productName}/document.svg`)}
                  alt=""
                />
                <div className="title">Documents</div>
              </div>
            </>
          )}
          <div className="generic-hr"></div>
          <div
            className="Flex block2"
            onClick={() => {
              this.sendEvents("faq");
            }}
          >
            <img
              className="accident-plan-read-icon"
              src={require(`assets/${this.state.productName}/ic_document_copy.svg`)}
              alt=""
            />
            <div className="title">Frequently asked questions</div>
          </div>
          <div className="generic-hr"></div>
        </div>
      </Container>
    );
  }
}

export default LoanKnowMore;
