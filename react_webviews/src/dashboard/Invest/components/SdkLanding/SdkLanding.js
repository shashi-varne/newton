import React, { Component } from 'react';
import Container from '../../../common/Container';
import { getConfig } from 'utils/functions';
import { initialize, handleCampaignNotification, handleCampaignRedirection } from '../../functions';
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

class SdkLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      kycStatusLoader: false,
      productName: getConfig().productName,
      partner: getConfig().partner,
      screenName: 'sdk_landing',
      isWeb: getConfig().Web,
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
      headerStyle: getConfig().uiElements?.header
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

  handleCard = (path) => () => {
    if (path) {
      if (path === '/kyc') {
        this.clickCard('kyc', this.state.kycStatusData.title);
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

  closeCampaignDialog = () => {
    this.setState({ openBottomSheet: false });
  };

  handleMarketingBanner = (path) => () => {
    if(path === '/invest/recommendations'){
      this.getRecommendationApi(100);
    } else {
      this.navigate(path);
    }
  }

  handleCampaign = () => {
    this.setState({showPageLoader : 'page', openBottomSheet : false});
    let campLink = this.state.bottom_sheet_dialog_data.url;
    handleCampaignRedirection(campLink);
  }

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

  handleKycStatus = () => {
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

  render() {
    let {
      isReadyToInvestBase,
      kycStatusLoader,
      partner,
      dotLoader,
      referral,
      kycJourneyStatusMapperData,
      kycJourneyStatus,
      verificationFailed,
      openKycStatusDialog,
      modalData
    } = this.state;

    return (
      <Container
        skelton={this.state.show_loader}
        noFooter={true}
        title='Hello'
        notification
        handleNotification={this.handleNotification}
        background='sdk-background'
        classHeader={this.state.headerStyle ? 'sdk-partner-header' : 'sdk-header'}
        showLoader={this.state.showPageLoader}
        headerData={{goBack: this.goBack, partnerLogo: true}}
        data-aid='sdk-landing-screen'
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
          {!isEmpty(partner?.landing_marketing_banners) && (
            <div className='landing-marketing-banners' data-aid='landing-marketing-banners'>
              {partner?.landing_marketing_banners?.length === 1 ? (
                <div className='single-marketing-banner'>
                  <img
                    src={require(`assets/${partner?.landing_marketing_banners[0].image}`)}
                    alt=''
                    style={{ width: '100%' }}
                  />
                </div>
              ) : (
                <div className='marketing-banners-list' data-aid='marketing-banners-list'>
                  {partner?.landing_marketing_banners.map((el, idx) => (
                    <div className='marketing-banner-icon-wrapper' key={idx} onClick={this.handleMarkettingBanner(el?.path)}>
                      <img src={require(`assets/${el.image}`)} alt='' style={{ width: '100%' }} />
                    </div>
                  ))}
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
                    handleCard={this.handleCard(el?.path)}
                    dotLoader={dotLoader}
                  />
                );
              })}
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
