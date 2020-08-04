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


import goldOfferSafegoldFisdom from 'assets/fisdom/Gold_banner.jpg';
import goldOfferSafegoldMyway from 'assets/myway/Gold_banner.jpg';

import goldOfferImageFisdom2 from 'assets/gold_offer2.png';
import goldOfferImageMyway2 from 'assets/gold_offer2.png';

import goldOfferImage from 'assets/gold_offer.jpg';

import mmtcOfferImage from 'assets/MMTC-PAMP-offer.png';

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import GoldBottomSecureInfo from '../ui_components/gold_bottom_secure_info';

import gold_pattern_fisdom from 'assets/fisdom/gold_pattern.png';
import gold_pattern_myway from 'assets/myway/gold_pattern.png';
import crd_gold_info from 'assets/crd_gold_info.svg';
import {isUserRegistered, gold_providers} from '../../constants';
import { inrFormatDecimal2, storageService} from 'utils/validators';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
      show_loader: true,
      openPopup: false,
      popupText: '',
      apiError: '',
      user_info: {},
      openDialogOffer: false,
      showOffers: true, // to manage offer carousel
      offerImageData: [],
      productName: getConfig().productName,
      mmtc_info: {},
      mmtc_info_local: gold_providers['mmtc'],
      safegold_info: {},
      safegold_info_local: gold_providers['safegold'],
      selected_provider_info : {},
      bottom_carousel: true //to intechange check how and carousel
    }

    this.renderOfferImages = this.renderOfferImages.bind(this);
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
    let typeCaps = type === 'fisdom' ? 'Fisdom' : 'Myway';
    
    var gold_offer_terms1 = [
      'For a transaction to be valid, there must be a minimum purchase of Rs 1,000 for each offer.',
      'Gold-back will be in the form of SafeGold balance and will be 5% of the value of gold purchased and upto a maximum of Rs 1000.',
      "Gold-back will be credited to the customer's account within 14 days of the end date of the offer.",
      "If an existing customer has transacted for purchase of Digital Gold through his/her " + typeCaps + " account prior to the launch of this gold-back offer, s/he will not be eligible for this offer",
      "Any conditions which are not explicitly covered would be at the sole discretion of SafeGold. The decision of SafeGold in this regard will be final and the company has the right to change the terms and conditions at any time.",
      "In case of any customer query or dispute, SafeGold reserves the right to resolve the same on the basis of the terms and conditions of the offer at its sole discretion."
    ];

    var gold_offer_terms2 = [
      'For a transaction to be valid, there must be a minimum purchase of Rs 1,000.',
      'Offer is only valid till  23:59 hrs 10th May 2020.',
      'This offer can be availed only once ( per device, per user, per account) during the offer period.',
      '5 Lucky customers will be selected as a winner of flat Rs 1000 Gold-back.',
      'Gold-back amounts for lucky winners will be credited to the customers MMTC-PAMP account by 20th May 2020.',
      'Any conditions which are not explicitly covered would be at the sole discretion of ' + typeCaps + '. The decision of ' + typeCaps + ' in this regard will be final and the company has the right to change terms and conditions at any time.',
      'In case of any customer query or dispute, ' + typeCaps + ' reserves the right to resolve the same on the basis of the terms and conditions of the offer at its sole discretion.'
    ]

    var gold_offer_terms_mmtc = [
      'For a transaction to be valid, there must be a minimum purchase of Rs 1,000.',
      'Offer is only valid till  23:59 hrs 26th April 2020 .',
      'Gold-back will be credited to the customer’s account by 5th of May. ',
      'This offer can be availed only once ( per device, per user, per account) during the offer period.',
      'Any conditions which are not explicitly covered would be at the sole discretion of ' + typeCaps + '. The decision of ' + typeCaps + ' in this regard will be final and the company has the right to change terms and conditions at any time.',
      'In case of any customer query or dispute, ' + typeCaps+  ' reserves the right to resolve the same on the basis of the terms and conditions of the offer at its sole discretion.',
      'Gold-back will be in the form of MMTC-PAMP balance and will be 1% of the value of gold purchased and upto a maximum of Rs 100. Below table shows how the gold-back will be done. '
    ]


    var gold_offer_terms_safegold_august = [
      'Offer is only valid till  23:59 hrs 17th August 2020.',
      'For a customer to be valid for the offer (s)he should purchase gold worth at least 2gm during the offer period.',
      'This offer can be availed only once ( per device, per user, per account) during the offer period. Highest Goldback applicable will be given to the customer.',
      'Purchase can be done in a single transaction or multiple transaction but the total gold should be greater than at least 2gm.',
      'Goldback will be allotted as per below mentioned criteria as per the price of Gold on the allocation date as mentioned below:',
      [
        'Gold purchased 2gm to 4gm : Rs 750/- for first 50 customers',
        'Gold purchased 5 gm to 9gm : Rs 1250/- for first 50 customers',
        'Gold purchased greater than 10gm : Rs 5000/- for first 10 customers',
        'Gold purchased greater than 20 gm : Rs 10000/- for first 10 customers'
      ],
      "Gold-back amounts for lucky winners will be credited to the customer's Safegold account by 30th August 2020.",
      'Any conditions which are not explicitly covered would be at the sole discretion of Finwizard Technology Private Limited. The decision of '  + typeCaps +  ' in this regard will be final and the company has the right to change terms and conditions at any time.',
      'In case of any customer query or dispute, Finwizard Technology Private Limited reserves the right to resolve the same on the basis of the terms and conditions of the offer at its sole discretion.',
    ]

    let offerImageDataBase = [
      {
        src: type === 'fisdom' ? goldOfferImageFisdom : goldOfferImageMyway,
        link: '',
        terms: gold_offer_terms1,
        key: '5buy',
        canShow: false
      },
      {
        src: goldOfferImage,
        link: '',
        terms: gold_offer_terms2,
        key: '50delivery',
        canShow: false
      },
      {
        src: type === 'fisdom' ? goldOfferImageFisdom2 : goldOfferImageMyway2,
        link: type === 'fisdom' ? 'https://www.fisdom.com/candere-gold-2019/' : 'https://mywaywealth.com/candere-gold-2019/',
        terms: '',
        key: 'candere',
        canShow: false
      },
      {
        src: mmtcOfferImage,
        link: '',
        terms: gold_offer_terms_mmtc,
        key: 'mmtc_offer',
        canShow: false,
        tableData: [
          {'c1': '1000-1999', 'c2': '10'},
          {'c1': '2000-4999', 'c2': '25'},
          {'c1': '5000 and above', 'c2': '100'}
        ]
      },
      {
        src: type === 'fisdom' ? goldOfferSafegoldFisdom : goldOfferSafegoldMyway,
        link: '',
        terms: gold_offer_terms_safegold_august,
        key: 'safegold_august',
        canShow: true
      },
    ];

    let offerImageData = [];

    for(var i=0; i< offerImageDataBase.length; i++) {
      if(offerImageDataBase[i].canShow) {
        offerImageData.push(offerImageDataBase[i]);
      }
    }

    this.setState({
      offerImageData: offerImageData,
      gold_pattern: this.state.productName !== 'fisdom'  ? gold_pattern_myway : gold_pattern_fisdom
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
        toast(res2.pfwresponse.result.error || res2.pfwresponse.result.message || 'Something went wrong');
      }


      this.setProviderData(provider, result1, result2);
   
    } catch (err) {
      console.log(err);
      this.setState({
        show_loader: false,
      });
      toast('Something went wrong');
    }
  }


  async componentDidMount() {
    storageService().remove('forceBackState');
    storageService().remove('buyData');
    storageService().remove('sellData');
    this.onloadProvider('mmtc');
    this.onloadProvider('safegold');
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

  handleClickOffer(offer, index) {

    this.sendEvents('next', 'marketing_banner', index);

    if (offer.key === '5buy' || offer.key === '50delivery' || 
    offer.key === 'mmtc_offer' || offer.key === 'safegold_august') {
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

  renderBlock2() {
    return(
      <div className="block2">
      <div onClick={() => this.navigate('gold-locker')}
       className="highlight-text highlight-color-info">
        <img 
          src={ require(`assets/${this.state.productName}/ic_locker.svg`)} alt="Gold" />
        <div style={{display: 'grid', margin: '0 0 0 10px'}}>
          <div className="highlight-text12">
            Your gold locker
            <img  style={{margin: '0 0 0 8px', width: 11}}
          src={ require(`assets/lock_icn.svg`)} alt="Gold" />
          </div>
          <div className="highlight-text2" style={{margin: '4px 0 0 8px'}}>
          {this.state.user_info.total_balance || 0} gms = { inrFormatDecimal2(parseFloat(this.state.mmtc_info.sell_value) + parseFloat(this.state.safegold_info.sell_value))}
          </div>
        </div>

      </div>

      <div className="want-to">
      I want to
      </div>
      <div className="common-hr"></div>

      <div className="tile2" onClick={() => this.navigate('/gold/buy')}>
          <img className="icon"
            src={ require(`assets/${this.state.productName}/ic_buy_gold.svg`)} alt="Gold" />
          <div className="title">
            Buy gold
          </div>
      </div>

      <div className="tile2" onClick={() => this.navigate('/gold/sell')}>
          <img className="icon"
            src={ require(`assets/${this.state.productName}/ic_sell_gold.svg`)} alt="Gold" />
          <div className="title">
          Sell gold
          </div>
      </div>

      <div className="tile2" onClick={() => this.navigate('/gold/delivery')}>
          <img className="icon"
            src={ require(`assets/${this.state.productName}/ic_delivery.svg`)} alt="Gold" />
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
      <div className="infoimage-block1" onClick={() => this.navigate('check-how1')} >
            <img style={{width:'100%',cursor:'pointer'}} src={crd_gold_info} alt="" />
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
        <GoldBottomSecureInfo parent={this} />
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
          backgroundImage: `url(${this.state.gold_pattern})`,
        }}
        styleHeader={{
          backgroundImage: `url(${this.state.gold_pattern})`,
        }}
        classHeader="gold-landing-header gold-landing-container-background"
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
