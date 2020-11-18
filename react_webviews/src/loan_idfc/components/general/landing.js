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
import { getUserStatus, getOrCreate } from "../../common/ApiCalls";
import toast from '../../../common/ui/Toast';

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
    try {
      this.setState({
        show_loader: true
      })

      const res = await getUserStatus();
      
      this.setState({
        application_exist: res.application_exists,
        otp_verified: res.otp_verified,
        cta_title: res.application_exists && res.otp_verified ? 'RESUME' : 'APPLY NOW'
      })

    } catch (err) {
      console.log(err);
      toast('Something went wrong!')
    }

    this.setState({
      show_loader: false
    })
  };

  handleClick = async () => {
    try {
      this.setState({
        show_loader: true
      })

      let params = {
        create_new: this.state.application_exist ? false : true
      }

      await getOrCreate({params});
      
      if (!this.state.otp_verified) {
        this.navigate(this.state.next_state)
      }

    } catch (err) {
      console.log(err);
      toast('Something went wrong!')
    }

    this.setState({
      show_loader: false
    })
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
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Personal loan"
        buttonTitle={this.state.cta_title}
        handleClick={this.handleClick}
      >
        <div className="idfc-landing">
          <div
            className="infoimage-block1"
            onClick={() => this.navigate('know-more')}
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
                Get a personal loan up to ₹40 lacs!
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
            baseData={this.state.screenData.stepeContentMapper}
          />

          <JourneySteps
            static={true}
            baseData={this.state.screenData.journeyData}
          />

          <div style={{ margin: "40px 0 0px 0" }}>
            <div className="generic-hr"></div>
            <div className="Flex calculator" onClick={() => this.navigate('calculator')}>
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
