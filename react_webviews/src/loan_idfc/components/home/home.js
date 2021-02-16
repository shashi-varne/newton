import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";
import HowToSteps from "../../../common/ui/HowToSteps";
import PartnerCard from "./partner_card";
import { nativeCallback } from "utils/native_callback";
import Card from "../../../common/ui/Card";
import { getConfig } from "utils/functions";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "home_screen",
    };
    this.initialize = initialize.bind(this);
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
        title: "IDFC FIRST Bank",
        subtitle: "Competitve interest rate",
        loan_amount: " ₹40 lakhs",
        logo: "idfc_logo",
        provider_name: "idfc",
        cta_title: "RESUME",
      },
      dmi: {
        index: 1,
        title: "DMI Finance",
        subtitle: "Quick disbursal",
        loan_amount: "₹1 lac",
        logo: "dmi-finance",
        provider_name: "dmi",
        cta_title: "RESUME",
      },
    };

    this.setState(
      {
        stepContentMapper: stepContentMapper,
        partnerData: partnerData,
      },
      () => {
        this.onload();
      }
    );
  }

  onload = () => {};

  handleClick = () => {
    let { ongoing_loan_details, account_exists } = this.state;
    this.sendEvents("next");
    if (ongoing_loan_details.length === 0 && !account_exists) {
      this.navigate("edit-details");
    } else {
      this.navigate("select-loan");
    }
  };

  handleResume = (vendor) => {
    this.sendEvents("resume");
    this.navigate(`${vendor}/loan-know-more`);
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
    let {
      ongoing_loan_details,
      productName,
      account_exists,
      partnerData,
      stepContentMapper,
    } = this.state;
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        title="Loans"
        noFooter={true}
      >
        <div className="home">
          <div className="block1-info">
            {account_exists &&
            ongoing_loan_details &&
            ongoing_loan_details.length !== 0 ? (
              ongoing_loan_details.map((item, index) => {
                return (
                  <PartnerCard
                    key={index}
                    baseData={partnerData[item.vendor]}
                    handleClick={() => this.handleResume(item.vendor)}
                  />
                );
              })
            ) : (
              <img
                src={require(`assets/${productName}/icn_hero.svg`)}
                alt="info"
              />
            )}
          </div>

          {ongoing_loan_details && ongoing_loan_details.length !== 2 && (
            <div className="block2-info">
              <div className="top-title">
                {ongoing_loan_details && ongoing_loan_details.length !== 0
                  ? "Start a new application"
                  : "What are you looking for ?"}
              </div>
              <Card className="card-lending" onClick={() => this.handleClick()}>
                <div className="content">
                  <img
                    src={require(`assets/${productName}/loan_hand.svg`)}
                    alt="amount icon"
                  />
                  <div className="data">
                    <div className="title generic-page-title">
                      Personal loans
                      <img src={require(`assets/apply_now.svg`)} alt="" />
                    </div>
                    <div className="subtitle generic-page-subtitle">
                      Get loans upto ₹40 lakhs
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <HowToSteps
            style={{ marginTop: -10, marginBottom: 0 }}
            baseData={stepContentMapper}
          />

          <div
            className="block1-info"
            onClick={() => {
              this.sendEvents("calculator");
              this.props.history.push(
                {
                  pathname: `/loan/calculator`,
                  search: getConfig().searchParams,
                },
                {
                  cta_title: this.state.loan_amount_required
                    ? "RESUME"
                    : "APPLY NOW",
                }
              );
            }}
          >
            <img
              src={require(`assets/${productName}/calculatemi.svg`)}
              alt="calculator"
            />
          </div>

          <div className="block3-info">
            <div className="top-title">Our partners</div>
            <div className="partners">
              {/* <div className="partner-card"> */}
                <img src={require(`assets/idfc.svg`)} alt="idfc logo" />
              {/* </div> */}
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Home;
