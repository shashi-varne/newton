import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize, getSummary } from "../../common/functions";
import HowToSteps from "../../../common/ui/HowToSteps";
import PartnerCard from "./partner_card";
import { nativeCallback } from "utils/native_callback";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "home_screen",
      displayImage: true,
    };
    this.initialize = initialize.bind(this);
    // this.getSummary = getSummary.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let stepContentMapper = {
      title: "Why choose us?",
      options: [
        {
          icon: "b1",
          title: "Instant approvals",
          subtitle: "Digital KYC and instant approval",
        },
        {
          icon: "b2",
          title: "Minimal documentation",
          subtitle: "Hassle free paperwork with easy application process",
        },
        {
          icon: "b3",
          title: "Built-in security",
          subtitle: "Financial information safe and secure 24/7",
        },
        {
          icon: "b4",
          title: "Best EMI plans",
          subtitle: "Choose your plans as per your comfort",
        },
      ],
    };

    let partnerData = {
      idfc: {
        index: 0,
        title: "IDFC FIRST BANK",
        subtitle: "Quick disbursal",
        loan_amount: " ₹40 lac",
        logo: "idfc_logo",
        cta_title: "RESUME",
      },
      dmi: {
        index: 1,
        title: "DMI Finance",
        subtitle: "Quick money transfer",
        loan_amount: "₹1 lac",
        logo: "dmi-finance",
        cta_title: "RESUME",
      },
    };

    this.setState({
      stepContentMapper: stepContentMapper,
      partnerData: partnerData,
    });
  }

  handleImage = () => {
    this.setState({ displayImage: !this.state.displayImage });
  };

  handleClick = () => {
    let { account_exists, loan_exists } = this.state;
    if (account_exists && loan_exists !== 0) {
      this.sendEvents("resume");
      this.navigate("loan-know-more");
    } else {
      this.sendEvents("next");
      this.navigate(this.state.next_state);
    }
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "lending",
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

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        title="Loans"
        noFooter={true}
      >
        <div className="loan-home">
          <div className="block1-info">
            {this.state.account_exists && this.state.loan_exists !== 0 ? (
              <PartnerCard
              baseData={this.state.partnerData[this.state.ongoing_loan_details[0].vendor]}
              handleClick={this.handleClick}
            />
             ) : (
              <img
                src={require(`assets/${this.state.productName}/icn_hero.svg`)}
                alt="info"
              />
            )} 
          </div>

          <div className="block2-info" onClick={() => this.handleClick()}>
            <div className="top-title">{this.state.loan_exists !== 0 ? 'Start a new application' : 'What are you looking for ?'}</div>
            <div className="content">
              <img
                src={require(`assets/${this.state.productName}/icn_loan_amnt.svg`)}
                alt="amount icon"
              />
              <div className="data">
                <div className="title generic-page-title">Personal loans</div>
                <div className="subtitle generic-page-subtitle">
                  Get loans upto ₹40 lac
                </div>
              </div>
            </div>
          </div>

          <HowToSteps
            style={{ marginTop: 20, marginBottom: 0 }}
            baseData={this.state.stepContentMapper}
          />

          <div
            className="block1-info"
            onClick={() => {
              this.sendEvents("calculator");
              this.navigate("calculator");
            }}
          >
            <img
              src={require(`assets/${this.state.productName}/calculatemi.svg`)}
              alt="calculator"
            />
          </div>

          <div className="block3-info">
            <div className="top-title">Our partners</div>
            <div className="partners">
              <div>
                <div className="card">
                  <img src={require(`assets/idfc_logo.svg`)} alt="idfc logo" />
                </div>
                IDFC First Bank
              </div>
              <div>
                <div className="card">
                  <img src={require(`assets/dmi-finance.svg`)} alt="dmi logo" />
                </div>
                DMI finance
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Home;
