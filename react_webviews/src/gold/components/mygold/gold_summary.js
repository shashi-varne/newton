import React, { Component } from 'react';
import qs from 'qs';

// import { FormControl } from 'material-ui/Form';
// import Input from '../../../common/ui/Input';
import Container from '../../common/Container';
import Api from 'utils/api';
import { inrFormatDecimal, storageService } from 'utils/validators';
import safegold_logo from 'assets/safegold_logo_60x60.png';
import arrow from 'assets/arrow.png';
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
import PlaceBuyOrder from '../ui_components/place_buy_order';

import {calculate_gold_amount_buy, calculate_gold_wt_buy, setBuyDataAfterUpdate} from '../../constants';

class GoldSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openPopup: false,
      popupText: '',
      apiError: '',
      goldInfo: {},
      userInfo: {},
      goldBuyInfo: {},
      goldSellInfo: {},
      new_rate: {},
      amountUpdated: '',
      weightUpdated: '',
      maxWeight: '',
      minAmount: '',
      isRegistered: false,
      isWeight: false,
      isAmount: false,
      amountError: false,
      weightError: false,
      minutes: "",
      seconds: "",
      weight: '',
      amount: '',
      params: qs.parse(props.history.location.search.slice(1)),
      countdownInterval: null,
      openDialogOffer: false,
      showOffers: false,
      offerImageData: []
    }

    this.renderOfferImages = this.renderOfferImages.bind(this);
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

  updateParent(key, value) {
    this.setState({
      [key]: value
    })
  }

  async componentDidMount() {
    try {

      const res3 = await Api.get('/api/gold/buy/currentprice');
      if (res3.pfwresponse.status_code === 200) {
        let result = res3.pfwresponse.result;
        let goldBuyInfo = result.buy_info;
        var currentDate = new Date();
        let timeAvailable = ((goldBuyInfo.rate_validity - currentDate.getTime()) / 1000 - 330 * 60);

        let buyData = storageService().getObject('buyData');
        buyData.goldBuyInfo = result.buy_info;
        buyData.timeAvailable = timeAvailable;
        storageService().setObject('buyData', buyData);

        this.setState({
          show_loader: false,
          goldBuyInfo: result.buy_info,
          timeAvailable: timeAvailable,
          minAmount: goldBuyInfo.minimum_buy_price,
          buyData: buyData
        });

        if (timeAvailable >= 0 && goldBuyInfo.plutus_rate) {
          let intervalId = setInterval(this.countdown, 1000);
          this.setState({
            countdownInterval: intervalId
          });
        }
      } else {
        this.setState({
          show_loader: false
        });
        toast(res3.pfwresponse.result.error || res3.pfwresponse.result.message || 'Something went wrong', 'error');
      }

      const res = await Api.get('/api/gold/user/account');
      if (res && res.pfwresponse.status_code === 200) {
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

  componentWillUnmount() {
    clearInterval(this.state.countdownInterval);
  }

  countdown = () => {
    let timeAvailable = this.state.timeAvailable;
    if (timeAvailable <= 0) {
      this.setState({
        minutes: '',
        seconds: ''
      })
      window.location.reload();
      return;
    }

    let minutes = Math.floor(timeAvailable / 60);
    let seconds = Math.floor(timeAvailable - minutes * 60);
    timeAvailable--;
    this.setState({
      timeAvailable: timeAvailable,
      minutes: minutes,
      seconds: seconds
    })
    window.localStorage.setItem('timeAvailable', timeAvailable);
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

  buyGold = async () => {

    this.sendEvents('next');
    if (parseFloat(this.state.weight) > this.state.maxWeight) {
      toast('You can not buy more than ' + this.state.maxWeight + ' gm', 'error');
      return;
    }

    if (!parseFloat(this.state.weight) || parseFloat(this.state.weight) < 0) {
      toast('Please enter a correct value for the weight', 'error');
      return;
    }

    if (!parseFloat(this.state.amount)) {
      toast('Please enter a correct value for the amount', 'error');
      return;
    }

    if (parseFloat(this.state.amount) >= 0 && parseFloat(this.state.amount) < this.state.minAmount) {
      toast('Minimum amount should be Rs. ' + this.state.minAmount, 'error');
      return;
    }

    if (this.state.userInfo.mobile_verified === false ||
      this.state.isRegistered === false) {
      this.navigate(this.state.provider + '/gold-register');
      return;
    }


    // place buy order
    this.setState({
      proceedForOrder: true
    })

  }


  handleClose = () => {
    this.setState({
      openPopup: false,
      openDialogOffer: false
    });
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
    if (pathname === '/gold/my-gold-locker') {
      this.sendEvents('gold-locker');
    }
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  setAmountGms = () => event => {
    let amountError = false;
    let weightError = false;
    let isWeight = this.state.isWeight;
    let isAmount = this.state.isAmount;
    let amount = '', weight = '';
    let inputData = {};

    if (event.target.name === 'amount' && event.target.value) {
      amount = Math.floor(event.target.value);
      inputData = calculate_gold_wt_buy(this.state.buyData, amount);
      weight = inputData.weight;
      isWeight = false;
      isAmount = true;
    } else if (event.target.name === 'weight' && event.target.value) {
      weight = event.target.value;
      inputData = calculate_gold_amount_buy(this.state.buyData, weight);
      amount = inputData.amount;
      isWeight = true;
      isAmount = false;
    } else {
      isWeight = false;
      isAmount = false;
      amount = '';
      weight = '';
    }

    if (parseFloat(weight) > this.state.maxWeight) {
      weightError = true;
    }

    if (!weight || parseFloat(weight) < 0) {
      weightError = true;
    }

    if (!amount || parseFloat(amount) < 0) {
      amountError = true;
    }

    if (parseFloat(amount) >= 0 && parseFloat(amount) < this.state.minAmount) {
      amountError = true;
    }


    // will consume for buy price and buy order;
    let buyData = storageService().getObject('buyData');
    buyData.amount_selected = amount;
    buyData.weight_selected = weight;
    buyData.inputMode = isAmount ? 'amount' : 'weight';
    storageService().setObject('buyData', buyData);

    setBuyDataAfterUpdate(inputData);

    console.log(buyData);
    this.setState({
      isWeight: isWeight,
      isAmount: isAmount,
      amountError: amountError,
      weightError: weightError,
      amount: amount,
      weight: weight,
      buyData: buyData
    })
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="24K Digital Gold"
        handleClick={this.buyGold}
        edit={this.props.edit}
        buttonTitle="Proceed"
        noPadding={true}
        events={this.sendEvents('just_set_events')}
      >
        <div className="page home" id="goldSection">
          <div className="text-center goldheader"
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
          </div>
          <div className="page-body-gold container-padding" id="goldInput">
            <div className="buy-info1">
              <div className="FlexRow">
                <span className="buy-info2a">Current Buy Price</span>
                <span className="buy-info2b">Price valid for
                &nbsp;<span className="timer-green">{this.state.minutes || 0}:{this.state.seconds || 0}</span>
                </span>
              </div>
              <div className="buy-info3">
                {inrFormatDecimal(this.state.goldBuyInfo.plutus_rate) || 0}/gm
              </div>
            </div>
            <div className="buy-input">
              <div className="buy-input1">
                Enter amount of gold you want to buy
              </div>
              {/* <FormControl fullWidth> */}
              <div className="label">
                <div className="FlexRow">
                  <div className="InputField">
                    <div className="input-above-text">In Rupees (₹)</div>
                    <div className="input-box">
                      <input type="number" autoComplete="off" name="amount" placeholder="Amount" disabled={!this.state.enableInputs || 
                       this.state.isWeight}
                        onChange={this.setAmountGms()} value={this.state.amount} />
                    </div>
                    <div className={'input-below-text ' + (this.state.amountError ? 'error' : '')}>Min {inrFormatDecimal(this.state.minAmount)}</div>
                  </div>
                  <div className="symbol">
                    =
                  </div>
                  <div className="InputField">
                    <div className="input-above-text">In Grams (gm)</div>
                    <div className="input-box">
                      <input type="number" autoComplete="off" name="weight" placeholder="Weight" disabled={!this.state.enableInputs || 
                       this.state.isAmount}
                        onChange={this.setAmountGms()} value={this.state.weight} />
                    </div>
                    <div className={'input-below-text ' + (this.state.weightError ? 'error' : '')}>Max {this.state.maxWeight} gm</div>
                  </div>
                </div>
              </div>
              {/* </FormControl> */}
              {/* <FormControl fullWidth>
                <div className="InputField">
                  <Input
                    type="number" autoComplete="off" label="Amount" name="amount" placeholder="Amount" disabled={this.state.isWeight}
                    onChange={this.setAmountGms()} value={this.state.amount} />
                </div>
                <div className="InputField">
                  <Input
                    type="number" autoComplete="off" label="Weight" name="weight" placeholder="Weight" disabled={this.state.isAmount}
                    onChange={this.setAmountGms()} value={this.state.weight} />
                </div>
              </FormControl> */}
              <div className="disclaimer">
                Purchase amount is inclusive of 3% GST
              </div>
            </div>
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
          </div>
        </div>
        {this.renderGoldOfferDialog()}
        {this.state.proceedForOrder && 
          <PlaceBuyOrder parent={this} />
        }
      </Container>
    );
  }
}

export default GoldSummary;
