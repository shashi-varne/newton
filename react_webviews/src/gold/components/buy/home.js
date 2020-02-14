import React, { Component } from 'react';
import qs from 'qs';

import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import Api from 'utils/api';
import { inrFormatDecimal2, storageService, formatAmountInr, formatGms } from 'utils/validators';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { default_provider, gold_providers } from '../../constants';
import PlaceBuyOrder from '../ui_components/place_buy_order';
import PriceChangeDialog from '../ui_components/price_change_dialog';
import RefreshBuyPrice from '../ui_components/buy_price';
import GoldLivePrice from '../ui_components/live_price';
import { calculate_gold_amount_buy, calculate_gold_wt_buy, setBuyDataAfterUpdate } from '../../constants';

import GoldProviderFilter from '../ui_components/provider_filter';
import GoldOnloadAndTimer from '../ui_components/onload_and_timer';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import GoldBottomSecureInfo from '../ui_components/gold_bottom_secure_info';

const plusOptionsAmount = [
  500, 1000, 2000, 5000
];

const plusOptionsWeight = [
  0.25, 0.50, 1.00, 2.00
];

const stepsContentMapper = [
  {'icon': 'ic_gold_provider', 'content': '1. Select your preferred gold provider'},
  {'icon': 'ic_input', 'content': '2. Enter amount in rupees or grams'},
  {'icon': 'ic_make_payment', 'content': '3. Select payment method and make payment'},
  {'icon': 'ic_gold_added', 'content': '4. Gold added to your digital locker'}
];

class GoldBuyHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openPopup: false,
      popupText: '',
      apiError: '',
      provider_info: {},
      user_info: {},
      goldBuyInfo: {},
      new_rate: {},
      amountUpdated: '',
      weightUpdated: '',
      maxWeight: '',
      minAmount: '',
      isRegistered: false,
      isWeight: false,
      isAmount: true,
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
      offerImageData: [],
      provider: storageService().get('gold_provider') || default_provider,
      gold_providers: gold_providers,
      redirect_state: 'buy-home',
      orderType: 'buy',
      openPriceChangedDialog: false,
      fetchLivePrice: true,
      productName: getConfig().productName
    }
  }


  // common code start
  onload = () => {
    this.setState({
      openOnloadModal: false
    })
    this.setState({
      openOnloadModal: true
    })
  }

  updateParent = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  refreshData = () => {

    if (this.state.timeAvailable > 0) {
      this.handleClick();
    } else {
      this.setState({
        show_loader: true,
        openRefreshModule: true
      })
    }

  }

  handleClose = () => {
    this.setState({
      openConfirmDialog: false,
      openPopup: false,
      openDialogOffer: false
    });

    if (this.state.openPriceChangedDialog && this.state.timeAvailable > 0) {
      this.setState({
        openPriceChangedDialog: false
      })
    }
  }

  // common code start

  async componentDidMount() {
    try {

      const res = await Api.get('/api/gold/user/account/' + this.state.provider);
      if (res && res.pfwresponse.status_code === 200) {

        let result = res.pfwresponse.result;
        let user_info = result.gold_user_info.user_info;
        let provider_info = result.gold_user_info.provider_info;
        let isRegistered = true;
        if (provider_info.registration_status === "pending" ||
          !provider_info.registration_status ||
          result.gold_user_info.is_new_gold_user) {
          isRegistered = false;
        }
        this.setState({
          provider_info: provider_info,
          user_info: user_info,
          maxWeight: parseFloat(((30 - result.gold_user_info.provider_info.gold_balance) || 30).toFixed(4)),
          isRegistered: isRegistered,
          enableInputs: true
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
      }

    } catch (err) {
      console.log(err);
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

  handleClick = async () => {

    this.handleClose();
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

    if (this.state.provider_info.mobile_verified === false ||
      this.state.isRegistered === false) {
      this.navigate(this.state.provider + '/gold-register');
      return;
    }


    // place buy order
    this.setState({
      proceedForOrder: true
    })

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

  navigate = (pathname) => {
    if (pathname === '/gold/my-gold-locker') {
      this.sendEvents('gold-locker');
    }

    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleKeyChange = name => event => {
    if (event.charCode >= 48 && event.charCode <= 57) {
      // valid
    } else {
      // invalid
      event.preventDefault();
    }
  }

  setAmountGms = (event)  => {
    let amountError = false;
    let weightError = false;
    let amount = '', weight = '';
    let inputData = {};

    let eventName,eventValue;
    if(event.target) {
      eventName  = event.target.name;
      eventValue =  event.target.value;
    } else if(event.event) {
      eventName  = event.event.name;
      eventValue =  event.event.value;
    } else {
      return;
    }

    eventValue = eventValue.toString();

    if(eventName === 'weight') {
      weight = (eventValue).replace(/in gm /g, "");
      weight = (weight).replace(/in gm/g, "");
    }

    if(eventName === 'amount') {
      eventValue = (eventValue).replace(/,/g, "");
      eventValue = eventValue.replace(/₹/g, "");
      amount = eventValue
    }

    if (eventName === 'amount' && eventValue) {
      inputData = calculate_gold_wt_buy(this.state.buyData, amount);
      weight = inputData.weight;
    } else if (eventName === 'weight' && eventValue) {
      inputData = calculate_gold_amount_buy(this.state.buyData, weight);
      amount = inputData.amount;
    } else {
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
    buyData.inputMode = this.state.isAmount ? 'amount' : 'weight';
    storageService().setObject('buyData', buyData);

    setBuyDataAfterUpdate(inputData);

    this.setState({
      amountError: amountError,
      weightError: weightError,
      amount: amount,
      weight: weight,
      buyData: buyData
    })
  };

  updateChild = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  chooseTabs() {
    this.setState({
      isAmount: !this.state.isAmount
    })
  }

  addPlusItems =(value) => {
    let event = {};
    if(this.state.isAmount) {
      event.name  = 'amount';
      event.value = parseFloat(this.state.amount || 0) + value;
    } else {
      event.name  = 'weight';
      event.value = parseFloat(this.state.weight || 0) + value;
    }

    this.setAmountGms({event : event});

  }

  renderPlusOptions = (props, index) =>{
    return(
      <div onClick={() => this.addPlusItems(props)} key={index} className="plus-tile">
        +{props}
      </div>
    );
  }

  showHideSteps() {
    this.setState({
      showSteps: !this.state.showSteps
    })
  }

  renderInfoSteps =(props, index) => {
    return(
      <div key={index} className="tile">
        <img className="icon" 
        src={require(`assets/${this.state.productName}/${props.icon}.svg`)} alt="Gold" />
        <div className="content">
          {props.content}
        </div>
      </div>
    );
  }

  render() {
    return (
      <Container
        noFooter={true}
        headerType="provider-filter"
        showLoader={this.state.show_loader}
        title={'Buy gold: ' + this.state.gold_providers[this.state.provider].title}
        handleClick={this.handleClick}
        updateChild={this.updateChild}
        buttonTitle="Proceed"
        events={this.sendEvents('just_set_events')}
      >

        <GoldProviderFilter parent={this} />

        <div className="gold-buy-home" id="goldSection">
          <GoldLivePrice parent={this} />
            <div className="gold-aw-inputs">
              <div className="gold-aw-tabs">
                <div onClick={() => this.chooseTabs()} className={`gold-aw-tab ${this.state.isAmount ? 'selected': ''}`}>
                  Enter in INR
                </div>
                <div onClick={() => this.chooseTabs()} className={`gold-aw-tab ${!this.state.isAmount ? 'selected': ''}`}>
                  Enter in gms
                </div>
              </div>
              
              <FormControl fullWidth>
               
                <div className="InputField">
                {this.state.isAmount &&
                  <div >
                    <div>
                      <TextField
                          type="text"
                          autoComplete="off"
                          name="amount"
                          id="amount"
                          disabled={!this.state.openOnloadModal}
                          onChange={(event) => this.setAmountGms(event)}
                          onKeyPress={this.handleKeyChange('amount')}
                          value={formatAmountInr(this.state.amount || '')}
                        />

                        <label className="gold-placeholder-right">= {this.state.weight} gms</label>
                      </div>
                      <div className={'input-below-text ' + (this.state.amountError ? 'error' : '')}>
                        Min {inrFormatDecimal2(this.state.minAmount)}</div>
                  </div>
                }

                {!this.state.isAmount &&
                  <div >
                    <div>
                        <TextField
                          type="text"
                          autoComplete="off"
                          label=""
                          name="weight"
                          id="weight"
                          disabled={!this.state.openOnloadModal}
                          onChange={(event) => this.setAmountGms(event)}
                          onKeyPress={this.handleKeyChange('weight')}
                          value={formatGms(this.state.weight || '')}
                        />

                        <label className="gold-placeholder-right">= {inrFormatDecimal2(this.state.amount || '')}</label>
                      </div>
                      <div className={'input-below-text ' + (this.state.weightError ? 'error' : '')}>
                        Max {this.state.maxWeight} gm</div>
                  </div>
                }
                  
                </div>
              </FormControl>

              <div>

                  {this.state.isAmount && 
                  <div className="plus-options">
                    {plusOptionsAmount.map(this.renderPlusOptions)}
                  </div>}
                  {!this.state.isAmount && 
                  <div className="plus-options">
                    {plusOptionsWeight.map(this.renderPlusOptions)}
                  </div>}
                  <Button fullWidth={true} variant="raised"
                      size="large" onClick={this.handleClick} color="secondary" autoFocus>
                    Pay {inrFormatDecimal2(this.state.amount || 0)}
                  </Button>

                  <div style={{color: '#767E86', fontSize:8,margin: '7px 0 0 0'}}>
                  *Inclusive of 3% GST | can only be sold after 24 hours
                  </div>
              </div>
            </div>

            <div className="page-title">
            Benefits of digital gold at fisdom
            </div>

            <div className="gold-buy-info-images">
              <div className="tile">
                <img className="img"
                 src={ require(`assets/${this.state.productName}/ic_purity.svg`)} alt="Gold" />
                <div className="title">
                  Affordability
                </div>
              </div>
              <div className="tile">
                <img className="img"
                 src={ require(`assets/${this.state.productName}/ic_benefit_gold.svg`)} alt="Gold" />
                <div className="title">
                Easy sell or conversion
                </div>
              </div>
              <div className="tile">
                <img className="img"
                 src={ require(`assets/${this.state.productName}/ic_purity.svg`)} alt="Gold" />
                <div className="title">
                100% insured & secured
                </div>
              </div>
            </div>

            <div className="gold-how-steps" onClick={() => this.showHideSteps()}>
                <div className="top-tile">
                  <div className="top-title">
                  How to buy digital gold?
                  </div>
                  <div className="top-icon">
                    <img src={ require(`assets/${this.state.showSteps ? 'minus_icon' : 'plus_icon'}.svg`)} alt="Gold" />
                  </div>
                </div>


              {this.state.showSteps &&
                <div className='gold-steps-images'>
                 {stepsContentMapper.map(this.renderInfoSteps)}
                </div>
              }
            </div>


            <GoldBottomSecureInfo />
          
        </div>


        {this.state.proceedForOrder &&
          <PlaceBuyOrder parent={this} />
        }

        <PriceChangeDialog parent={this} />


        {this.state.openRefreshModule &&
          <RefreshBuyPrice parent={this} />}

        {this.state.fetchLivePrice &&
          <RefreshBuyPrice parent={this} />}

        {this.state.openOnloadModal &&
          <GoldOnloadAndTimer parent={this} />}
      </Container>
    );
  }
}

export default GoldBuyHome;
