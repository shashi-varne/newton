import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";
import HowToSteps from "../../../common/ui/HowToSteps";
import PartnerCard from "./partner_card";
import { nativeCallback } from "utils/native_callback";
import Card from "../../../common/ui/Card";
import { getConfig } from "utils/functions";
import { Imgc } from "../../../common/ui/Imgc";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "home_screen",
      skelton: "g",
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
          subtitle: "Easy paperwork with simple application process",
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
        subtitle: "Competitive interest rate",
        loan_amount: " ₹40 lakhs",
        logo: "idfc_logo",
        provider_name: "idfc",
        cta_title: "RESUME",
      },
      dmi: {
        index: 1,
        title: "DMI Finance",
        subtitle: "Quick disbursal",
        loan_amount: "₹1 lakh",
        logo: "dmi-finance",
        provider_name: "dmi",
        cta_title: "RESUME",
      },
    };

    this.setState(
      {
        partnerData: partnerData,
        stepContentMapper: stepContentMapper,
      },
      () => {
        this.onload();
      }
    );
  }

  onload = () => {
    this.setErrorData("onload");
    if (this.state.showError) {
      this.getSummary();
    }
  };

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.onload,
          button_text1: "Retry",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

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
      event_category: 'Lending IDFC',
      event_name: "lending_home_screen",
      properties: {
        user_action: user_action,
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
        // showLoader={this.state.show_loader}
        title="Loans"
        noFooter={true}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
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
                    otp_verified={item.otp_verified}
                    handleClick={() => this.handleResume(item.vendor)}
                  />
                );
              })
            ) : (
              <Imgc
                src={require(`assets/${productName}/icn_hero.svg`)}
                alt="info"
              />
            )}
          </div>

          {ongoing_loan_details && ongoing_loan_details.length !== 2 && (
            <div className="block2-info">
              <div className="top-title">
                {/* {ongoing_loan_details && ongoing_loan_details.length !== 0
                  ? "Start a new application"
                  : "What are you looking for ?"} */}
                Get started
              </div>
              <Card className="card-lending" onClick={() => this.handleClick()}>
                <div className="content">
                  <Imgc
                    src={require(`assets/${productName}/loan_hand.svg`)}
                    alt="amount icon"
                  />
                  <div className="data">
                    <div className="title generic-page-title">
                      Personal loans
                      {ongoing_loan_details.length === 0 && (
                        <Imgc src={require(`assets/apply_now.svg`)} alt="" />
                      )}
                    </div>
                    <div className="subtitle generic-page-subtitle">
                      Get loan up to ₹40 lakhs
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
            <Imgc
              src={require(`assets/${productName}/calculatemi.svg`)}
              alt="calculator"
            />
          </div>

          <div className="block3-info">
            <div className="top-title">Our partners</div>
            <div className="partners">
              <img src={require(`assets/idfc_logo.svg`)} alt="idfc logo" />
              <div className="partner-name">IDFC FIRST Bank</div>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Home;
