import React, { Component } from 'react';
import Container from '../common/Container';
import { getConfig } from 'utils/functions';
import Button from '@material-ui/core/Button';
import { initialize } from './functions';
import InvestCard from './mini-components/InvestCard';
import SecureInvest from './mini-components/SecureInvest';
import VerificationFailedDialog from './mini-components/VerificationFailedDialog';
import KycStatusDialog from './mini-components/KycStatusDialog';
import KycPremiumLandingDialog from './mini-components/KycPremiumLandingDialog';
import { SkeltonRect } from 'common/ui/Skelton';
import { storageService } from 'utils/validators';
import SdkInvestCard from './mini-components/SdkInvestCard';
import { sdkInvestCardMapper } from './constants';
import isEmpty from 'lodash/isEmpty';
import { applyReferralCode } from './common/api';
import './Style.scss';
import toast from 'common/ui/Toast';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      kycStatusLoader: false,
      productName: getConfig().productName,
      partner: getConfig().partner,
      screenName: 'invest_landing',
      isWeb: getConfig().isWeb,
      invest_show_data: {},
      render_cards: [],
      verificationFailed: false,
      modalData: {},
      openKycStatusDialog: false,
      openKycPremiumLanding: false,
      referral: '',
      dotLoader: false
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    this.initilizeKyc();
    // this.setSdkLandingCardsData();
  };

  handleRefferalInput = (e) => {
    this.setState({ referral: e.target.value });
  };

  addBank = () => {
    const userKyc = this.state.userKyc || {};
    this.navigate(`/kyc/${userKyc.kyc_status}/bank-details`);
  };

  updateDocument = () => {
    this.navigate('/kyc/add-bank');
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

  handleCard = (path) => () => {
    if (path) {
      this.navigate(path);
    }
  };

  handleKycPremiumLanding = () => {
    if (
      this.state.screenName === 'invest_landing' &&
      this.state.bottom_sheet_dialog_data_premium.next_state === '/invest'
    ) {
      this.closeKycPremiumLandingDialog();
      return;
    }
    this.navigate(this.state.bottom_sheet_dialog_data_premium.next_state);
  };

  handleKycStatus = () => {
    let { kycJourneyStatus } = this.state;
    if (kycJourneyStatus === 'submitted') {
      this.closeKycStatusDialog();
    } else if (kycJourneyStatus === 'rejected') {
      this.navigate('/kyc/upload/progress', {
        state: {
          toState: '/invest',
        },
      });
    }
  };

  handleInvestSubtitle = () => {
    let investCardSubtitle = 'Mutual funds, Save tax';

    if (this.state.partner) {
      let invest_screen_cards = this.state.partner.invest_screen_cards;
      investCardSubtitle = 'Mutual funds';
      if (invest_screen_cards?.gold) {
        investCardSubtitle = investCardSubtitle += ', Gold, Save tax';
      } else {
        investCardSubtitle = 'Mutual funds, Save tax';
      }

      if (invest_screen_cards?.nps) {
        investCardSubtitle = investCardSubtitle += ', NPS';
      }
    }
    return investCardSubtitle;
  };

  handleReferral = async () => {
    try {
      this.setState({dotLoader: true});
      await applyReferralCode(this.state.referral);
      toast('You have applied referral code successfully', 'success');
    } catch(err) {
      toast(err, 'error')
    } finally{
      this.setState({dotLoader: false})
    }
  };

  // handleSubtitle = (key) => {
  //   if (key === 'kyc') {
  //     return this.state.kycStatusData?.subtitle;
  //   } else if (key === 'invest') {
  //     const subtitle = this.handleInvestSubtitle()
  //     return subtitle;
  //   } else {
  //     return '';
  //   }
  // };

  // handleRenderCard = () => {
  //   console.log("working")
  //   const {currentUser, isWeb, partner, isReadyToInvestBase, kycStatusData, userKyc, kycJourneyStatus } = this.state;
  //   const hideReferral = currentUser.active_investment && !isWeb && !partner?.feature_manager?.hide_share_refferal;
  //   const referralCode = !currentUser.active_investment && !isWeb && !partner?.feature_manager?.hide_share_refferal;
  //   const myAccount = isReadyToInvestBase || userKyc.bank.doc_status === 'rejected';
  //   const premiumKyc = kycJourneyStatus === 'ground_premium' ? 'PREMIUM' : '';
  //   const kyc = !isReadyToInvestBase;
  //   const kycTitle = kycJourneyStatus === 'ground_premium' ? 'Create investment profile' : '';
  //   const kycSubtitle = kycJourneyStatus !== 'ground_premium' ? kycStatusData?.subtitle : '';
  //   const cards = sdkInvestCardMapper.filter(el => {
  //     if(el.key === 'kyc') {
  //       el.subtitle = kycStatusData?.subtitle;
  //       if(premiumKyc){
  //         el.title = el.title + premiumKyc;
  //       }
  //       if(kycTitle){
  //         el.title = kycTitle;
  //       }
  //       if(kycSubtitle){
  //         el.subtitle = kycSubtitle;
  //       }
  //       return kyc;
  //     } else if(el.key === 'account') {
  //       return myAccount;
  //     } else if(el.key === 'refer'){
  //       if(referralCode){
  //         el.referralCode = true;
  //         return referralCode;
  //       } else {
  //         return hideReferral;
  //       }
  //     } else {
  //       if(el.key === 'invest'){
  //        el.subtitle = this.handleInvestSubtitle()
  //       }
  //       return true;
  //     }
  //   })
  //   this.setState({renderLandingCards : cards});

  // }

  render() {
    let {
      isReadyToInvestBase,
      kycStatusLoader,
      productName,
      invest_show_data,
      partner,
      render_cards,
      kycStatusData,
      verificationFailed,
      openKycStatusDialog,
      modalData,
      openKycPremiumLanding,
      currentUser,
      dotLoader,
      referral,
    } = this.state;
    let {
      our_recommendations,
      diy,
      bottom_scroll_cards,
      bottom_cards,
      popular_cards,
    } = invest_show_data;
    const x = [1, 2, 3, 4];

    return (
      <Container skelton={this.state.show_loader} noFooter={true} title='Hello'>
        <div className='sdk-landing'>
          {!this.state.kycStatusLoader ? (
            <div className='generic-page-subtitle'>
              {isReadyToInvestBase
                ? ' Your KYC is verified, You’re ready to invest'
                : 'Let’s make your money work for you!'}
            </div>
          ) : (
            <SkeltonRect style={{ marginBottom: '20px', width: '75%', lineHeight: '1.6' }} />
          )}

          {/* Marketing Banners */}
          <div className='landing-marketing-banners'>
            <div className='marketing-banners-list'>
              {!isEmpty(x) && x.length === 1 ? (
                <div className='single-marketing-banner'>
                  <img src='' alt='' style={{ width: '100%' }} />
                </div>
              ) : (
                x.map((el) => (
                  <>
                    <div className='marketing-banner-icon-wrapper'>
                      <img src='' alt='' style={{ width: '100%' }} />
                    </div>
                  </>
                ))
              )}
            </div>
          </div>

          {/* Kyc Card */}
          {!isEmpty(this.state.renderLandingCards) && (
            <div className='sdk-landing-cards'>
              {this.state.renderLandingCards.map((el, idx) => {
                // const subtitle = this.handleSubtitle(el.key);
                // if(subtitle){
                //   el.subtitle = subtitle;
                // }
                if (el.key === 'kyc') {
                  console.log('statu', kycStatusLoader);
                  el.isLoading = kycStatusLoader;
                }

                return (
                  <SdkInvestCard
                    key={idx}
                    handleRefferalInput={this.handleRefferalInput}
                    referral={referral}
                    handleReferral={this.handleReferral}
                    {...el}
                    handleCard={this.handleCard(el?.path)}
                    xs={el.key}
                    dotLoader={dotLoader}
                  />
                );
              })}
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default Landing;
