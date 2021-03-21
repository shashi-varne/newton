import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import { getUrlParams } from "utils/validators";
import ContactUs from "../../../common/components/contact_us";
import toast from "../../../common/ui/Toast";
import { Imgc } from "../../../common/ui/Imgc";
import { getConfig } from "utils/functions";

const commonMapper = {
  idfc_null_failed: {
    top_icon: "error_illustration",
    top_title: "System error",
    button_title: "OKAY",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    failed: true,
    screenName: "idfc_system_error",
    stage: "after address details",
    hidePageTitle: false,
  },
  idfc_null_rejected: {
    top_icon: "not_eligible",
    top_title: "You’re not eligible for a loan!",
    button_title: "START A NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_application_rejected",
    stage: "after address details",
    hidePageTitle: true,
  },
  idfc_callback_rejected: {
    top_icon: "not_eligible",
    top_title: "You’re not eligible for a loan!",
    button_title: "START A NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_application_rejected",
    stage: "after loan requirement details",
    hidePageTitle: true,
  },
  "idfc_0.5_rejected": {
    top_icon: "not_eligible",
    top_title: "You’re not eligible for a loan!",
    button_title: "START A NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_application_rejected",
    stage: "after loan requirement details",
    hidePageTitle: true,
  },
  "idfc_1.0_rejected": {
    top_icon: "not_eligible",
    top_title: "You’re not eligible for a loan!",
    button_title: "START A NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_not_eligible",
    stage: "after loan requirement details",
    hidePageTitle: true,
  },
  "idfc_1.1_rejected": {
    top_icon: "not_eligible",
    top_title: "You’re not eligible for a loan!",
    button_title: "START A NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_not_eligible",
    stage: "after loan requirement details",
    hidePageTitle: true,
  },
  "idfc_1.7_rejected": {
    top_icon: "not_eligible",
    top_title: "You’re not eligible for a loan!",
    button_title: "START A NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_not_eligible",
    stage: "after loan requirement details",
    hidePageTitle: true,
  },
  "idfc_0.5_submitted": {
    top_icon: "loan_success",
    // top_title: "Congratulations,",
    button_title: "NEXT",
    cta_state: "/loan/idfc/income-details",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_profile_success",
    hidePageTitle: false,
  },
  "idfc_0.5_accepted": {
    top_icon: "loan_success",
    top_title: "Congratulations,",
    button_title: "NEXT",
    cta_state: "/loan/idfc/income-details",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_profile_success",
    hidePageTitle: false,
  },
  idfc_cancelled: {
    top_icon: "not_eligible",
    top_title: "You’re not eligible for a loan!",
    button_title: "START A NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_application_rejected",
    hidePageTitle: true,
  },
  "idfc_0.5_failed": {
    top_icon: "error_illustration",
    top_title: "System error",
    button_title: "OKAY",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_system_error",
    stage: "after loan requirement details",
    hidePageTitle: false,
  },
  "idfc_1.0_failed": {
    top_icon: "error_illustration",
    top_title: "System error",
    button_title: "OKAY",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_system_error",
    stage: "after credit card details",
    hidePageTitle: false,
  },
  "idfc_1.1_failed": {
    top_icon: "error_illustration",
    top_title: "System error",
    button_title: "OKAY",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_system_error",
    stage: "after loan offer",
    hidePageTitle: false,
  },
  "idfc_1.7_failed": {
    top_icon: "error_illustration",
    top_title: "System error",
    button_title: "OKAY",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_system_error",
    stage: "after additional details",
    hidePageTitle: false,
  },
  "Salary receipt mode": {
    top_icon: "not_eligible",
    top_title: "You’re not eligible!",
    button_title: "START A NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_application_rejected",
    stage: "after basic details",
    hidePageTitle: true,
  },
  Salary: {
    top_icon: "not_eligible",
    top_title: "You’re not eligible!",
    button_title: "START A NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_application_rejected",
    stage: "after basic details",
    hidePageTitle: true,
  },
  Age: {
    top_icon: "not_eligible",
    top_title: "You’re not eligible!",
    button_title: "START A NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_application_rejected",
    stage: "after basic details",
    hidePageTitle: true,
  },
  is_dedupe: {
    top_icon: "not_eligible",
    top_title: "You’re not eligible for a loan!",
    button_title: "START A NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_application_rejected",
    stage: "after loan requirement details",
    hidePageTitle: true,
  },
  pincode: {
    top_icon: "not_eligible",
    top_title: "You’re not eligible for a loan!",
    button_title: "START A NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_application_rejected",
    stage: "after loan requirement details",
    hidePageTitle: true,
  },
  internally_rejected: {
    top_icon: "not_eligible",
    top_title: "You’re not eligible for a loan!",
    button_title: "START A NEW APPLICATION",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    screenName: "idfc_application_rejected",
    stage: "after loan requirement details",
    hidePageTitle: true,
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
      first_name: "",
      skelton: 'g'
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
    let mapper = {};

    if (rejection_reason) {
      mapper = commonMapper[rejection_reason] || {};
      this.setState({
        commonMapper: mapper,
        application_status: application_status,
        rejection_reason: rejection_reason,
      });
    } else if (is_dedupe) {
      mapper = commonMapper["is_dedupe"] || {};
      this.setState({
        commonMapper: mapper,
        application_status: application_status,
      });
    } else if (idfc_rejection_reason === "pincode") {
      mapper = commonMapper["pincode"] || {};
      this.setState({
        commonMapper: mapper,
        application_status: application_status,
        idfc_rejection_reason: idfc_rejection_reason,
      });
    } else {
      mapper = commonMapper[vendor_application_status] || {};
      this.setState({
        commonMapper: mapper,
        vendor_application_status: vendor_application_status,
        first_name: first_name,
      });
    }

    if (Object.keys(mapper).length === 0) {
      this.navigate('error');
    }
  };

  sendEvents(user_action) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: this.state.commonMapper.screenName,
      properties: {
        user_action: user_action,
        event_name: this.state.commonMapper.screenName,
      },
    };
    if (this.state.commonMapper.screenName === "application_rejected") {
      eventObj.properties.rejection_reason = this.state.rejection_reason || "";
      eventObj.properties.stage = this.state.commonMapper.stage || "";
    } else if (this.state.commonMapper.screenName === "system_error") {
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
        show_loader: "button",
      });
      toast(
        "An email has been sent to your official email ID. Verify the same for faster loan sanction."
      );
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

    if (commonMapper.button_title === "START A NEW APPLICATION") {
      let params = {
        create_new: true,
        reset: true,
      };

      this.getOrCreate(params);
    } else if (vendor_application_status !== "idfc_0.5_accepted") {
      this.navigate(this.state.commonMapper.cta_state);
    }
  };

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.getUserStatus,
          title1: this.state.title1,
          button_text1: "Retry",
        },
        submit: {
          handleClick1: this.handleClick,
          button_text1: "Retry",
          title1: this.state.title1,
          handleClick2: () => {
            this.setState({
              showError: false,
            });
          },
          button_text2: "Dismiss",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  render() {
    let {
      commonMapper,
      vendor_application_status,
      rejection_reason,
      is_dedupe,
      first_name,
      idfc_rejection_reason,
    } = this.state;

    if (vendor_application_status === "idfc_0.5_accepted" || vendor_application_status === "idfc_0.5_submitted") {
      commonMapper.top_title = `Congratulations, ${first_name.trim(" ")}!`;
    }

    return (
      <Container
        showLoader={this.state.show_loader}
        title={commonMapper.top_title}
        buttonTitle={commonMapper.button_title}
        handleClick={this.handleClick}
        force_hide_inpage_title={commonMapper.hidePageTitle || this.state.skelton}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
        headerData={{
          icon: commonMapper.icon || "",
          goBack: this.goBack,
        }}
      >
        <div className="idfc-loan-status">
          {commonMapper["top_icon"] && (
            <Imgc
              src={require(`assets/${this.state.productName}/${commonMapper["top_icon"]}.svg`)}
              // className="center"
              style={{ width: "100%", height: `${!getConfig().isMobileDevice ? '400px' : ''}` }}
              alt=""
            />
          )}

          {commonMapper.hidePageTitle && (
            <div className="head-title">{commonMapper.top_title}</div>
          )}

          {rejection_reason === "Salary receipt mode" && (
            <div>
              <div className="subtitle">
                We’re sorry to inform you that IDFC FIRST BANK has rejected the
                loan request.
              </div>
              <div className="sub-msg">
                <div className="sub-title-2">
                  As per their loan criteria salary receipt mode is not
                  applicable.
                </div>
              </div>
              <div className="subtitle">
                However, we thank you for showing interest in our loan offer.
              </div>
            </div>
          )}

          {rejection_reason === "Salary" && (
            <div>
              <div className="subtitle">
                We’re sorry to inform you that IDFC FIRST BANK has rejected the
                loan request.
              </div>
              <div className="sub-msg">
                <div className="sub-title-2">
                  As per their loan criteria your monthly salary does not
                  qualify you for a personal loan.
                </div>
              </div>
              <div className="subtitle">
                However, we thank you for showing interest in our loan offer.
              </div>
            </div>
          )}

          {rejection_reason === "Age" && (
            <div>
              <div className="subtitle">
                We’re sorry to inform you that IDFC FIRST BANK has rejected the
                loan request.
              </div>
              <div className="sub-msg">
                <div className="sub-title-2">
                  You don't fall under the age category as set by the bank hence
                  the loan cannot be processed.
                </div>
              </div>
              <div className="subtitle">
                However, we thank you for showing interest in our loan offer.
              </div>
            </div>
          )}

          {commonMapper.top_title === "You’re not eligible for a loan!" &&
            idfc_rejection_reason !== "pincode" && (
            <div className="subtitle">
              IDFC FIRST Bank has rejected the loan application as it does not
              meet their loan policy.
              <br />
              <br />
              However, we thank you for showing interest in our loan offering.
            </div>
          )}

          {!is_dedupe &&
            (vendor_application_status === "idfc_0.5_accepted" ||
              vendor_application_status === "idfc_0.5_submitted") && (
              <div>
                <div className="subtitle">
                  Basis your profile you're most likely to get a loan offer.
                </div>
                <div className="sub-msg">
                  <div className="title">What next?</div>
                  <div className="sub-title">
                    Provide income details to view loan offer.
                  </div>
                </div>
              </div>
            )}

          {commonMapper.top_title === "You’re not eligible for a loan!" &&
            // !rejection_reason &&
            idfc_rejection_reason === "pincode" && (
              <div>
                <p className="subtitle">
                  Sorry! We don't serve in the selected location yet.
                </p>
                <p className="subtitle">
                  Thank you for expressing interest in availing a loan. Hope to
                  be of assistance in future.
                </p>
              </div>
            )}

          {commonMapper.top_title === "System error" && (
            <div>
              <div className="subtitle">
                Something is not right. We are checking this with
                IDFC FIRST Bank and will get back to you as soon as possible.
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
                Something is not right. We are checking this with
                IDFC FIRST Bank and will get back to you as soon as possible.
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
