import React, { Component } from 'react';
import Container from '../../../common/Container';
import { getConfig } from 'utils/functions';
import { initialize } from '../../functions';
import { SkeltonRect } from 'common/ui/Skelton';
import SdkInvestCard from '../../mini-components/SdkInvestCard';
import { storageService } from 'utils/validators';
import isEmpty from 'lodash/isEmpty';
import { applyReferralCode } from '../../common/api';
import toast from 'common/ui/Toast';
import CampaignDialog from '../../mini-components/CampaignDialog';
import './SdkLanding.scss';

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
    };
    this.initialize = initialize.bind(this);
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

  handleCampaignNotification = () => {
    const notifications = storageService().getObject('campaign') || [];
    const bottom_sheet_dialog_data = notifications.reduceRight((acc, data) => {
      if (data?.notification_visual_data?.target?.length >= 1) {
        // eslint-disable-next-line no-unused-expressions
        data?.notification_visual_data?.target.forEach((el, idx) => {
          if (el?.view_type === 'bottom_sheet_dialog' && el?.section === 'landing') {
            acc = el;
            acc.campaign_name = data?.campaign?.name;
          }
        });
      }
      return acc;
    }, {});

    if (!isEmpty(bottom_sheet_dialog_data)) {
      storageService().set('is_bottom_sheet_displayed', true);
      this.setState({ bottom_sheet_dialog_data, openBottomSheet: true });
    }
  };

  handleMarkettingBanner = (path) => () => {
    if(path === '/invest/recommendations'){
      this.getRecommendationApi(100);
    } else {
      this.navigate(path);
    }
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
    } = this.state;

    return (
      <Container
        skelton={this.state.show_loader}
        noFooter={true}
        title='Hello'
        logo
        notification
        handleNotification={this.handleNotification}
        background='sdk-background'
        classHeader='sdk-header'
      >
        <div className='sdk-landing'>
          {!this.state.kycStatusLoader ? (
            <div className='generic-page-subtitle'>
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
            <div className='landing-marketing-banners'>
              {partner?.landing_marketing_banners?.length === 1 ? (
                <div className='single-marketing-banner'>
                  <img
                    src={require(`assets/${partner?.landing_marketing_banners[0].image}`)}
                    alt=''
                    style={{ width: '100%' }}
                  />
                </div>
              ) : (
                <div className='marketing-banners-list'>
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
        />
      </Container>
    );
  }
}

export default SdkLanding;
