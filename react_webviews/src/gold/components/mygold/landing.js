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

import HowToSteps from "../../../common/ui/HowToSteps";
import LandingSteps from "../../../common/ui/LandingSteps";

import GoldBottomSecureInfo from '../ui_components/gold_bottom_secure_info';

import gold_pattern_fisdom from 'assets/fisdom/gold_pattern.png';
import gold_pattern_myway from 'assets/finity/gold_pattern.png';
import {isUserRegistered, gold_providers} from '../../constants';
import { inrFormatDecimal2, storageService} from 'utils/validators';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {SkeltonRect} from '../../../common/ui/Skelton';
import {Imgc} from '../../../common/ui/Imgc';

import ReactResponsiveCarousel from "../../../common/ui/carousel";

let eventToStateMapper = {
  'check-how1': 'check-how',
  '/gold/buy': 'buy_gold',
  '/gold/sell': 'sell_gold',
  '/gold/delivery': 'get_delivery',
  'gold-locker': 'gold_locker',
  'marketing_banner': 'marketing_banner'
};



class GoldSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skelton: 'p',
      openPopup: false,
      popupText: '',
      apiError: '',
      user_info: {},
      openDialogOffer: false,
      showOffers: false, // to manage offer carousel
      offerImageData: [],
      productName: getConfig().productName,
      mmtc_info: {},
      mmtc_info_local: gold_providers['mmtc'],
      safegold_info: {},
      safegold_info_local: gold_providers['safegold'],
      selected_provider_info : {},
      bottom_carousel: true //to intechange check how and carousel
    }

  }


  handleClose = () => {
    this.setState({
      openPopup: false,
      openDialogOffer: false
    });
   
  }

  componentWillMount() {

    nativeCallback({ action: 'take_control_reset' });
    storageService().remove('gold_provider');
    let type = getConfig().productName;
    let typeCaps = type === 'fisdom' ? 'Fisdom' : 'Finity';
    

    var gold_offer_terms_mmtc = [
      'For a transaction to be valid, there must be a minimum purchase of Rs 1,000.',
      'Offer is only valid till  23:59 hrs 26th April 2020 .',
      'Gold-back will be credited to the customer’s account by 5th of May. ',
      'This offer can be availed only once ( per device, per user, per account) during the offer period.',
      'Any conditions which are not explicitly covered would be at the sole discretion of ' + typeCaps + '. The decision of ' + typeCaps + ' in this regard will be final and the company has the right to change terms and conditions at any time.',
      'In case of any customer query or dispute, ' + typeCaps+  ' reserves the right to resolve the same on the basis of the terms and conditions of the offer at its sole discretion.',
      'Gold-back will be in the form of MMTC-PAMP balance and will be 1% of the value of gold purchased and upto a maximum of Rs 100. Below table shows how the gold-back will be done. '
    ]


    
    var gold_offer_terms_safegold_november = [
      'Offer is only valid till  23:59 hrs 20th November 2020.',
      'For a customer to be valid for the offer (s)he should purchase gold worth at least 1gm during the offer period.',
      'This offer can be availed only once ( per device, per user, per account) during the offer period. Highest Goldback applicable will be given to the customer.',
      'Purchase can be done in a single transaction or multiple transaction but the total gold should be greater than at least 1gm.',
      'Goldback will be allotted as per below mentioned criteria as per the price of Gold on the allocation date as mentioned below.',
      [
        'Gold purchased greater than 1gm : Rs 100/- for first 500 customers',
        'Gold purchased greater than 10gm : Rs 2500/- for first 30 customers',
        'Gold purchased greater than 20 gm : Rs 5000/- for first 25 customers'
      ],

      "Gold-back amounts for lucky winners will be credited to the customer's Safegold account by 5th December 2020.",
      `Any conditions which are not explicitly covered would be at the sole discretion of Finwizard Technology Private Limited. The decision of ${typeCaps} in this regard will be final and the company has the right to change terms and conditions at any time.`,
      "In case of any customer query or dispute, Finwizard Technology Private Limited reserves the right to resolve the same on the basis of the terms and conditions of the offer at its sole discretion."
    ]

    let offerImageDataBase = [
      {
        src: 'Gold_banner2.jpg',
        link: '',
        terms: gold_offer_terms_safegold_november,
        key: 'safegold_november',
        canShow: true
      },
      {
        src: 'gold_offer2.png',
        link: type === 'fisdom' ? 'https://www.fisdom.com/candere-gold-2019/' : 'https://finity.in/candere-gold-2019/',
        terms: '',
        key: 'candere',
        canShow: true //remove
      },
      {
        src: 'gold_offer2.png',
        link: '',
        terms: gold_offer_terms_mmtc,
        key: 'mmtc_offer',
        canShow: true,// remove
        tableData: [
          {'c1': '1000-1999', 'c2': '10'},
          {'c1': '2000-4999', 'c2': '25'},
          {'c1': '5000 and above', 'c2': '100'}
        ]
      }
      
    ];

    let offerImageData = [];

    for(var i=0; i< offerImageDataBase.length; i++) {
      if(offerImageDataBase[i].canShow) {
        offerImageData.push(offerImageDataBase[i]);
      }
    }

    let stepsContentMapperBlock3 = {
      title: `Benefits of digital gold`,
      options: [
        {
          icon: "ic_benefit_gold",
          // title: "Affordability",
          subtitle: "Buy gold at live international market prices as per your budget",
        },
        {
          icon: "ic_secure_vault",
          // title: "Easy sell or conversion",
          subtitle: "Sell to get the amount credited or convert to gold coins",
        },
        {
          icon: "ic_purity",
          // title: "100% insured & secured",
          subtitle: "Assurance of 24 karat gold with no making or storage charges",
        },
      ],
    };

    let stepsContentMapperBlock2 = {
      title: `I want to`,
      img_alt:"Gold",
      options: [
        {
          icon: "ic_buy_gold",
          title: "Buy gold",
          next_state: '/gold/buy'
        },
        {
          icon: "ic_sell_gold",
          title: "Sell gold",
          next_state: '/gold/sell'
        },
        {
          icon: "ic_delivery",
          title: "Get delivery",
          next_state: '/gold/delivery'
        },
      ],
    };



    this.setState({
      offerImageData: offerImageData,
      gold_pattern: this.state.productName !== 'fisdom'  ? gold_pattern_myway : gold_pattern_fisdom,
      stepsContentMapperBlock3: stepsContentMapperBlock3,
      stepsContentMapperBlock2: stepsContentMapperBlock2
    })
  }

  setProviderData(provider, result1, result2) {
    let isRegistered = isUserRegistered(result1);
    let data = result1.gold_user_info.provider_info || {};
    data.isRegistered = isRegistered;
    data.user_info = result1.gold_user_info.user_info || {};
    let sell_info = result2.sell_info || {};
    data.sell_value = ((sell_info.plutus_rate) * (data.gold_balance || 0)).toFixed(2) || 0;
    data.provider = provider;
    data.local = gold_providers[provider];

    if(data.user_info.total_balance) {
      this.setState({
        user_info: data.user_info
      });
    }
    this.setState({
      [provider + '_info']: data
    });


    if(provider === 'mmtc') {
      this.setState({
        skelton: false
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
          onloadError: true,
          errorMessage: res.pfwresponse.result.error || res.pfwresponse.result.message ||
            'Something went wrong'
        });
      }

      const res2 = await Api.get('/api/gold/sell/currentprice/' + provider);
      if (res2.pfwresponse.status_code === 200) {
        result2 = res2.pfwresponse.result;
      } else {
        this.setState({
          onloadError: true
        });
        toast(res2.pfwresponse.result.error || res2.pfwresponse.result.message || 'Something went wrong');
      }


      this.setProviderData(provider, result1, result2);
   
    } catch (err) {
      console.log(err);
      this.setState({
        skelton: false,
        onloadError: true
      });
      toast('Something went wrong');
    }
  }


  onload = async () => {
    this.setState({
      skelton: 'p',
      onloadError: false
    })
    storageService().remove('forceBackState');
    storageService().remove('buyData');
    storageService().remove('sellData');
    this.onloadProvider('mmtc');
    this.onloadProvider('safegold');
  }

  async componentDidMount() {
    this.onload(); 
  }


  sendEvents(user_action, card_clicked, marketing_banner) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'gold_landing',
        'card_clicked': card_clicked || '',
        'marketing_banner': marketing_banner >= 0 ? marketing_banner : ''
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

  handleClickBlock2 = () => {
    if(!this.state.skelton) {
      if(this.state.onloadError) {
        this.onload();
      } else {
        this.navigate('/gold/gold-locker');
      }
    }
  }

  handleClickOffer = (offer, index) => {

    this.sendEvents('next', 'marketing_banner', index);

    if (offer.key === '5buy' || offer.key === '50delivery' || 
    offer.key === 'mmtc_offer' || offer.key === 'safegold_november') {
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
        {index !== 5 ? `${index + 1}. ${props}` : 
          props.map(offer => (
            <span key={offer}>
              <b>&bull; {offer} <br /></b>
            </span>
          ))
        }
      </span>
    )
  }

  renderOfferImages = (props, index) => {
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
           {this.state.offerImageData[this.state.selectedIndexOffer].key === 'mmtc_offer' &&
              <div>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="justify" padding='dense'>Investment Bucket</TableCell>
                      <TableCell align="justify" padding='dense'>Incentive ( Rs.)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{this.state.offerImageData[this.state.selectedIndexOffer].tableData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell align="justify" padding='dense'>{row.c1}</TableCell>
                      <TableCell align="justify" padding='dense'>{row.c2}</TableCell>
                    </TableRow>
                  ))}</TableBody>
                </Table>
              </div>
            }
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
    
    this.sendEvents('next', eventToStateMapper[pathname]);
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

  handleClickNext = (option,index) => {
    this.navigate(option.next_state);
  }

  renderBlock2() {
    return(
      <div className="block2">
      <div onClick={() => this.handleClickBlock2()}
       className="highlight-text highlight-color-info">
        <Imgc 
          src={ require(`assets/${this.state.productName}/ic_locker.svg`)} alt="Gold"
          style={{width: '40px', height: '40px'}}
          />
        <div style={{display: 'grid', margin: '0 0 0 10px'}}>
          {!this.state.skelton && !this.state.onloadError && 
          <div className="highlight-text12">
            Your gold locker
            <img  style={{margin: '0 0 0 8px', width: 11}}
          src={ require(`assets/lock_icn.svg`)} alt="Gold" />
          </div>
          }

          {!this.state.skelton && !this.state.onloadError && 
          <div className="highlight-text2" style={{margin: '4px 0 0 8px'}}>
          {this.state.user_info.total_balance || 0} gms = { inrFormatDecimal2(parseFloat(this.state.mmtc_info.sell_value) + parseFloat(this.state.safegold_info.sell_value))}
          </div>
          }

          {!this.state.skelton && this.state.onloadError && 
            <div className="highlight-text2 onload-error"
            style={{margin: '4px 0 0 8px'}}>
            Something went wrong. <div className="generic-page-button-small-withoutborder">RETRY</div>
            </div>
          }

          <SkeltonRect className="balance-skelton" 
            hide={!this.state.skelton} 
          />
          <SkeltonRect className="balance-skelton2" 
            hide={!this.state.skelton} 
          />
        </div>

      </div>

      <LandingSteps
            style={{ margin: "20px 0px 0px 0px", cursor:'pointer' }}
            baseData={this.state.stepsContentMapperBlock2}
            classNameIcon="steps-icon"
            handleClick={this.handleClickNext}
      />

     
  </div>
    )
  }

  renderBlock3() {
    return(
     
      <div className="block3">
      {!this.state.bottom_carousel && this.rendertopInfoImage()}

      <div className="benefites">

      <HowToSteps
            style={{ margin: "0px 0px 0px 0px",paddingTop:0 }}
            baseData={this.state.stepsContentMapperBlock3}
            classNameIcon="steps-icon"
            showSkelton={true}
          />
      </div>
    </div>
    )
  }

  callbackImgc = (type) => {
    this.setState({
      [type + '_loaded'] : true
    })
  }

  rendertopInfoImage() {
    return(
      <div className="infoimage-block1" onClick={() => this.navigate('/gold/check-how1')} >
            <Imgc 
            style={{width:'100%',cursor:'pointer', minHeight: 233}} 
            src={ require(`assets/${this.state.productName}/crd_gold_info.svg`)}
            alt="" 
            type="gold_check_how_icon"
            callbackImgc={this.callbackImgc}
            />
           
            {this.state.gold_check_how_icon_loaded &&
             <div className="inner">
              <div className="title generic-page-title">
                Buy 24K gold to create long term wealth
              </div>
              <div className="button">
                  <Button variant="raised"
                      size="large" color="secondary" autoFocus>
                    CHECK HOW?
                  </Button>
              </div>
              <div className="bottom-content">
                Buy-sell anytime | 24K 99.99% pure | 100% secure
              </div>
            </div>
            }
        </div>
    )
  }

  carouselSwipe_count = (index) => {
    this.setState({
      selectedIndex: index,
      card_swipe: "yes",
      card_swipe_count: this.state.card_swipe_count + 1,
    });
  };

  renderCarousel() {

    if(this.state.showOffers && this.state.offerImageData) {
      return(
          <div style={{ margin: '0px 0px 20px 0px', cursor: 'pointer' }}>
            <ReactResponsiveCarousel
                CarouselImg={this.state.offerImageData}
                callbackFromParent={this.carouselSwipe_count}
                selectedIndexvalue={this.state.selectedIndex}
                handleClick={this.handleClickOffer}
              />
            </div>
      )
    }

    return null;
    
  }

  renderBlock4() {
    return(
      <div className="block4">

      {this.state.bottom_carousel && this.renderCarousel()}
      <div style={{margin: 0}}>
        <GoldBottomSecureInfo parent={this} />
      </div>

      </div>
    )
  }

  render() {
    return (
      <Container
        // skelton={this.state.skelton}
        title="Gold"
        // noHeader={this.state.skelton}
        noFooter={true}
        events={this.sendEvents('just_set_events')}
        classOverRide="gold-landing-container"
        classOverRideContainer="gold-landing-container"
      >
        <div className="gold-landing" id="goldSection">
            
            {this.renderBlock1()}
            {this.renderBlock2()}
            {this.renderBlock3()}
            {this.renderBlock4()}
        </div>
        
        {this.renderGoldOfferDialog()}
      </Container>
    );
  }
}

export default GoldSummary;
