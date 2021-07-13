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
import WVButton from "../../../../common/ui/Button/WVButton"
import './Landing.scss';
import isEmpty from "lodash/isEmpty";
import VerifyDetailDialog from "../../../../login_and_registration/components/VerifyDetailDialog";
import AccountAlreadyExistDialog from "../../../../login_and_registration/components/AccountAlreadyExistDialog";
import { generateOtp } from "../../../../login_and_registration/function";
import { Imgc } from "../../../../common/ui/Imgc";

const fromLoginStates = ["/login", "/mobile/verify", "/logout", "/verify-otp"]
const isMobileDevice = getConfig().isMobileDevice;
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
    };
    this.initialize = initialize.bind(this);
    this.generateOtp = generateOtp.bind(this);
    this.handleCampaignNotification = handleCampaignNotification.bind(this);
    this.handleCampaignRedirection = handleCampaignRedirection.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    this.initilizeKyc();
    const isBottomSheetDisplayed = storageService().get(
      "is_bottom_sheet_displayed"
    );
    const isVerifyDetailsSheetDisplayed  = storageService().get("verifyDetailsSheetDisplayed")
    if (!isVerifyDetailsSheetDisplayed) {
      const { contactDetails } = this.state;
      if (contactDetails?.verification_done === null) {
        this.setState({
          verifyDetails: true,
          verifyDetailsData: {},
          verifyDetailsType:
            contactDetails?.auth_type === "mobile" ? "email" : "mobile",
        });
        storageService().set("verifyDetailsSheetDisplayed", true);
      } else if (contactDetails?.verification_done === false) {
        this.setState({
          verifyDetails: true,
          verifyDetailsData:
            contactDetails[
              `unverified_${
                contactDetails?.auth_type === "mobile" ? "email" : "mobile"
              }_contacts`
            ][0],
          verifyDetailsType:
            contactDetails?.auth_type === "mobile" ? "email" : "mobile",
        });
        storageService().set("verifyDetailsSheetDisplayed", true);
      }
    }
    if (!isBottomSheetDisplayed && this.state.isWeb) {
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
    this.setState({ openKycStatusDialog: false });
  };

  closeKycPremiumLandingDialog = () => {
    this.setState({
      openKycPremiumLanding: false,
    });
  };

  // email mobile verification
  closeVerifyDetailsDialog = () => {
    this.setState({
      verifyDetails: false
    })
  }

  closeAccountAlreadyExistDialog = () => {
    this.setState({
      accountAlreadyExists: false
    })
  }

  setAccountAlreadyExistsData = (show, data) => {
    this.setState({
      accountAlreadyExists: show,
      accountAlreadyExistsData: data,
      verifyDetails: false
    })
  }

  continueAccountAlreadyExists = async (type, data) => {
    let body = {};
    if (type === "email") {
      body.email = data?.email;
    } else {
      body.mobile = data?.mobile;
      body.whatsapp_consent = true;
    } // by default should this be true or false in case of bottomsheet?
    const otpResponse = await this.generateOtp(body);
    if (otpResponse) {
      this.navigate("secondary-otp-verification", {
        state: {
          mobile_number: data?.contact_value,
          forgot: false, // flag to be checked
          otp_id: otpResponse.pfwresponse.result.otp_id,
        },
      });
    }
  };

  editDetailsAccountAlreadyExists = () => {
    this.navigate("/kyc/communication-details", {
      state: {
        page: "landing",
        edit: true,
      },
    });
  };
  // Email mobile verification end


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
      stocksButtonLoader
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
        data-aid='start-investing-screen'
        noBackIcon={fromLoginStates.includes(stateParams.fromState)}
        background={
          isMobileDevice &&
          fromLoginStates.includes(stateParams.fromState) &&
          "invest-landing-background"
        }
        classHeader={
          isMobileDevice &&
          fromLoginStates.includes(stateParams.fromState) &&
          (this.state.headerStyle
            ? "invest-landing-partner-header"
            : "invest-landing-header")
        }
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
                      {(!kycStatusLoader && kycStatusData && ((!tradingEnabled && !isReadyToInvestBase) ||
-                      (tradingEnabled && !isEquityCompletedBase))) ? (
                        <div
                          data-aid='kyc-invest-sections-cards'
                          className="kyc"
                          style={{
                            backgroundImage: `url(${require(`assets/${productName}/${kycStatusData.icon}`)})`,
                          }}
                          onClick={() =>
                            !kycButtonLoader && !stocksButtonLoader && this.clickCard("kyc", kycStatusData.title)
                          }
                        >
                          <div className="title">{kycStatusData.title}</div>
                          <div className="subtitle">
                            {kycStatusData.subtitle}
                          </div>
                          <Button
                            dataAid='kyc-btn'
                            buttonTitle={kycStatusData.button_text}
                            classes={{
                              button: "invest-landing-button",
                            }}
                            showLoader={kycButtonLoader}
                          />
                        </div>
                      ): null}
                    </React.Fragment>
                  );
                case "stocks":
                  return (
                    <React.Fragment key={index}>
                      {!isEquityCompletedBase && (
                        <div className="invest-main-top-title" 
                          onClick={() => {!kycStatusLoader && !stocksButtonLoader && !kycButtonLoader && this.clickCard("stocks") }} 
                          data-aid='stocks-title'
                        >
                          <WVButton
                            variant='contained'
                            size='large'
                            color="secondary"
                            disabled={kycStatusLoader}
                            showLoader={stocksButtonLoader}
                            // fullWidth
                          >
                            Stocks
                          </WVButton>
                        </div>
                      )}
                    </React.Fragment>
                  );
                case "ourRecommendations":
                  return (
                    <React.Fragment key={index}>
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
                case "diy":
                  return (
                    <React.Fragment key={index}>
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
                    <div className="bottom-scroll-cards" key={index} data-aid='bottomScrollCards-title'>
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
                    <React.Fragment key={index}>
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
                  return <></>;
              }
            })}
          <SecureInvest />
          {productName !== "fisdom" &&
            productName !== "finity" &&
            productName !== "ktb" && (
              <div className="invest-contact-us" data-aid='invest-contact-us'>
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
