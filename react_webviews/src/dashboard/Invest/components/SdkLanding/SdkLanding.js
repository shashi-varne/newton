import React, { Component } from 'react';
import Container from '../../../common/Container';
import { getConfig } from 'utils/functions';
import { initialize, handleCampaignNotification, dateValidation } from '../../functions';
import { SkeltonRect } from 'common/ui/Skelton';
import SdkInvestCard from '../../mini-components/SdkInvestCard';
import { storageService } from 'utils/validators';
import isEmpty from 'lodash/isEmpty';
import { applyReferralCode } from '../../common/api';
import toast from 'common/ui/Toast';
import CampaignDialog from '../../mini-components/CampaignDialog';
import './SdkLanding.scss';
import VerificationFailedDialog from '../../mini-components/VerificationFailedDialog';
import KycStatusDialog from '../../mini-components/KycStatusDialog';
import { nativeCallback } from '../../../../utils/native_callback';
import { Imgc } from '../../../../common/ui/Imgc';

const PATHNAME_MAPPER = {
  nfo: "/advanced-investing/new-fund-offers/info",
  diy: "/invest/explore",
  buildwealth: "/invest/buildwealth",
  instaredeem: "/invest/instaredeem",
}

const cardNameMapper = {
  portfolio: "Portfolio",
  withdraw: "short_term",
  account: "Account",
  refer: "refer&earn",
  help: "help&support",
  gold: "gold card",
  "100_sip": "SIP 100",
};
class SdkLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      kycStatusLoader: false,
      screenName: 'sdk_landing',
      invest_show_data: {},
      render_cards: [],
      verificationFailed: false,
      modalData: {},
      openKycStatusDialog: false,
      openKycPremiumLanding: false,
      referral: '',
      dotLoader: false,
      openBottomSheet: false,
      bottom_sheet_dialog_data: [],
    };
    this.initialize = initialize.bind(this);
    this.handleCampaignNotification = handleCampaignNotification.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    this.initilizeKyc();
    const isBottomSheetDisplayed = storageService().get('is_bottom_sheet_displayed');
    if (!isBottomSheetDisplayed) {
      this.handleCampaignNotification();
    }
  };

  handleRefferalInput = (e) => {
    this.setState({ referral: e.target.value });
  };

  handleNotification = () => {
    this.navigate('/notification');
  };

  handleCard = (path, key) => () => {
    this.sendEvents("next", key);
    if (path) {
      if (path === '/kyc') {
        this.openKyc();
      } else {
        this.navigate(path);
      }
    }
  };

  handleReferral = async () => {
    try {
      this.setState({ dotLoader: true });
      await applyReferralCode(this.state.referral);
      toast('You have applied referral code successfully', 'success');
    } catch (err) {
      toast(err, 'error');
    } finally {
      this.setState({ dotLoader: false });
    }
  };

  handleMarketingBanner = (bannerType="") => () => {
    this.sendEvents("marketing_banner_clicked", bannerType);
    if(bannerType === '100_sip'){
      this.getRecommendationApi(100);
    } else {
      const path = PATHNAME_MAPPER[bannerType] || "/";
      this.navigate(path);
    }
  }

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

  handleKycStatus = () => {
    this.sendEvents("next", "kyc_bottom_sheet");
    let { kycJourneyStatus } = this.state;
    if (kycJourneyStatus === "submitted") {
      this.closeKycStatusDialog();
    } else if (kycJourneyStatus === "rejected") {
      this.navigate("/kyc/upload/progress", {
        state: {
          fromState: "/",
        },
      });
    }
  };

  goBack = () => {
    nativeCallback({action: "exit_web"})
  }

  sendEvents = (userAction, cardClick = "") => {
    let eventObj = {
      event_name: "landing_page",
      properties: {
        user_action: "next",
        action: userAction,
        screen_name: "sdk landing",
        primary_category: "primary navigation",
        card_click: cardNameMapper[cardClick] || cardClick,
        intent: "",
        kyc_status: this.state.kycJourneyStatus,
        option_clicked: "",
        channel: getConfig().code,
      },
    };
    if (cardClick === "kyc_bottom_sheet") {
      eventObj.event_name = "bottom_sheet";
      eventObj.properties.intent = "kyc status";
      eventObj.properties.option_clicked = userAction;
    } else if (userAction === 'marketing_banner_clicked') {
      eventObj.properties.action = 'next';
      eventObj.properties.primary_category = 'marketing carousel';
    }
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  render() {
    let {
      isReadyToInvestBase,
      kycStatusLoader,
      dotLoader,
      referral,
      kycJourneyStatusMapperData,
      kycJourneyStatus,
      verificationFailed,
      openKycStatusDialog,
      modalData
    } = this.state;

    const config = getConfig();
    const landingMarketingBanners= config.landingMarketingBanners;
    const headerStyle=  config.uiElements?.header?.backgroundColor;

    return (
      <Container
        skelton={this.state.show_loader}
        noFooter={true}
        title='Hello'
        notification
        handleNotification={this.handleNotification}
        background='sdk-background'
        classHeader={headerStyle ? 'sdk-partner-header' : 'sdk-header'}
        showLoader={this.state.showPageLoader}
        headerData={{goBack: this.goBack, partnerLogo: true}}
        data-aid='sdk-landing-screen'
        events={this.sendEvents("just_set_events")}
      >
        <div className='sdk-landing' data-aid='sdk-landing'>
          {!this.state.kycStatusLoader ? (
            <div className='generic-page-subtitle' data-aid='generic-page-subtitle'>
              {isReadyToInvestBase
                ? ' Your KYC is verified, You’re ready to invest'
                : 'Let’s make your money work for you!'}
            </div>
          ) : (
            <SkeltonRect
              style={{ marginBottom: '20px', marginTop: '-20px', width: '75%', lineHeight: '1.6' }}
            />
          )}

          {/* Marketing Banners */}
          {!isEmpty(landingMarketingBanners) && (
            <div className='landing-marketing-banners' data-aid='landing-marketing-banners'>
              {landingMarketingBanners?.length === 1 ? (
                <div className='single-marketing-banner'>
                  {dateValidation(
                    landingMarketingBanners[0]?.endDate,
                    landingMarketingBanners[0]?.startDate
                  ) && (
                    <Imgc
                      src={require(`assets/${landingMarketingBanners[0].image}`)}
                      alt=""
                      style={{ width: "100%", minHeight: "120px" }}
                      onClick={this.handleMarketingBanner(
                        landingMarketingBanners[0]?.type
                      )}
                    />
                  )}
                </div>
              ) : (
                <div className='marketing-banners-list' data-aid='marketing-banners-list'>
                  {landingMarketingBanners?.map((el, idx) => {
                    return (
                      <>
                        {dateValidation(el?.endDate, el?.startDate) && (
                          <div
                            className="marketing-banner-icon-wrapper"
                            key={idx}
                            onClick={this.handleMarketingBanner(el?.type)}
                          >
                            <Imgc
                              src={require(`assets/${el.image}`)}
                              alt=""
                              style={{ width: "100%" }}
                            />
                          </div>
                        )}
                      </>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Kyc Card */}
          {!isEmpty(this.state.renderLandingCards) && (
            <div className='sdk-landing-cards'>
              {this.state.renderLandingCards.map((el, idx) => {
                if (el.key === 'kyc') {
                  el.isLoading = kycStatusLoader;
                  el.color = kycJourneyStatusMapperData?.color;
                  const premiumKyc = kycJourneyStatus === 'ground_premium' ? 'PREMIUM' : '';
                  const kycDefaultSubTitle =
                    !kycJourneyStatusMapperData || kycJourneyStatus === 'ground_premium'
                      ? 'Create investment profile'
                      : '';
                  const kycSubTitle =
                    !isEmpty(kycJourneyStatusMapperData) && kycJourneyStatus !== 'ground_premium'
                      ? kycJourneyStatusMapperData?.landing_text
                      : '';
                  if (premiumKyc) {
                    el.title = el.title + premiumKyc;
                  }
                  if (kycDefaultSubTitle) {
                    el.subtitle = kycDefaultSubTitle;
                  }
                  if (kycSubTitle) {
                    el.subtitle = kycSubTitle;
                    el.dot = true;
                  }
                }

                return (
                  <SdkInvestCard
                    key={idx}
                    handleRefferalInput={this.handleRefferalInput}
                    referral={referral}
                    handleReferral={this.handleReferral}
                    {...el}
                    handleCard={this.handleCard(el?.path, el?.key)}
                    dotLoader={dotLoader}
                  />
                );
              })}
            </div>
          )}
          {!["fisdom", "finity", "ktb"].includes(config.code) && (
              <div className="invest-contact-us" data-aid='invest-contact-us'>
                In partnership with
                <span>
                  {config.productName === "finity"
                    ? " Finity"
                    : " Fisdom"}
                </span>
              </div>
          )}
        </div>
        <CampaignDialog
          isOpen={this.state.openBottomSheet}
          close={this.closeCampaignDialog}
          cancel={this.closeCampaignDialog}
          data={this.state.bottom_sheet_dialog_data}
          handleClick={this.handleCampaign}
        />
        {verificationFailed && (
          <VerificationFailedDialog
            isOpen={verificationFailed}
            close={this.closeVerificationFailed}
            addBank={this.addBank}
            updateDocument={this.updateDocument}
          />
        )}
        {openKycStatusDialog && (
          <KycStatusDialog
            isOpen={openKycStatusDialog}
            data={modalData}
            close={this.closeKycStatusDialog}
            handleClick={this.handleKycStatus}
            cancel={this.closeKycStatusDialog}
          />
        )}
      </Container>
    );
  }
}

export default SdkLanding;
