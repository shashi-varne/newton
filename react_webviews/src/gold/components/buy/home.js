import React, { Component } from 'react';
import qs from 'qs';

// import { FormControl } from 'material-ui/Form';
// import Input from '../../../common/ui/Input';
import Container from '../../common/Container';
import Api from 'utils/api';
import { inrFormatDecimal, storageService } from 'utils/validators';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { stateMapper, default_provider, gold_providers} from  '../../constants';
import PlaceBuyOrder from '../ui_components/place_buy_order';
import PriceChangeDialog from '../ui_components/price_change_dialog';
import RefreshBuyPrice from '../ui_components/buy_price';
import { inrFormatDecimal2 } from 'utils/validators';
import GoldLivePrice from '../ui_components/live_price';
import {calculate_gold_amount_buy, calculate_gold_wt_buy, setBuyDataAfterUpdate} from '../../constants';

import GoldProviderFilter from '../ui_components/provider_filter';

class GoldBuyHome extends Component {
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
      offerImageData: [],
      openPriceChangedDialog: false,
      fetchLivePrice: true,
      provider: storageService().get('gold_provider') || default_provider,
      gold_providers: gold_providers,
      redirect_state: 'buy-home',
      orderType: 'buy'
    }

    this.refreshData = this.refreshData.bind(this);
    this.updateChild = this.updateChild.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.state.countdownInterval);
  }

  countdown = () => {

    let buyData = storageService().getObject('buyData');
    
    let timeAvailable = buyData.timeAvailable;
    if (timeAvailable <= 0) {
      this.setState({
        minutes: 0,
        seconds: 0,
        openPriceChangedDialog: true,
        live_price: '',
        timeAvailable: timeAvailable || 0
      })

      storageService().set('forceBackState', stateMapper['buy-home']);

      return;
    }

    let minutes = Math.floor(timeAvailable / 60);
    let seconds = Math.floor(timeAvailable - minutes * 60);
    timeAvailable--;
    buyData.timeAvailable = timeAvailable;

    this.setState({
      timeAvailable: timeAvailable,
      minutes: minutes,
      seconds: seconds,
      buyData: buyData
    })
    
    storageService().setObject('buyData', buyData);
   
  };


  startTimer(buyData) {
    if (buyData) {
      let intervalId = setInterval(this.countdown, 1000);
      this.setState({
        countdownInterval: intervalId,
        show_loader: false
      });
    }
  }

  onload() {

    storageService().remove('forceBackState');

    let buyData = storageService().getObject('buyData');
    this.setState({
      buyData: buyData,
      live_price: buyData.goldBuyInfo.plutus_rate,
      openRefreshModule: false,
      timeAvailable: buyData.timeAvailable || 0
    })
    this.startTimer(buyData);


    let priceChangeDialogData = {
      buttonData: {
        leftTitle: 'To buy gold worth',
        leftSubtitle: inrFormatDecimal2(buyData.amount_selected),
        leftArrow: 'down',
        provider: 'safegold'
      },
      buttonTitle: "REFRESH",
      content1: [
        { 'name': 'Buy price for <b>0.014</b> gms', 'value': inrFormatDecimal2(buyData.base_amount) },
        { 'name': 'GST', 'value': inrFormatDecimal2(buyData.gst_amount) }
      ],
      content2: [
        { 'name': 'Total', 'value': inrFormatDecimal2(buyData.total_amount) }
      ]
    }



    this.setState({
      show_loader: false,
      goldBuyInfo: buyData.goldBuyInfo,
      timeAvailable: buyData.timeAvailable,
      minAmount: buyData.goldBuyInfo.minimum_buy_price,
      buyData: buyData,
      priceChangeDialogData: priceChangeDialogData
    });

    if (this.state.buyData) {
      let intervalId = setInterval(this.countdown, 1000);
      this.setState({
        countdownInterval: intervalId
      });
    }

  }

  updateParent(key, value) {
    this.setState({
      [key]: value
    })
  }

  refreshData () {

    if(this.state.timeAvailable > 0) {
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

    if(this.state.openPriceChangedDialog && this.state.timeAvailable >0) {
      this.setState({
        openPriceChangedDialog: false
      })
    }
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

  updateChild(key, value) {
    this.setState({
      [key] : value
    })
  }

  render() {
    return (
      <Container
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
          <div className="page-body-gold container-padding" id="goldInput">
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
            </div>
          </div>
        </div>
        {this.state.proceedForOrder && 
          <PlaceBuyOrder parent={this} />
        }

        <PriceChangeDialog parent={this} />
        {this.state.openRefreshModule &&
         <RefreshBuyPrice parent={this} />}

        {this.state.fetchLivePrice && 
        <RefreshBuyPrice parent={this} />}
      </Container>
    );
  }
}

export default GoldBuyHome;
