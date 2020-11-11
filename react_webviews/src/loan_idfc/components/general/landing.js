import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import HowToSteps from "../../../common/ui/HowToSteps";
import JourneySteps from "../../../common/ui/JourneySteps";
import SVG from "react-inlinesvg";
import { getConfig } from "utils/functions";
import next_arrow from 'assets/next_arrow.svg';

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

  onload = async () => {
    let screenData = this.state.screenData;

    this.setState({
      screenData: screenData,
    });
  };

  handleClick = () => {};

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
        title="Personal loan"
        buttonTitle={this.state.cta_title}
        handleClick={this.handleClick}
      >
        <div className="idfc-landing">
          <div className="loan-landing loan-instant-kyc-home">
            <img
              style={{ width: "100%", cursor: "pointer" }}
              src={require(`assets/${this.state.productName}/idfc_card.svg`)}
              alt=""
            />
          </div>

          <div style={{ margin: "40px 0 0px 0" }}>
            <div className="generic-hr"></div>
            <div className="Flex calculator" onClick={() => this.openFaqs()}>
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

          <HowToSteps
            style={{ marginTop: 20, marginBottom: 0 }}
            baseData={this.state.screenData.stepeContentMapper}
          />

          <JourneySteps
            static={true}
            baseData={this.state.screenData.journeyData}
          />

          <div style={{ margin: "40px 0 50px 0" }}>
            <div className="generic-hr"></div>
            <div className="Flex faq" onClick={() => this.openFaqs()}>
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
      </Container>
    );
  }
}

export default Landing;
