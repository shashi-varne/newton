import React, { Component } from "react";
import Container from "../common/Container";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";
import { initialize } from "./functions";
import InvestCard from "./mini-components/InvestCard";
import SecureInvest from "./mini-components/SecureInvest";
import VerificationFailedDialog from "./mini-components/VerificationFailedDialog";
import KycStatusDialog from "./mini-components/KycStatusDialog";
import KycPremiumLandingDialog from "./mini-components/KycPremiumLandingDialog";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      partner: getConfig().partner,
      screenName: "invest_landing",
      invest_show_data: {},
      render_cards: [],
      verificationFailed: false,
      modalData: {},
      openKycStatusDialog: false,
      openKycPremiumLanding: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    this.initilizeKyc();
    this.setInvestCardsData();
  };

  addBank = () => {
    const userKyc = this.state.userKyc || {};
    this.navigate(`/kyc/${userKyc.kyc_status}/bank-details`);
  };

  updateDocument = () => {
    this.navigate("/kyc/add-bank");
  };

  closeVerificationFailed = () => {
    this.setState({ verificationFailed: false });
  };

  closeKycStatusDialog = () => {
    this.setState({ openKycStatusDialog: false });
  };

  closeKycPremiumLandingDialog = () => {
    this.setState({
      openKycPremiumLanding: false,
    });
  };

  handleKycPremiumLanding = () => {
    if (
      this.state.screenName === "invest_landing" &&
      this.state.bottom_sheet_dialog_data_premium.next_state === "/invest"
    ) {
      this.closeKycPremiumLandingDialog();
      return;
    }
    this.navigate(this.state.bottom_sheet_dialog_data_premium.next_state);
  };

  handleKycStatus = () => {
    let { kycJourneyStatus } = this.state;
    if (kycJourneyStatus === "submitted") {
      this.closeKycStatusDialog();
    } else if (kycJourneyStatus === "rejected") {
      this.navigate("/kyc/upload/progress", {
        state: {
          toState: "/invest",
        },
      });
    }
  };

  render() {
    let {
      isReadyToInvestBase,
      productName,
      invest_show_data,
      partner,
      render_cards,
      kycStatusData,
      verificationFailed,
      openKycStatusDialog,
      modalData,
      openKycPremiumLanding,
    } = this.state;
    let {
      our_recommendations,
      diy,
      bottom_scroll_cards,
      bottom_cards,
      popular_cards,
    } = invest_show_data;
    return (
      <Container
        skelton={this.state.show_loader}
        noFooter={true}
        title="Start Investing"
      >
        <div className="invest-landing">
          <div className="generic-page-subtitle">
            {isReadyToInvestBase
              ? " Your KYC is verified, You’re ready to invest"
              : "Invest in your future"}
          </div>
          {render_cards &&
            render_cards.map((element, index) => {
              switch (element) {
                case "kyc":
                  return (
                    <React.Fragment key={index}>
                      {!isReadyToInvestBase && kycStatusData && (
                        <div
                          className="kyc"
                          style={{
                            backgroundImage: `url(${require(`assets/${productName}/${kycStatusData.icon}`)})`,
                          }}
                          onClick={() =>
                            this.clickCard("kyc", kycStatusData.title)
                          }
                        >
                          <div className="title">{kycStatusData.title}</div>
                          <div className="subtitle">
                            {kycStatusData.subtitle}
                          </div>
                          <Button>{kycStatusData.button_text}</Button>
                        </div>
                      )}
                    </React.Fragment>
                  );
                case "our_recommendations":
                  return (
                    <React.Fragment key={index}>
                      {our_recommendations && (
                        <>
                          <div className="invest-main-top-title">
                            Our recommendations
                          </div>
                          {our_recommendations.map((item, index) => {
                            return (
                              <InvestCard
                                data={item}
                                key={index}
                                handleClick={() =>
                                  this.clickCard(item.key, item.title)
                                }
                              />
                            );
                          })}
                        </>
                      )}
                    </React.Fragment>
                  );
                case "diy":
                  return (
                    <React.Fragment key={index}>
                      {diy && (
                        <>
                          <div className="invest-main-top-title">Do it yourself</div>
                          {diy.map((item, index) => {
                            return (
                              <InvestCard
                                data={item}
                                key={index}
                                handleClick={() =>
                                  this.clickCard(item.key, item.title)
                                }
                              />
                            );
                          })}
                        </>
                      )}
                    </React.Fragment>
                  );
                case "bottom_scroll_cards":
                  return (
                    <div className="bottom-scroll-cards" key={index}>
                      <div className="list">
                        {bottom_scroll_cards &&
                          bottom_scroll_cards.map((item, index) => {
                            return (
                              <div
                                key={index}
                                className="card scroll-card"
                                onClick={() =>
                                  this.clickCard(item.key, item.title)
                                }
                              >
                                <div className="title">{item.title}</div>
                                <div className="icons">
                                  <img
                                    src={require(`assets/${productName}/${item.icon_line}`)}
                                    alt=""
                                  />
                                  <img
                                    src={require(`assets/${productName}/${item.icon}`)}
                                    alt=""
                                    className="icon"
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                case "bottom_cards":
                  return (
                    <React.Fragment key={index}>
                      {bottom_cards &&
                        bottom_cards.map((item, index) => {
                          return (
                            <InvestCard
                              data={item}
                              key={index}
                              handleClick={() =>
                                this.clickCard(item.key, item.title)
                              }
                            />
                          );
                        })}
                    </React.Fragment>
                  );
                case "financial_tools":
                  return (
                    <React.Fragment key={index}>
                      {partner.invest_screen_cards &&
                        partner.invest_screen_cards.risk_profile && (
                          <div className="invest-main-top-title">Financial tools</div>
                        )}
                      {partner.invest_screen_cards &&
                        (partner.invest_screen_cards.risk_profile ||
                          partner.invest_screen_cards.fhc) && (
                          <div className="bottom-scroll-cards">
                            <div className="list">
                              {partner.invest_screen_cards.fhc && (
                                <div
                                  className="card invest-card financial-card"
                                  onClick={() => this.clickCard("fhc")}
                                >
                                  <div className="content">
                                    <div className="title">
                                      Financial health check
                                    </div>
                                    <img
                                      src={require(`assets/${productName}/ic_fin_tools_fhc.svg`)}
                                      alt=""
                                      className="icon"
                                    />
                                  </div>
                                  <div className="subtitle">
                                    Get an expert financial advice
                                  </div>
                                  <Button>CHECK NOW</Button>
                                </div>
                              )}
                              {partner.invest_screen_cards.risk_profile && (
                                <div
                                  className="card invest-card financial-card"
                                  onClick={() => this.clickCard("risk_profile")}
                                >
                                  <div className="content">
                                    <div className="title">Risk profiler</div>
                                    <img
                                      src={require(`assets/${productName}/ic_fin_tools_risk.svg`)}
                                      alt=""
                                      className="icon"
                                    />
                                  </div>
                                  <div className="subtitle">
                                    Invest as per your risk appetite
                                  </div>
                                  <Button>START NOW</Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                    </React.Fragment>
                  );
                case "popular_cards":
                  return (
                    <React.Fragment key={index}>
                      {popular_cards && (
                        <>
                          <div className="invest-main-top-title">
                            More investment options
                          </div>
                          <div className="bottom-scroll-cards">
                            <div className="list">
                              {popular_cards.map((item, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="card popular"
                                    onClick={() =>
                                      this.clickCard(item.key, item.title)
                                    }
                                    style={{
                                      backgroundImage: `url(${require(`assets/${productName}/${item.icon}`)})`,
                                    }}
                                  >
                                    <div className="title">{item.title}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </React.Fragment>
                  );
                default:
                  return <></>;
              }
            })}
          <SecureInvest />
          {productName !== "fisdom" &&
            productName !== "finity" &&
            productName !== "ktb" && (
              <div className="invest-contact-us">
                In partnership with
                <span>
                  {productName === "bfdlmobile" ||
                  this.state.isIframe ||
                  this.state.finity
                    ? " Finity"
                    : " Fisdom"}
                </span>
              </div>
            )}
          <VerificationFailedDialog
            isOpen={verificationFailed}
            close={this.closeVerificationFailed}
            addBank={this.addBank}
            updateDocument={this.updateDocument}
          />
          {openKycStatusDialog && (
            <KycStatusDialog
              isOpen={openKycStatusDialog}
              data={modalData}
              close={this.closeKycStatusDialog}
              handleClick={this.handleKycStatus}
              cancel={this.closeKycStatusDialog}
            />
          )}
          {openKycPremiumLanding && (
            <KycPremiumLandingDialog
              isOpen={openKycPremiumLanding}
              close={this.closeKycPremiumLandingDialog}
              cancel={this.closeKycPremiumLandingDialog}
              handleClick={this.handleKycPremiumLanding}
              data={modalData}
            />
          )}
        </div>
      </Container>
    );
  }
}

export default Landing;
