import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import { getUrlParams } from "utils/validators";
import ContactUs from "../../../common/components/contact_us";


const commonMapper = {
  idfc_null_failed: {
    top_icon: "error_illustration",
    top_title: "System error",
    button_title: "OK",
    icon: "close",
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
    failed: true,
  },
  "idfc_0.5_rejected": {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "OK",
    icon: "close",
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  "idfc_0.5_submitted": {
    top_icon: "ils_loan_status",
    top_title: "Congratulations,",
    button_title: "NEXT",
    cta_state: "/loan/idfc/income-details",
    close_state: "/loan/idfc/home",
  },
  "idfc_0.5_accepted": {
    top_icon: "ils_loan_status",
    top_title: "Congratulations,",
    button_title: "NEXT",
    cta_state: "/loan/idfc/income-details",
    close_state: "/loan/idfc/home",
  },
  "idfc_cancelled": {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  "idfc_0.5_failed": {
    top_icon: "error_illustration",
    top_title: "System error",
    button_title: "OK",
    icon: "close",
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  "idfc_1.1_failed": {
    top_icon: "error_illustration",
    top_title: "System error",
    button_title: "OK",
    icon: "close",
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  "idfc_1.7_failed": {
    top_icon: "error_illustration",
    top_title: "System error",
    button_title: "OK",
    icon: "close",
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  "idfc_1.1_accepted": {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "OK",
    icon: "close",
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  "Salary receipt mode": {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  Salary: {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  Age: {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  is_dedupe: {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "OK",
    icon: "close",
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
  failure: {
    top_icon: "ils_loan_failed",
    top_title: "Bank statement verification failed",
    id: "bank",
    button_title: "RETRY",
    icon: "close",
    // cta_state: "/loan/idfc/home",
    // close_state: "/loan/idfc/home",
  },
  success: {
    top_icon: "ils_loan_failed",
    top_title: "Bank statement verification suucessful",
    id: "bank",
    button_title: "NEXT",
    icon: "close",
    // cta_state: "/loan/idfc/home",
    // close_state: "/loan/idfc/home",
  },
  blocked: {},
  bypass: {
    top_icon: "ils_loan_failed",
    top_title: "Bank statement verification failed",
    id: "bank",
    button_title: "NEXT",
    icon: "close",
    // cta_state: "/loan/idfc/home",
    // close_state: "/loan/idfc/home",
  },
  "idfc_1.0_failed": {
    top_icon: "error_illustration",
    top_title: "System error",
    button_title: "OK",
    icon: "close",
    cta_state: "/loan/idfc/home",
    close_state: "/loan/idfc/home",
  },
};

class LoanStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: getUrlParams(),
      commonMapper: {},
      vendor_application_status: "",
      screen_name: "loan_status",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {

    let vendor_application_status = this.state.vendor_application_status;
    let application_status = this.state.application_status;
    let pan_status = this.state.pan_status;
    let ckyc_status = this.state.ckyc_status;
    let idfc_05_callback = this.state.idfc_05_callback;
    let perfios_status = this.state.perfios_status;
    let otp_verified = this.state.otp_verified;
    let idfc_07_state = this.state.idfc_07_state;
    let bt_selected = this.state.bt_selected;
    let idfc_10_callback = this.state.idfc_10_callback;
    let rejection_reason = this.state.rejection_reason;
    idfc_05_callback;
    let first_name = this.state.first_name;
    let is_dedupe = this.state.is_dedupe;

    if (rejection_reason) {
      this.setState({
        commonMapper: commonMapper[rejection_reason] || {},
        application_status: application_status,
        rejection_reason: rejection_reason,
      });
    } else if (is_dedupe) {
      this.setState({
        commonMapper: commonMapper["is_dedupe"] || {},
        application_status: application_status,
      });
    } else {
      if (vendor_application_status === "idfc_0.5_accepted") {
        commonMapper[vendor_application_status].top_title =
          commonMapper[vendor_application_status].top_title +
          " " +
          first_name +
          "!";
      }

      this.setState({
        commonMapper: commonMapper[vendor_application_status] || {},
        vendor_application_status: vendor_application_status,
        first_name: first_name,
      });
    }
    
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: !this.state.is_dedupe && this.state.vendor_application_status === "idfc_0.5_accepted" ? "profile_success" : this.state.commonMapper.top_title || "status",
        rejection_reason: this.state.rejection_reason || "",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  goBack = () => {
    this.navigate(this.state.commonMapper.close_state);
  };

  handleClick = () => {
    this.sendEvents('next');
    let {
      commonMapper,
      vendor_application_status,
      application_status,
      bt_eligible,
      perfios_state,
      is_dedupe
    } = this.state;
    if (
      !is_dedupe &&
      vendor_application_status === "idfc_0.5_accepted"
    ) {
      let body = {
        perfios_state: "init",
        idfc_loan_status: "perfios",
      };

      this.updateApplication(body, "income-details");
    }

    if (commonMapper.button_title === "START NEW APPLICATION") {
      let params = {
        create_new: true,
        reset: true,
      };

      this.getOrCreate(params);
    } else {
      this.navigate(this.state.commonMapper.cta_state);
    }
  };

  render() {
    let {
      commonMapper,
      vendor_application_status,
      rejection_reason,
      is_dedupe,
    } = this.state;

    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title={commonMapper.top_title}
        buttonTitle={commonMapper.button_title}
        handleClick={this.handleClick}
        headerData={{
          icon: commonMapper.icon || "",
          goBack: this.goBack,
        }}
      >
        <div className="idfc-loan-status">
          {commonMapper["top_icon"] && (
            <img
              src={require(`assets/${this.state.productName}/${commonMapper["top_icon"]}.svg`)}
              className="center"
              alt=""
            />
          )}
          {rejection_reason === "Salary receipt mode" && (
            <div className="subtitle">
              We’re unable to approve your loan request because as per IDFC’s
              loan policy your salary receipt mode does not make you eligible
              for a personal loan at this point.
            </div>
          )}

          {rejection_reason === "Salary" && (
            <div className="subtitle">
              We’re unable to approve your loan request because as per IDFC’s
              loan policy your monthly salary does not qualify you for a
              personal loan at this point.
            </div>
          )}

          {rejection_reason === "Age" && (
            <div className="subtitle">
              We're unable to take your loan application forward as you don't
              fall under the minimum age criteria as per IDFC's loan policy.
            </div>
          )}

          {vendor_application_status === "idfc_0.5_rejected" && (
            <div className="subtitle">
              We're so sorry to inform you that IDFC has rejected your loan
              application as it did not meet their loan policy.
            </div>
          )}

          {!is_dedupe && vendor_application_status === "idfc_0.5_accepted" && (
            <div>
              <div className="subtitle">
                Your profile has been successfully evaluated and basis the
                checks you're most likely to get a loan offer.
              </div>
              <div
                className="subtitle"
                style={{ color: "var(--primary)", fontSize: "14px" }}
              >
                <b>
                  To view the final loan amount, provide your income details.
                </b>
              </div>
            </div>
          )}

          {commonMapper.top_title === "Application Rejected" && (
            <div className="subtitle">
              We're so sorry to inform you that IDFC has rejected your loan
              application as it did not meet their loan policy.
            </div>
          )}

          {commonMapper.top_title === "System error" && (
            <div>
              <div className="subtitle">
                Oops! Something's not right. Please check back in some time.
              </div>
              <ContactUs />
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default LoanStatus;
