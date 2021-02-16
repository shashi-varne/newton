import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import HowToSteps from "../../../common/ui/HowToSteps";
import JourneySteps from "../../../common/ui/JourneySteps";
import SVG from "react-inlinesvg";
import { getConfig } from "utils/functions";
import next_arrow from "assets/next_arrow.svg";
import Button from "material-ui/Button";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      resume_clicked: false,
      faq_clicked: false,
      cta_title: "APPLY NOW",
      screen_name: "landing_screen",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    this.setState({
      cta_title:
        this.state.application_exists && this.state.otp_verified
          ? "RESUME"
          : "APPLY NOW",
      next_state:
        this.state.application_exists && this.state.otp_verified
          ? "journey"
          : "edit-number",
    });
  };

  handleClick = () => {
    let user_action = this.state.cta_title === "APPLY NOW" ? 'next' : 'resume';
    this.sendEvents(user_action)
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
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "home_screen",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  openFaqs = () => {
    this.sendEvents('faq')
    let renderData = {
      'header_title': this.state.screenData.faqsInfo.header_title,
      'header_subtitle': '',
      'steps': {
        'options': this.state.screenData.faqsInfo.faqs
      },
      'cta_title': this.state.screenData.faqsInfo.cta_title,
    }

    this.props.history.push({
      pathname: '/loan/idfc/faq',
      search: getConfig().searchParams,
      params: {
        renderData: renderData
      }
    });
  }

  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Personal loan"
        buttonTitle={this.state.cta_title}
        handleClick={this.handleClick}
      >
        <div className="idfc-landing">
          <div
            className="infoimage-block1"
            onClick={() =>
              {this.sendEvents('know-more'); 
                this.navigate("know-more", {
                params: {
                  next_state: this.state.next_state,
                  cta_title: this.state.cta_title,
                },
              })}
            }
          >
            <img
              src={require(`assets/${this.state.productName}/idfc_card.svg`)}
              alt=""
            />
            <div className="inner">
              <div
                className="title generic-page-title"
                style={{ color: "white" }}
              >
                Get a personal loan up to ₹40 lakhs!
              </div>
              <div className="button">
                <Button
                  variant="raised"
                  size="large"
                  color="secondary"
                  autoFocus
                >
                  KNOW MORE
                </Button>
              </div>
              <div className="bottom-content">
                100% digital | Minimal documentation
              </div>
            </div>
          </div>

          <HowToSteps
            style={{ marginTop: 20, marginBottom: 0 }}
            baseData={this.state.screenData.stepContentMapper}
          />

          <JourneySteps
            static={true}
            baseData={this.state.screenData.journeyData}
          />

          <div style={{ margin: "40px 0 0px 0" }}>
            <div className="generic-hr"></div>
            <div
              className="Flex calculator"
              onClick={() =>
                {this.sendEvents('calculator'); 
                this.navigate("calculator", {
                  params: {
                    next_state: this.state.next_state,
                    cta_title: this.state.cta_title,
                  },
                })}
              }
            >
              <div className="title">Loan eligibility calculator</div>
              <SVG
                className="right"
                preProcessor={(code) =>
                  code.replace(/fill=".*?"/g, "fill=" + getConfig().primary)
                }
                src={next_arrow}
              />
            </div>
            <div className="generic-hr"></div>
          </div>

          <div style={{ margin: "40px 0 50px 0" }}>
            <div className="generic-hr"></div>
            <div
              className="Flex faq"
              onClick={() => this.openFaqs() }
            >
              <div>
                <img
                  className="accident-plan-read-icon"
                  src={require(`assets/${this.state.productName}/ic_document_copy.svg`)}
                  alt=""
                />
              </div>
              <div className="title">Frequently asked questions</div>
            </div>
            <div className="generic-hr"></div>
          </div>
        </div>
      </Container >
    );
  }
}

export default Landing;
