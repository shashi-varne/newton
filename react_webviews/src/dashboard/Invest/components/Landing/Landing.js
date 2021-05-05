import React, { Component } from "react";
import Container from "../../../common/Container";
import { getConfig } from "utils/functions";
import Button from "common/ui/Button";
import { initialize, handleCampaignNotification, handleCampaignRedirection } from "../../functions";
import InvestCard from "../../mini-components/InvestCard";
import SecureInvest from "../../mini-components/SecureInvest";
import VerificationFailedDialog from "../../mini-components/VerificationFailedDialog";
import KycStatusDialog from "../../mini-components/KycStatusDialog";
import KycPremiumLandingDialog from "../../mini-components/KycPremiumLandingDialog";
import CampaignDialog from '../../mini-components/CampaignDialog';
import { storageService } from 'utils/validators';
import { SkeltonRect } from 'common/ui/Skelton';
import './Landing.scss';
import isEmpty from "lodash/isEmpty";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      kycStatusLoader: false,
      productName: getConfig().productName,
      screenName: "invest_landing",
      investCardsData: {},
      investSections: [],
      verificationFailed: false,
      modalData: {},
      openKycStatusDialog: false,
      openKycPremiumLanding: false,
      openBottomSheet: false,
      bottom_sheet_dialog_data: [],
      isWeb: getConfig().Web
    };
    this.initialize = initialize.bind(this);
    this.handleCampaignNotification = handleCampaignNotification.bind(this);
    this.handleCampaignRedirection = handleCampaignRedirection.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    this.initilizeKyc();
    const isBottomSheetDisplayed = storageService().get('is_bottom_sheet_displayed');
    if (!isBottomSheetDisplayed && this.state.isWeb) {
      this.handleCampaignNotification();
    }
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
          goBack: "/invest",
        },
      });
    }
  };

  closeCampaignDialog = () => {
    this.setState({ openBottomSheet: false });
  };

  handleCampaign = () => {
    this.setState({show_loader : 'page', openBottomSheet : false});
    let campLink = this.state.bottom_sheet_dialog_data.url;
    handleCampaignRedirection(campLink);
  }

  render() {
    const {
      isReadyToInvestBase,
      kycStatusLoader,
      productName,
      investCardsData,
      investSections,
      kycStatusData,
      verificationFailed,
      openKycStatusDialog,
      modalData,
      openKycPremiumLanding,
    } = this.state;
    const {
      ourRecommendations,
      diy,
      bottomScrollCards,
      bottomCards,
      popularCards,
      financialTools,
    } = investCardsData;
    return (
      <Container
        skelton={this.state.show_loader}
        noFooter={true}
        title="Start Investing"
        showLoader={this.state.show_loader}
        noBackIcon={true}
      >
        <div className="invest-landing">
          {
            !kycStatusLoader &&
            <div className="generic-page-subtitle">
              {isReadyToInvestBase 
                ? " Your KYC is verified, You’re ready to invest"
                : "Invest in your future"}
            </div>
          }
          {
            kycStatusLoader &&
            <SkeltonRect
              style={{
                width: '100%',
                height: '270px',
                marginBottom: "15px",
              }}
            />
          }
          {investSections &&
            investSections.map((element, index) => {
              switch (element) {
                case "kyc":
                  return (
                    <React.Fragment key={index}>
                      {!isReadyToInvestBase && kycStatusData && !kycStatusLoader && (
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
                          <Button
                            buttonTitle={kycStatusData.button_text}
                            classes={{
                              button: "invest-landing-button",
                            }}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                case "ourRecommendations":
                  return (
                    <React.Fragment key={index}>
                      {!isEmpty(ourRecommendations) && (
                        <>
                          <div className="invest-main-top-title">
                            Our recommendations
                          </div>
                          {ourRecommendations.map((item, index) => {
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
                      {!isEmpty(diy) && (
                        <>
                          <div className="invest-main-top-title">
                            Do it yourself
                          </div>
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
                case "bottomScrollCards":
                  return (
                    <div className="bottom-scroll-cards" key={index}>
                      <div className="list">
                        {!isEmpty(bottomScrollCards) &&
                          bottomScrollCards.map((item, index) => {
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
                case "bottomCards":
                  return (
                    <React.Fragment key={index}>
                      {!isEmpty(bottomCards) &&
                        bottomCards.map((item, index) => {
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
                case "financialTools":
                  return (
                    <React.Fragment key={index}>
                      {!isEmpty(financialTools) && (
                        <>
                          <div className="invest-main-top-title">
                            Financial tools
                          </div>
                          <div className="bottom-scroll-cards">
                            <div className="list">
                              {financialTools.map((data, index) => {
                                return (
                                  <div
                                    className="card invest-card financial-card"
                                    onClick={() => this.clickCard(data.key)}
                                    key={index}
                                  >
                                    <div className="content">
                                      <div className="title">{data.title}</div>
                                      <img
                                        src={require(`assets/${productName}/${data.icon}`)}
                                        alt=""
                                        className="icon"
                                      />
                                    </div>
                                    <div className="subtitle">
                                      {data.subtitle}
                                    </div>
                                    <Button
                                      buttonTitle={data.button_text}
                                      classes={{
                                        button: "invest-landing-button",
                                      }}
                                      type="outlined"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </React.Fragment>
                  );
                case "popularCards":
                  return (
                    <React.Fragment key={index}>
                      {!isEmpty(popularCards) && (
                        <>
                          <div className="invest-main-top-title">
                            More investment options
                          </div>
                          <div className="bottom-scroll-cards">
                            <div className="list">
                              {popularCards.map((item, index) => {
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
        <CampaignDialog
          isOpen={this.state.openBottomSheet}
          close={this.closeCampaignDialog}
          cancel={this.closeCampaignDialog}
          data={this.state.bottom_sheet_dialog_data}
          handleClick={this.handleCampaign}
        />
      </Container>
    );
  }
}

export default Landing;
