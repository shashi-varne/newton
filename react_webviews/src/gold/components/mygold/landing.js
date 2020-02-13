import React, { Component } from 'react';
import Container from '../../common/Container';
import Api from 'utils/api';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

import goldOfferImageFisdom from 'assets/gold_offer_fisdom.jpg';
import goldOfferImageMyway from 'assets/gold_offer_myway.jpg';

import goldOfferImageFisdom2 from 'assets/gold_offer2.png';
import goldOfferImageMyway2 from 'assets/gold_offer2.png';

import goldOfferImageFisdom3 from 'assets/gold_offer_fisdom3.jpg';
import goldOfferImageMyway3 from 'assets/gold_offer_myway3.jpg';

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import GoldBottomSecureInfo from '../ui_components/gold_bottom_secure_info';

import gold_pattern from 'assets/gold_pattern.png';
import crd_gold_info from 'assets/crd_gold_info.svg';
import {isUserRegistered, gold_providers} from '../../constants';
import { inrFormatDecimal2} from 'utils/validators';

class GoldSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openPopup: false,
      popupText: '',
      apiError: '',
      user_info: {},
      openDialogOffer: false,
      showOffers: true,
      offerImageData: [],
      productName: getConfig().productName,
      mmtc_info: {},
      mmtc_info_local: gold_providers['mmtc'],
      safegold_info: {},
      safegold_info_local: gold_providers['safegold'],
      selected_provider_info : {},
      bottom_carousel: true
    }

    this.renderOfferImages = this.renderOfferImages.bind(this);
  }


  handleClose = () => {
    this.setState({
      openConfirmDialog: false,
      openPopup: false,
      openDialogOffer: false
    });

    if(this.state.openPriceChangedDialog && this.state.timeAvailable >0) {
      this.setState({
        openPriceChangedDialog: false
      })
    }
  }

  componentWillMount() {

    let type = getConfig().productName;
    
    var gold_offer_terms1 = [
      'For a transaction to be valid, there must be a minimum purchase of Rs 1,000 for each offer.',
      'Gold-back will be in the form of SafeGold balance and will be 5% of the value of gold purchased and upto a maximum of Rs 1000.',
      "Gold-back will be credited to the customer's account within 14 days of the end date of the offer.",
      "If an existing customer has transacted for purchase of Digital Gold through his/her " + (type === 'fisdom' ? 'Fisdom' : 'Myway') + " account prior to the launch of this gold-back offer, s/he will not be eligible for this offer",
      "Any conditions which are not explicitly covered would be at the sole discretion of SafeGold. The decision of SafeGold in this regard will be final and the company has the right to change the terms and conditions at any time.",
      "In case of any customer query or dispute, SafeGold reserves the right to resolve the same on the basis of the terms and conditions of the offer at its sole discretion."
    ];

    var gold_offer_terms2 = [
      'This offer is valid for only the first 100 deliveries per day.',
      'Delivery of coins may take between 5-7 working days from the date of order, and may be affected by weekends and holidays.'
    ]

    let offerImageData = [
      {
        src: type === 'fisdom' ? goldOfferImageFisdom : goldOfferImageMyway,
        link: '',
        terms: gold_offer_terms1,
        key: '5buy'
      },
      {
        src: type === 'fisdom' ? goldOfferImageFisdom3 : goldOfferImageMyway3,
        link: '',
        terms: gold_offer_terms2,
        key: '50delivery'
      },
      {
        src: type === 'fisdom' ? goldOfferImageFisdom2 : goldOfferImageMyway2,
        link: type === 'fisdom' ? 'https://www.fisdom.com/candere-gold-2019/' : 'https://mywaywealth.com/candere-gold-2019/',
        terms: '',
        key: 'candere'
      }
    ];

    this.setState({
      offerImageData: offerImageData
    })
  }

  setProviderData(provider, result1, result2) {
    let isRegistered = isUserRegistered(result1);
    let data = result1.gold_user_info.provider_info;
    data.isRegistered = isRegistered;
    data.user_info = result1.gold_user_info.user_info
    data.sell_value = ((result2.sell_info.plutus_rate) * (data.gold_balance || 0)).toFixed(2) || 0;
    data.provider = provider;
    data.local = gold_providers[provider];
    this.setState({
      [provider + '_info']: data,
      user_info: data.user_info
    });

    if(provider === 'safegold') {
      this.setState({
        show_loader: false
      })
    }

  }

  async onloadProvider(provider) {
    try {

      let result1 = {};
      let result2 = {};
      const res = await Api.get('/api/gold/user/account/' + provider);
      if (res.pfwresponse.status_code === 200) {
        result1 = res.pfwresponse.result;
      } else {
        this.setState({
          error: true,
          errorMessage: res.pfwresponse.result.error || res.pfwresponse.result.message ||
            'Something went wrong'
        });
      }

      const res2 = await Api.get('/api/gold/sell/currentprice/' + provider);
      if (res2.pfwresponse.status_code === 200) {
        
        result2 = res2.pfwresponse.result;
      } else {
        this.setState({
          error: true,
          errorMessage: res2.pfwresponse.result.error || res2.pfwresponse.result.message ||
            'Something went wrong'
        });
      }


      this.setProviderData(provider, result1, result2);
   
    } catch (err) {
      this.setState({
        show_loader: false,
      });
      toast('Something went wrong', 'error');
    }
  }


  async componentDidMount() {
    this.onloadProvider('mmtc');
    this.onloadProvider('safegold');
  }


  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'GOLD',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Gold Summary',
        "amount": this.state.amountError ? 'invalid' : this.state.amount ? 'valid' : 'empty',
        "weight": this.state.weightError ? 'invalid' : this.state.weight ? 'valid' : 'empty',
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  openInBrowser(url) {
    nativeCallback({
      action: 'open_in_browser',
      message: {
        url: url
      }
    });
  }

  handleClickOffer(offer, index) {
    if (offer.key === '5buy' || offer.key === '50delivery') {
      this.setState({
        openDialogOffer: true,
        selectedIndexOffer: index
      })
    } else if (offer.link) {
      this.openInBrowser(offer.link)
    }

  }

  renderOfferTerms(props, index) {
    return (
      <span className="gold-offer-terms" key={index}>
        {index + 1}. {props}
      </span>
    )
  }

  renderOfferImages(props, index) {
    return (
      <div key={index} onClick={() => this.handleClickOffer(props, index)} className="gold-offer-slider">
        <img className="gold-offer-slide-img"
          src={props.src} alt="Gold Offer" />
      </div>
    )
  }

  renderGoldOfferDialog = () => {

    if (this.state.openDialogOffer) {
      return (
        <Dialog
          id="payment"
          open={this.state.openDialogOffer}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span style={{ fontWeight: 500, color: 'black' }}>Terms and Conditions:  </span>
              {this.state.offerImageData[this.state.selectedIndexOffer].terms.map(this.renderOfferTerms)}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button style={{ textTransform: 'capitalize' }}
              fullWidth={true}
              variant="raised"
              size="large"
              color="secondary"
              onClick={() => this.handleClose()}
              autoFocus>Got It!
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
    return null;

  }

  navigate = (pathname) => {
   
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  
  renderBlock1() {
    return(
      <div className="block1">
        {this.state.bottom_carousel && this.rendertopInfoImage()}
        {!this.state.bottom_carousel && this.renderCarousel()}
      </div>
    )
  }

  renderBlock2() {
    return(
      <div className="block2">
      <div onClick={() => this.navigate('my-gold-locker')}
       className="highlight-text highlight-color-info">
        <img 
          src={ require(`assets/${this.state.productName}/ic_locker.svg`)} alt="Gold" />
        <div style={{display: 'grid'}}>
          <div className="highlight-text12">
          Total value
          </div>
          <div className="highlight-text2" style={{margin: '4px 0 0 8px'}}>
          {this.state.user_info.total_balance} gms = { inrFormatDecimal2(parseFloat(this.state.mmtc_info.sell_value) + parseFloat(this.state.safegold_info.sell_value))}
          </div>
        </div>

      </div>

      <div className="want-to">
      I want to
      </div>
      <div className="common-hr"></div>

      <div className="tile2" onClick={() => this.navigate('/gold/buy')}>
          <img className="icon"
            src={ require(`assets/${this.state.productName}/ic_locker.svg`)} alt="Gold" />
          <div className="title">
            Buy gold
          </div>
      </div>

      <div className="tile2" onClick={() => this.navigate('/gold/sell')}>
          <img className="icon"
            src={ require(`assets/${this.state.productName}/ic_locker.svg`)} alt="Gold" />
          <div className="title">
          Sell gold
          </div>
      </div>

      <div className="tile2" onClick={() => this.navigate('/gold/delivery')}>
          <img className="icon"
            src={ require(`assets/${this.state.productName}/ic_locker.svg`)} alt="Gold" />
          <div className="title">
          Get delivery
          </div>
      </div>
  </div>
    )
  }

  renderBlock3() {
    return(
     
      <div className="block3">
      <div className="title">
        Benefits of digital gold
      </div>
      <div className="subtitle">
        Bringing convenience and safety to digital gold
      </div>

      {!this.state.bottom_carousel && this.rendertopInfoImage()}

      <div className="benefites">

        <div className="tile">
            <img 
            src={ require(`assets/${this.state.productName}/ic_benefit_gold.svg`)} alt="Gold" />
          <div className="benefit-tile">
            <div className="benefit-tile-title">
              Affordability
            </div>
            <div className="benefit-tile-subtitle">
              Buy gold at live international market prices as per your budget
            </div>
          </div>
        </div>

        <div className="tile">
            <img 
            src={ require(`assets/${this.state.productName}/ic_secure_vault.svg`)} alt="Gold" />
          <div className="benefit-tile">
            <div className="benefit-tile-title">
            Easy sell or conversion
            </div>
            <div className="benefit-tile-subtitle">
            Sell to get the amount credited or convert to gold coins
            </div>
          </div>
        </div>

        <div className="tile">
            <img 
            src={ require(`assets/${this.state.productName}/ic_purity.svg`)} alt="Gold" />
          <div className="benefit-tile">
            <div className="benefit-tile-title">
            100% insured & secured
            </div>
            <div className="benefit-tile-subtitle">
            Assurance of 24 karat gold with no making or storage charges
            </div>
          </div>
        </div>

      </div>
    </div>
    )
  }

  rendertopInfoImage() {
    return(
      <div className="infoimage-block" style={{backgroundImage: `url(${crd_gold_info})`}}>
            <div className="title generic-page-title">
              Buy 24K gold to create long term wealth
            </div>
            <div className="button">
                <Button variant="raised"
                    size="large" onClick={() => this.navigate('check-how1')} color="secondary" autoFocus>
                  CHECK HOW?
                </Button>
            </div>
            <div className="bottom-content">
              Buy-sell anytime | 24K 99.9% pure | 100% secure
            </div>
        </div>
    )
  }

  renderCarousel() {
    return(
      <div>
        {this.state.showOffers && this.state.offerImageData && 
        <div style={{ margin: '20px 0 0 0', cursor: 'pointer' }}>
          <Carousel

            showStatus={false} showThumbs={false}
            showArrows={true}
            infiniteLoop={false}
            selectedItem={this.state.selectedIndex}
            onChange={(index) => {
              this.setState({
                selectedIndex: index,
                card_swipe: 'yes',
                card_swipe_count: this.state.card_swipe_count + 1
              });
            }}
          >
            {this.state.offerImageData.map(this.renderOfferImages)}
          </Carousel>
        </div>}
      </div>
    )
  }

  renderBlock4() {
    return(
      <div className="block4">

      {this.state.bottom_carousel && this.renderCarousel()}
      <div style={{margin: '30px 0 20px 0'}}>
        <GoldBottomSecureInfo />
      </div>

      </div>
    )
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Gold"
        noHeader={this.state.show_loader}
        noFooter={true}
        events={this.sendEvents('just_set_events')}
        classOverRide="gold-landing-container gold-landing-container-background"
        classOverRideContainer="gold-landing-container gold-landing-container-background"
        styleContainer={{
          backgroundImage: `url(${gold_pattern})`,
        }}
        styleHeader={{
          backgroundImage: `url(${gold_pattern})`,
        }}
        classHeader="gold-landing-header gold-landing-container-background"
      >
        <div className="gold-landing" id="goldSection">
            
            {this.renderBlock1()}
            {this.renderBlock2()}
            {this.renderBlock3()}
            {this.renderBlock4()}
        </div>
        
      </Container>
    );
  }
}

export default GoldSummary;
