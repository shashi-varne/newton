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

class GoldSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      openPopup: false,
      popupText: '',
      apiError: '',
      goldInfo: {},
      userInfo: {},
      goldBuyInfo: {},
      goldSellInfo: {},
      isRegistered: false,
      openDialogOffer: false,
      showOffers: true,
      offerImageData: [],
      productName: getConfig().productName
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

  async componentDidMount() {
    try {

      const res = await Api.get('/api/gold/user/account');
      if (res && res.pfwresponse.status_code === 200) {

        this.setState({
          show_loader: false
        });
        let result = res.pfwresponse.result;
        let isRegistered = true;
        if (result.gold_user_info.user_info.registration_status === "pending" ||
          !result.gold_user_info.user_info.registration_status ||
          result.gold_user_info.is_new_gold_user) {
          isRegistered = false;
        }
        this.setState({
          goldInfo: result.gold_user_info.safegold_info,
          userInfo: result.gold_user_info.user_info,
          maxWeight: parseFloat(((30 - result.gold_user_info.safegold_info.gold_balance) || 30).toFixed(4)),
          isRegistered: isRegistered
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
      }

      const res2 = await Api.get('/api/gold/sell/currentprice');
      if (res2 && res2.pfwresponse.status_code === 200) {
        let goldInfo = this.state.goldInfo;
        let result = res2.pfwresponse.result;
        goldInfo.sell_value = ((result.sell_info.plutus_rate) * (goldInfo.gold_balance || 0)).toFixed(2) || 0;
        this.setState({
          goldSellInfo: result.sell_info,
          goldInfo: goldInfo,
          enableInputs: true
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res2.pfwresponse.result.error || res2.pfwresponse.result.message || 'Something went wrong', 'error');
      }
  
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }

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
          {/* <div className="text-center goldheader"
            onClick={() => this.navigate('/gold/my-gold-locker')}
            style={{
              background: getConfig().primary
            }}
          >
            <div className="my-gold-header">
              <div className="FlexRow row1">
                <img alt="Gold" className="img-mygold" src={safegold_logo} />
                <span className="my-gold-title-header">My 24K Safegold Gold Locker</span>
                <img alt="Gold" className="img-mygold2" src={arrow} />
              </div>
              <div className="spacer-header"></div>
              <div className="my-gold-details-header1">
                <div className="my-gold-details-header2">
                  <div className="my-gold-details-header2a">Weight</div>
                  <div className="my-gold-details-header2b">{this.state.goldInfo.gold_balance || 0} gm</div>
                </div>
                <div className="my-gold-details-header3">
                  <div className="my-gold-details-header2a">Selling Value</div>
                  <div className="my-gold-details-header2b">{inrFormatDecimal(this.state.goldInfo.sell_value ) || 0}</div>
                </div>
              </div>
            </div>
          </div> */}
            <div className="block1">

                <img 
                style={{width:'100%'}}
                src={ require(`assets/crd_gold_info.svg`)} alt="Gold" />
            </div>

            <div className="block2">
                <div className="highlight-text highlight-color-info">

                  <img 
                    src={ require(`assets/${this.state.productName}/ic_locker.svg`)} alt="Gold" />
                  <div style={{display: 'grid'}}>
                    <div className="highlight-text12">
                    Total value
                    </div>
                    <div className="highlight-text2" style={{margin: '4px 0 0 8px'}}>
                    0.0249 gms = ₹93.83
                    </div>
                  </div>

                </div>

                <div className="want-to">
                I want to
                </div>
                <div className="common-hr"></div>

                <div className="tile2">
                    <img className="icon"
                      src={ require(`assets/${this.state.productName}/ic_locker.svg`)} alt="Gold" />
                    <div className="title">
                      Buy gold
                    </div>
                </div>

                <div className="tile2">
                    <img className="icon"
                      src={ require(`assets/${this.state.productName}/ic_locker.svg`)} alt="Gold" />
                    <div className="title">
                    Sell gold
                    </div>
                </div>

                <div className="tile2">
                    <img className="icon"
                      src={ require(`assets/${this.state.productName}/ic_locker.svg`)} alt="Gold" />
                    <div className="title">
                    Get delivery
                    </div>
                </div>
            </div>

            <div className="block3">
              <div className="title">
                Benefits of digital gold
              </div>
              <div className="subtitle">
                Bringing convenience and safety to digital gold
              </div>

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

            <div className="block4">
              {this.state.showOffers && this.state.offerImageData && <div style={{ margin: '20px 0 0 0', cursor: 'pointer' }}>
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

              <GoldBottomSecureInfo />

            </div>
        </div>
        
      </Container>
    );
  }
}

export default GoldSummary;
