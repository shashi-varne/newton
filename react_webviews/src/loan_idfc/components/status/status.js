import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import { getUrlParams } from "utils/validators";
import ContactUs from "../../../common/components/contact_us";
import toast from "../../../common/ui/Toast";

const commonMapper = {
  idfc_null_failed: {
    top_icon: "error_illustration",
    top_title: "System error",
    button_title: "OK",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    failed: true,
    screenName: "system_error",
    stage: "after address details"
  },
  idfc_null_rejected: {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "application_rejected",
    stage: "after address details",
  },
  idfc_callback_rejected: {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "application_rejected",
    stage: "after loan requirement details",
  },
  "idfc_0.5_rejected": {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "application_rejected",
    stage: "after loan requirement details",
  },
  "idfc_1.0_rejected": {
    top_icon: "ils_loan_failed",
    // top_title: "Sorry",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "not_eligible",
    stage: "after loan requirement details",
  },
  "idfc_0.5_submitted": {
    top_icon: "ils_loan_status",
    // top_title: "Congratulations,",
    button_title: "NEXT",
    cta_state: "/loan/idfc/income-details",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "profile_success",
  },
  "idfc_0.5_accepted": {
    top_icon: "ils_loan_status",
    top_title: "Congratulations,",
    button_title: "NEXT",
    cta_state: "/loan/idfc/income-details",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "profile_success",
  },
  idfc_cancelled: {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "application_rejected",
  },
  "idfc_0.5_failed": {
    top_icon: "error_illustration",
    top_title: "System error",
    button_title: "OK",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "system_error",
    stage: "after loan requirement details",
  },
  "idfc_1.1_failed": {
    top_icon: "error_illustration",
    top_title: "System error",
    button_title: "OK",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "system_error",
    stage: "after loan offer",
  },
  "idfc_1.7_failed": {
    top_icon: "error_illustration",
    top_title: "System error",
    button_title: "OK",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "system_error",
    stage: "after additional details",
  },
  "Salary receipt mode": {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "application_rejected",
    stage: "after basic details",
  },
  Salary: {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "application_rejected",
    stage: "after basic details",
  },
  Age: {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "application_rejected",
    stage: "after basic details",
  },
  is_dedupe: {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "application_rejected",
    stage: "after loan requirement details",
  },
  "idfc_1.0_failed": {
    top_icon: "error_illustration",
    top_title: "System error",
    button_title: "OK",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "system_error",
    stage: "after credit card details",
  },
  "pincode": {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "application_rejected",
    stage: "after loan requirement details",
  },
  "internally_rejected": {
    top_icon: "ils_loan_failed",
    top_title: "Application Rejected",
    button_title: "START NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "application_rejected",
    stage: "after loan requirement details",
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
      first_name: ""
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let vendor_application_status = this.state.vendor_application_status;
    let application_status = this.state.application_status;
    let rejection_reason = this.state.rejection_reason;
    let first_name = this.state.first_name;
    let is_dedupe = this.state.is_dedupe;
    let idfc_rejection_reason = this.state.idfc_rejection_reason;

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
    }  else if (idfc_rejection_reason === 'pincode') {
      this.setState({
        commonMapper: commonMapper["pincode"] || {},
        application_status: application_status,
        idfc_rejection_reason: idfc_rejection_reason
      });
    } else {
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
        screen_name: this.state.commonMapper.screenName,
      },
    };
    if(this.state.commonMapper.screenName === 'application_rejected') {
      eventObj.properties.rejection_reason = this.state.rejection_reason || "";
      eventObj.properties.stage = this.state.commonMapper.stage || "";
    } else if(this.state.commonMapper.screenName === 'system_error') {
      eventObj.properties.stage = this.state.commonMapper.stage || "";
    }
    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  goBack = () => {
    this.sendEvents("back");
    this.navigate(this.state.commonMapper.close_state);
  };

  handleClick = () => {
    this.sendEvents("next");
    let { commonMapper, vendor_application_status, is_dedupe } = this.state;
    if (!is_dedupe && vendor_application_status === "idfc_0.5_accepted") {
      this.setState({
        show_loader: true
      })
      toast('A mail has been sent to your official mail ID. Verify the same for faster loan sanction.')
      let body = {
        perfios_state: "init",
        idfc_loan_status: "perfios",
      };

      setTimeout(updateFunc, 3000);

      let that = this;
      function updateFunc() {
        that.updateApplication(body, "income-details");
      }
    }

    if (commonMapper.button_title === "START NEW APPLICATION") {
      let params = {
        create_new: true,
        reset: true,
      };

      this.getOrCreate(params);
    } else if (vendor_application_status !== "idfc_0.5_accepted") {
      this.navigate(this.state.commonMapper.cta_state);
    }
  };

  render() {
    let {
      commonMapper,
      vendor_application_status,
      rejection_reason,
      is_dedupe,
      first_name,
      idfc_rejection_reason
    } = this.state;

    if (vendor_application_status === "idfc_0.5_accepted") {
      commonMapper.top_title = `Congratulations, ${first_name.trim(" ")}!`;
    }

    if (vendor_application_status === "idfc_10_rejected") {
      commonMapper.top_title = `Sorry ${first_name}, you’re not eligible for a loan at this point.`;
    }

    return (
      <Container
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
              We're so sorry to inform you that IDFC FIRST Bank has rejected your loan
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

          {commonMapper.top_title === "Application Rejected" && !rejection_reason && idfc_rejection_reason !== 'pincode' && (
            <div className="subtitle">
              We're so sorry to inform you that IDFC FIRST Bank has rejected your loan
              application as it did not meet their loan policy.
            </div>
          )}

          {commonMapper.top_title === "Application Rejected" && !rejection_reason && idfc_rejection_reason === 'pincode' && (
            <div>
              <p className="subtitle">Sorry! We don't serve in the selected location yet.</p>
              <p className="subtitle">
                Thank you for expressing interest in availing a loan. Hope to be of assistance in future.
              </p>
          </div>
          )}

          {commonMapper.top_title === "System error" && (
            <div>
              <div className="subtitle">
                Oops! something's not right. We are checking this with IDFC FIRST Bank and will get back to you as soon as possible.
              </div>
              <ContactUs />
            </div>
          )}

          {!commonMapper.top_title === "System error" && (
            <div>
              <img
                src={require(`assets/${this.state.productName}/ils_loan_failed.svg`)}
                className="center"
                alt=""
              />
              <div className="subtitle">
                Oops! something's not right. We are checking this with IDFC FIRST Bank and will get back to you as soon as possible.
              </div>
              <ContactUs />
            </div>
          )}

          {vendor_application_status === "idfc_10_rejected" && (
            <div>
              <div className='subtitle'>
                Your loan application did not meet IDFC FIRST Bank’s loan policy. Hence we will not be able to take this forward.<br />
                However, we thank you for showing interest in our loan offering.<br /><br />
                We hope to be of assistance in future.
              </div>
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default LoanStatus;
