import React, { Component } from "react";
import Container from "../../../common/Container";
import Button from "common/ui/Button";
import { initialize, handleCampaignNotification } from "../../functions";
import InvestCard from "../../mini-components/InvestCard";
import SebiRegistrationFooter from "../../../../common/ui/SebiRegistrationFooter/WVSebiRegistrationFooter";
import VerificationFailedDialog from "../../mini-components/VerificationFailedDialog";
import KycStatusDialog from "../../mini-components/KycStatusDialog";
import KycPremiumLandingDialog from "../../mini-components/KycPremiumLandingDialog";
import CampaignDialog from '../../mini-components/CampaignDialog';
import { storageService } from 'utils/validators';
import { SkeltonRect } from 'common/ui/Skelton';
import './Landing.scss';
import isEmpty from "lodash/isEmpty";
import VerifyDetailDialog from "../../../../login_and_registration/components/VerifyDetailDialog";
import AccountAlreadyExistDialog from "../../../../login_and_registration/components/AccountAlreadyExistDialog";
import { generateOtp } from "../../../../login_and_registration/functions";
import { Imgc } from "../../../../common/ui/Imgc";
import { nativeCallback } from "../../../../utils/native_callback";
import { getConfig, isTradingEnabled } from "../../../../utils/functions";
import { PATHNAME_MAPPER } from "../../../../kyc/constants";
import toast from "../../../../common/ui/Toast"

const fromLoginStates = ["/login", "/logout", "/verify-otp"]
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
      verifyDetails: false,
      verifyDetailsType: '',
      verifyDetailsData: {},
      accountAlreadyExists: false,
      accountAlreadyExistsData : {},
      openBottomSheet: false,
      bottom_sheet_dialog_data: [],
      isWeb: getConfig().Web,
      stateParams: props.location.state || {},
      tradingEnabled: isTradingEnabled(),
    };
    this.initialize = initialize.bind(this);
    this.generateOtp = generateOtp.bind(this);
    this.handleCampaignNotification = handleCampaignNotification.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  sendEventsIndexFunds = (userAction, card_name) => {
    let eventObj = {
      event_name: "home_screen",
      properties: {
        user_action: userAction,
        card_clicked: card_name,
        screen_name: "home_screen",
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  onload = async () => {
    await this.initilizeKyc();
    const isBottomSheetDisplayed = storageService().get(
      "is_bottom_sheet_displayed"
    );
    const { isWeb, verifyDetails, openKycPremiumLanding, openKycStatusDialog } = this.state;
    if (!isBottomSheetDisplayed && isWeb && !verifyDetails && !openKycPremiumLanding && !openKycStatusDialog) {
      this.handleCampaignNotification();
    }
  };

  addBank = () => {
    const userKyc = this.state.userKyc || {};
    this.navigate(`/kyc/${userKyc.kyc_status}/bank-details`, {
      state: { goBack: "/invest" }
    });
  };

  updateDocument = () => {
    this.navigate("/kyc/add-bank");
  };

  closeVerificationFailed = () => {
    this.setState({ verificationFailed: false });
  };

  closeKycStatusDialog = () => {
    this.sendEvents("dismiss", "kyc_bottom_sheet");
    this.setState({ openKycStatusDialog: false });
  };

  closeKycPremiumLandingDialog = () => {
    this.setState({
      openKycPremiumLanding: false,
    });
  };

  // email mobile verification
  closeVerifyDetailsDialog = () => {
    this.sendEvents("back", "bottomsheet");
    this.setState({
      verifyDetails: false
    })
  }

  closeAccountAlreadyExistDialog = () => {
    this.sendEvents("back", "continuebottomsheet");
    this.setState({
      accountAlreadyExists: false
    })
  }

  setAccountAlreadyExistsData = (show, data) => {
    this.setState({
      accountAlreadyExists: show,
      accountAlreadyExistsData: data,
      verifyDetails: false,
      contact_type: data?.data?.contact_type,
      contact_value: data?.data?.contact_value,
    })
  }

  continueAccountAlreadyExists = async (type, data) => {
    this.sendEvents("next", "continuebottomsheet");
    let body = {};
    if (type === "email") {
      body.email = data?.data?.contact_value;
    } else {
      body.mobile = data?.data?.contact_value
      body.whatsapp_consent = true;
    }
    const otpResponse = await this.generateOtp(body);
    if (otpResponse) {
      let result = otpResponse.pfwresponse.result;
      toast(result.message || "Success");
      this.navigate("secondary-otp-verification", {
        state: {
          value:  data?.data?.contact_value,
          otp_id: otpResponse.pfwresponse.result.otp_id,
          communicationType: type,
        },
      });
    }
  };

  editDetailsAccountAlreadyExists = () => {
    this.sendEvents("edit", "continuebottomsheet");
    this.navigate("/secondary-verification", {
      state: {
        page: "landing",
        edit: true,
        communicationType: this.state.contact_type,
        contactValue: this.state.contact_value,
      },
    });
  };


  handleKycPremiumLanding = () => {
    if (
      this.state.screenName === "invest_landing" &&
      this.state.bottom_sheet_dialog_data_premium.nextState === "/invest"
    ) {
      this.closeKycPremiumLandingDialog();
      return;
    }
    this.navigate(this.state.bottom_sheet_dialog_data_premium.nextState);
  };

  handleKycStatus = async () => {
    this.sendEvents("next", "kyc_bottom_sheet");
    let { kycJourneyStatus, modalData, tradingEnabled, userKyc } = this.state;
    if (["submitted", "verifying_trading_account"].includes(kycJourneyStatus) || (kycJourneyStatus === "complete" && userKyc.mf_kyc_processed)) {
      this.closeKycStatusDialog();
    } else if (kycJourneyStatus === "rejected") {
      this.navigate(PATHNAME_MAPPER.uploadProgress);
    } else if ((tradingEnabled && userKyc?.kyc_product_type !== "equity")) {
      this.closeKycStatusDialog();
      await this.setKycProductTypeAndRedirect();
    } else if (kycJourneyStatus === "ground_pan") {
      this.navigate("/kyc/journey", {
        state: {
          show_aadhaar: !(userKyc.address.meta_data.is_nri || userKyc.kyc_type === "manual"),
        },
      });
    } else if (modalData.nextState && modalData.nextState !== "/invest") {
      this.navigate(modalData.nextState);
    } else {
      this.closeKycStatusDialog();
    }
  };

  handleStocksAndIpoRedirection = () => {
    let { modalData, communicationType, contactValue, kycJourneyStatus, config } = this.state;
    if (modalData.key === "kyc") {
      if (kycJourneyStatus === "fno_rejected") {
        this.closeKycStatusDialog();
      }
    } else if (modalData.key === "ipo") {
      if (!!this.state.contactNotVerified) {
        storageService().set("ipoContactNotVerified", true);
        this.navigate("/secondary-verification", {
          state : {
            communicationType,
            contactValue,
          }
        })
        return;
      } // Email/mobile if Not Verified!
      this.handleIpoCardRedirection();
    } else {
      if (kycJourneyStatus === "fno_rejected") {
        this.setState({ showPageLoader: "page" });
        window.location.href = `${config.base_url}/page/equity/launchapp`;
      }
      this.closeKycStatusDialog();
    }
  }

  sendEvents = (userAction, cardClick = "") => {
    if(cardClick === "ipo") {
      cardClick = "ipo_gold";
    }
    if (cardClick === "bottomsheet" || cardClick === "continuebottomsheet") {
      let screen_name = cardClick === "continuebottomsheet" ? "account_already_exists" :
        this.state.verifyDetailsType === "email" ? "verify_email" : "verify_mobile";
      let eventObj = {
        "event_name": 'verification_bottom_sheet',
        "properties": {
          "screen_name": screen_name,
          "user_action": userAction,
        },
      };
      if (userAction === "just_set_events") {
        return eventObj;
      } else {
        nativeCallback({
          events: eventObj
        });
      }
      return
    }
    let eventObj = {
      event_name: "landing_page",
      properties: {
        action: userAction,
        screen_name: "invest home",
        primary_category: "primary navigation",
        card_click: cardClick,
        channel: getConfig().code,
        user_investment_status: this.state.currentUser?.active_investment,
        kyc_status: this.state.kycJourneyStatus
      },
    };
    if (cardClick === "kyc_bottom_sheet") {
      eventObj.event_name = "bottom_sheet";
      eventObj.properties.intent = "kyc status";
      eventObj.properties.option_clicked = userAction;
    }
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  render() {
    const {
      isReadyToInvestBase,
      isEquityCompletedBase,
      kycStatusLoader,
      productName,
      investCardsData,
      investSections,
      kycStatusData,
      verificationFailed,
      openKycStatusDialog,
      modalData,
      openKycPremiumLanding,
      verifyDetails,
      accountAlreadyExists,
      stateParams,
      tradingEnabled,
      kycButtonLoader,
      stocksButtonLoader,
      kycJourneyStatus
    } = this.state;
    const {
      indexFunds,
      ourRecommendations,
      diy,
      bottomScrollCards,
      bottomCards,
      popularCards,
      financialTools,
      stocksAndIpo
    } = investCardsData;
    const config = getConfig();
    return (
      <Container
        skelton={this.state.show_loader}
        noFooter={true}
        title="Start Investing"
        data-aid='start-investing-screen'
        showLoader={this.state.showPageLoader}
        noBackIcon={!config.isSdk || config.isIframe}
        background={
          config.isMobileDevice &&
          fromLoginStates.includes(stateParams.fromState) &&
          "invest-landing-background"
        }
        classHeader={
          config.isMobileDevice &&
          fromLoginStates.includes(stateParams.fromState) &&
          (this.state.headerStyle
            ? "invest-landing-partner-header"
            : "invest-landing-header")
        }
        headerData={{
          partnerLogo: !config.isSdk && config.isMobileDevice
        }}
        events={this.sendEvents("just_set_events")}
      >
        <div className="invest-landing" data-aid='invest-landing'>
          {
            !kycStatusLoader &&
            <div className="generic-page-subtitle" data-aid='generic-page-subtitle'>
              {((!tradingEnabled && isReadyToInvestBase) ||
-                (tradingEnabled && isEquityCompletedBase)) 
                ? " Your KYC is verified, You’re ready to invest"
                : "Invest in your future"}
            </div>
          }
          {
            kycStatusLoader &&
            <SkeltonRect
              style={{
                width: '100%',
                height: '85px',
                marginBottom: "15px",
              }}
            />
          }
          {investSections &&
            investSections.map((element, idx) => {
              switch (element) {
                case "kyc":
                  return (
                    <React.Fragment key={idx}>
                      {(!kycStatusLoader && kycStatusData && ((!tradingEnabled && !isReadyToInvestBase) ||
-                      (tradingEnabled && (!isEquityCompletedBase || (isEquityCompletedBase && kycJourneyStatus === "fno_rejected"))))) ? (
                        <div
                          data-aid='kyc-invest-sections-cards'
                          className="kyc"
                          onClick={() =>
                            !kycButtonLoader && !stocksButtonLoader && this.clickCard("kyc", kycStatusData.title)
                          }
                        >
                          <div className="kyc-card-text">
                            <div className="title">{kycStatusData.title}</div>
                            <div className={`subtitle ${kycStatusData.subTitleClass}`}>
                              {kycStatusData.addPoint ? 
                                <span className="point" style={kycStatusData.subtitleColor ? { backgroundColor: kycStatusData.subtitleColor } : {}}>{''}</span> 
                                : null
                              }
                              <span>{kycStatusData.subtitle}</span>
                            </div>
                          </div>
                          <Imgc
                            className="kyc-card-image"
                            src={require(`assets/${productName}/${kycStatusData.icon}`)}
                            alt=""
                          />
                        </div>
                      ): null}
                    </React.Fragment>
                  );
                case "indexFunds":
                  return (
                    <React.Fragment key={idx}>
                      {!isEmpty(indexFunds) &&
                        indexFunds.map((item, index) => {
                          return (
                            <InvestCard
                              data={item}
                              key={index}
                              handleClick={() =>
                                {
                                  this.clickCard(item.key, item.title)
                                  this.sendEventsIndexFunds("next", "explore_passive_funds")
                                }
                              }
                            />
                          );
                        })}
                    </React.Fragment>
                  );
                case "ourRecommendations":
                  return (
                    <React.Fragment key={idx}>
                      {!isEmpty(ourRecommendations) && (
                        <>
                          <div className="invest-main-top-title" data-aid='recommendations-title'>
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
                case "stocksAndIpo":
                  return (
                    <React.Fragment key={idx}>
                      {!isEmpty(stocksAndIpo) && tradingEnabled && (
                        <>
                          <div className="invest-main-top-title" data-aid='recommendations-title'>
                            Stocks & IPOs
                          </div>
                          {stocksAndIpo.map((item, index) => {
                            if (kycStatusLoader) {
                              return (
                                <SkeltonRect
                                  style={{
                                    width: '100%',
                                    height: '170px',
                                    marginBottom: "15px",
                                  }}
                                  key={index}
                                />
                              )
                            } else {
                              return (
                                <InvestCard
                                  data={item}
                                  key={index}
                                  handleClick={() =>
                                    this.clickCard(item.key, item.key)
                                  }
                                />
                              );
                            }
                          })}
                        </>
                      )}
                    </React.Fragment>
                  );
                case "diy":
                  return (
                    <React.Fragment key={idx}>
                      {!isEmpty(diy) && (
                        <>
                          <div className="invest-main-top-title" data-aid='diy-title'>
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
                    <div className="bottom-scroll-cards" key={idx} data-aid='bottomScrollCards-title'>
                      <div className="list" data-aid='bottomScrollCards-list'>
                        {!isEmpty(bottomScrollCards) &&
                          bottomScrollCards.map((item, index) => {
                            return (
                              <div
                                data-aid={item.key}
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
                                  <Imgc
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
                    <React.Fragment key={idx}>
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
                    <React.Fragment key={idx}>
                      {!isEmpty(financialTools) && (
                        <>
                          <div className="invest-main-top-title" data-aid='financial-tools-title'>
                            Financial tools
                          </div>
                          <div className="bottom-scroll-cards">
                            <div className="list" data-aid='financial-tools-list'>
                              {financialTools.map((data, index) => {
                                return (
                                  <div
                                    data-aid={`financial-tool-${data.key}`}
                                    className="card invest-card financial-card"
                                    onClick={() => this.clickCard(data.key)}
                                    key={index}
                                  >
                                    <div className="content">
                                      <div className="title"  data-aid={`financial-tool-title-${data.key}`}>{data.title}</div>
                                      <Imgc
                                        src={require(`assets/${productName}/${data.icon}`)}
                                        alt=""
                                        className="ft-icon"
                                      />
                                    </div>
                                    <div className="subtitle" data-aid={`financial-tool-subtitle-${data.key}`}>
                                      {data.subtitle}
                                    </div>
                                    <Button
                                      dataAid='financial-tool-btn'
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
                    <React.Fragment key={idx}>
                      {!isEmpty(popularCards) && (
                        <>
                          <div className="invest-main-top-title" data-aid='popularCards-tools-title'>
                            More investment options
                          </div>
                          <div className="bottom-scroll-cards">
                            <div className="list" data-aid='popularCards-tools-list'>
                              {popularCards.map((item, index) => {
                                return (
                                  <div
                                    data-aid={`popular-cards-${item.key}`}
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
                  return <React.Fragment key={idx}></React.Fragment>;
              }
            })}
          <SebiRegistrationFooter className="invest-sebi-registration-disclaimer" />
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
              handleClick2={this.handleStocksAndIpoRedirection}
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
          {verifyDetails && (
            <VerifyDetailDialog
              type={this.state.verifyDetailsType}
              data={this.state.verifyDetailsData}
              showAccountAlreadyExist={this.setAccountAlreadyExistsData}
              isOpen={verifyDetails}
              onClose={this.closeVerifyDetailsDialog}
              parent={this}
            ></VerifyDetailDialog>
          )}
        {accountAlreadyExists && (
          <AccountAlreadyExistDialog
            type={this.state.verifyDetailsType}
            data={this.state.accountAlreadyExistsData}
            isOpen={accountAlreadyExists}
            onClose={this.closeAccountAlreadyExistDialog}
            next={this.continueAccountAlreadyExists}
            editDetails={this.editDetailsAccountAlreadyExists}
          ></AccountAlreadyExistDialog>
        )}
      </Container>
    );
  }
}

export default Landing;
