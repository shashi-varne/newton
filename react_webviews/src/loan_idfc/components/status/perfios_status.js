import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";
import { getUrlParams } from "utils/validators";
import { nativeCallback } from "utils/native_callback";
import ContactUs from "../../../common/components/contact_us";
import { Imgc } from "../../../common/ui/Imgc";

const commonMapper = {
  failure: {
    top_icon: "bank_failed",
    top_title: "Bank statement verification failed!",
    button_title: "RETRY",
    icon: "close",
    close_state: "/loan/idfc/loan-know-more",
    status: "verification failed 1",
  },
  success: {
    top_icon: "bank_verification_success",
    top_title: "Bank statement verification successful!",
    button_title: "CALCULATE ELIGIBILITY",
    icon: "close",
    close_state: "/loan/idfc/loan-know-more",
    status: "success",
  },
  blocked: {
    top_icon: "bank_failed",
    top_title: "Bank statement verification failed!",
    button_title: "OKAY",
    icon: "close",
    cta_state: "/loan/idfc/loan-know-more",
    close_state: "/loan/idfc/loan-know-more",
    status: "verification failed 2",
  },
  bypass: {
    top_icon: "bank_failed",
    top_title: "Bank statement verification failed!",
    button_title: "CALCULATE ELIGIBILITY",
    icon: "close",
    close_state: "/loan/idfc/loan-know-more",
    status: "verification failed 2",
  },
};

class PerfiosStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: 'g',
      params: getUrlParams(),
      screen_name: "perfios_state",
      commonMapper: {},
      perfios_state: "",
      count: 0,
      loaderWithData: false,
      loaderData: {},
      application_info: {}
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead || {};
    let vendor_info = lead.vendor_info || {};
    let application_info = lead.application_info || {};
    let personal_info = lead.personal_info || {};
    let name = personal_info.first_name;
    let perfios_state = vendor_info.perfios_state;
    let idfc_07_state = vendor_info.idfc_07_state;
    let perfios_info = lead.perfios_info;
    let perfios_display_rejection_reason =
      perfios_info.perfios_display_rejection_reason;
    let bt_eligible = vendor_info.bt_eligible;
    let mapper = {};

    let loaderData = {
      title: `Hang on while IDFC FIRST Bank calculates the eligible loan offer `,
      subtitle: "It usually takes around 2 minutes!",
    };

    mapper = commonMapper[perfios_state] || {}
    this.setState({
      commonMapper: mapper,
      application_info: application_info,
      perfios_display_rejection_reason: perfios_display_rejection_reason,
      perfios_state: perfios_state,
      bt_eligible: bt_eligible,
      idfc_07_state: idfc_07_state,
      name: name,
      loaderData: loaderData,
    });

    if (Object.keys(mapper).length === 0) {
      this.navigate('loan-know-more');
    }
  };

  goBack = () => {
    this.sendEvents("back");
    this.navigate(this.state.commonMapper.close_state);
  };

  sendEvents(user_action) {
    let { application_info, bt_eligible, perfios_state, commonMapper } = this.state;
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_bank_statement_verification",
      properties: {
        user_action: user_action,
        status: this.state.commonMapper.status,
        employment_type: application_info.application_status,
        cta_value:
          bt_eligible &&
          perfios_state !== "failure" &&
          perfios_state !== "blocked"
            ? "KNOW MORE"
            : commonMapper.button_title,
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    if (this.state.commonMapper.button_title === "RETRY")
      this.sendEvents("retry");
    else this.sendEvents("next");

    let { perfios_state, bt_eligible, idfc_07_state = "" } = this.state;

    this.setState({
      loaderWithData: !bt_eligible
    })
    
    if (perfios_state === "success") {
      if (idfc_07_state === "failed") {
        this.navigate("error");
      } else if (!bt_eligible && idfc_07_state === "success") {
        this.setState(
          {
            next_state: "eligible-loan",
          },
          () => {
            this.submitApplication({}, "one", "", "eligible-loan");
          }
        );
      }

      if (!bt_eligible && idfc_07_state === "triggered") {
        this.get07State();
      }

      if (!bt_eligible && !idfc_07_state) {
        this.get07State();
      }

      if (bt_eligible && idfc_07_state === "success") {
        let body = {
          idfc_loan_status: "bt_init",
        };
        this.updateApplication(body, "bt-info");
      }

      if (bt_eligible && idfc_07_state === "triggered") {
        let body = {
          idfc_loan_status: "bt_init",
        };
        this.updateApplication(body, "bt-info");
      }

      if (bt_eligible && !idfc_07_state) {
        this.get07StateForBt();
      }
    }

    if (perfios_state === "bypass") {
      if (bt_eligible) {
        let body = {
          idfc_loan_status: "bt_init",
        };
        this.updateApplication(body, "bt-info");
      } else {
        this.submitApplication({}, "one", "", "eligible-loan");
      }
    }

    if (perfios_state === "failure") {
      let body = {
        perfios_state: "init",
      };
      this.updateApplication(body, "income-details");
    }

    if (perfios_state === "blocked") {
      this.navigate(commonMapper["blocked"].cta_state);
    }
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
      perfios_state,
      bt_eligible,
      // name,
      perfios_display_rejection_reason,
    } = this.state;

    return (
      <Container
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        title={commonMapper.top_title}
        buttonTitle={
          bt_eligible &&
          perfios_state !== "failure" &&
          perfios_state !== "blocked"
            ? "KNOW MORE"
            : commonMapper.button_title
        }
        handleClick={this.handleClick}
        headerData={{
          icon: commonMapper.icon || "",
          goBack: this.goBack,
        }}
        hidePageTitle={this.state.skelton}
        loaderWithData={this.state.loaderWithData}
        loaderData={this.state.loaderData}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="idfc-loan-status">
          {commonMapper["top_icon"] && (
            <Imgc
              src={require(`assets/${this.state.productName}/${commonMapper["top_icon"]}.svg`)}
              alt=""
            />
          )}

          {perfios_state === "success" && (
            <div>
              {!bt_eligible && (
                <div className="sub-msg">
                  <div className="title">What next?</div>
                  <div className="sub-title">
                    IDFC FIRST Bank will now calculate the loan offer as per
                    their loan policy and you will instantly get to know the
                    eligible loan amount.
                  </div>
                </div>
              )}

              {bt_eligible &&
                perfios_state !== "failure" &&
                perfios_state !== "blocked" && (
                  <div className="sub-msg">
                    <div className="title">What next?</div>
                    <div className="sub-title">
                      As you’re a special customer, you’ve qualified for Balance
                      Transfer.
                    </div>
                    <div className="sub-title" style={{ marginTop: "10px" }}>
                      To learn more about this exclusive feature tap the button
                      below.
                    </div>
                  </div>
                )}
            </div>
          )}

          {perfios_state === "bypass" && (
            <div>
              <div className="subtitle">
                Due to an error your bank statements couldn't be verified. No
                worries, you can still go ahead with your loan application.
                However, do upload your bank statements later.
              </div>

              {!bt_eligible && (
                <div className="subtitle">
                  Now all you need to do is hit 'calculate eligibility' to view
                  your loan offer.
                </div>
              )}

              {bt_eligible && (
                <div className="sub-msg">
                  <div className="title">What next?</div>
                  <div className="sub-title">
                    As you’re a special customer, you’ve qualified for Balance
                    Transfer.
                  </div>
                  <div className="sub-title" style={{ marginTop: "10px" }}>
                    To learn more about this exclusive feature tap the button
                    below.
                  </div>
                </div>
              )}
            </div>
          )}

          {perfios_state === "blocked" && (
            <div className="subtitle">
              Due to an error, your bank statements couldn't be verified. No
              worries, our representative will soon get in touch with you to
              guide you further with your loan application.
            </div>
          )}

          {/* {bt_eligible &&
            perfios_state !== "failure" &&
            perfios_state !== "blocked" && (
              <div className="subtitle">
                Before we move to the final loan offer, we have an option of
                <b>'Balance Transfer - BT' for you</b>. However, it is up to you
                whether you want to opt for it or not.
              </div>
            )} */}

          {perfios_state === "failure" && !perfios_display_rejection_reason && (
            <div className="subtitle">
              Bank statement analysis failed due to some error. We recommend you
              to try again by uploading correct bank statements to proceed with
              the verification process.
            </div>
          )}

          {perfios_state === "failure" && perfios_display_rejection_reason && (
            <div className="subtitle">{perfios_display_rejection_reason}</div>
          )}

          {perfios_state === "processing" && (
            <div>
              <div className="subtitle">
                <b>Oops!</b> something's not right. We are checking this with
                IDFC FIRST Bank and will get back to you as soon as possible.
              </div>
              <ContactUs />
            </div>
          )}

          {/* {!perfios_state && (
            <div>
              <img
                src={require(`assets/${this.state.productName}/bank_failed.svg`)}
                className="center"
                alt=""
              />
              <div className="subtitle">
                Oops! Something's not right. Please check back in some time.
              </div>
              <ContactUs />
            </div>
          )} */}
        </div>
      </Container>
    );
  }
}

export default PerfiosStatus;
