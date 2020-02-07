import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { inrFormatDecimal } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import { default_provider} from  '../../constants';
import {storageService} from "utils/validators";

class GoldSellHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openPopup: false,
      popupText: '',
      apiError: '',
      goldInfo: {},
      userInfo: {},
      goldSellInfo: {},
      gold_products: [],
      maxWeight: '',
      maxAmount: '',
      isRegistered: false,
      isWeight: false,
      isAmount: false,
      amountError: false,
      weightError: false,
      weight: '',
      amount: '',
      params: qs.parse(props.history.location.search.slice(1)),
      value: 0,
      error: false,
      errorMessage: '',
      countdownInterval: null,
      provider: storageService().get('gold_provider') || default_provider
    }
  }


  async componentDidMount() {
    this.setState({
      error: false,
      errorMessage: ''
    });

    try {

      const res = await Api.get('/api/gold/user/account');
      if (res.pfwresponse.status_code === 200) {
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
          isRegistered: isRegistered
        });
      } else {
        this.setState({
          error: true,
          errorMessage: res.pfwresponse.result.error || res.pfwresponse.result.message ||
            'Something went wrong'
        });
        
      }

      const res2 = await Api.get('/api/gold/sell/currentprice');
      if (res2.pfwresponse.status_code === 200) {
        let goldInfo = this.state.goldInfo;
        let result = res2.pfwresponse.result;
        var currentDate = new Date();
        let timeAvailable = ((result.sell_info.rate_validity - currentDate.getTime()) / 1000 - 330 * 60);
        goldInfo.sell_value = ((result.sell_info.plutus_rate) * (goldInfo.gold_balance || 0)).toFixed(2) || 0;
        this.setState({
          goldSellInfo: result.sell_info,
          goldInfo: goldInfo,
          timeAvailable: timeAvailable
        });

        if (timeAvailable >= 0 && result.sell_info.plutus_rate) {
          let intervalId = setInterval(this.countdown, 1000);
          this.setState({
            countdownInterval: intervalId
          });
        }
      } else {
        this.setState({
          error: true,
          errorMessage: res2.pfwresponse.result.error || res2.pfwresponse.result.message ||
            'Something went wrong'
        });
        
      }

      const res3 = await Api.get('/api/gold/user/sell/balance');

      if (res3.pfwresponse.status_code === 200) {

        let result = res3.pfwresponse.result;
        
        let maxWeight = parseFloat(result.sellable_gold_balance || 0).toFixed(4);
        let maxAmount = ((this.state.goldSellInfo.plutus_rate) * (maxWeight || 0)).toFixed(2);
        let weightDiffrence = this.state.goldInfo.gold_balance - maxWeight;
        let sellWeightDiffrence = false;
        if(weightDiffrence > 0) {
          sellWeightDiffrence = true
        }
        this.setState({
          maxWeight: maxWeight,
          maxAmount: maxAmount,
          sellWeightDiffrence: sellWeightDiffrence
        });
      } else {
        this.setState({
          error: true,
          errorMessage: res3.pfwresponse.result.error || res3.pfwresponse.result.message ||
            'Something went wrong'
        });
        
      }
    
    } catch (err) {
      this.setState({
        show_loader: false,
        error: true,
        errorMessage: 'Something went wrong'
      });
    }

    this.setState({
      show_loader: false
    });
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
    });
    window.localStorage.setItem('timeAvailableSell', timeAvailable);
  };

  calculate_gold_wt(current_gold_price, tax, buy_price) {
    tax = 1.0 + parseFloat(tax) / 100.0
    var current_gold_price_with_tax = (current_gold_price * tax).toFixed(2);
    var gold_wt = (buy_price / current_gold_price_with_tax).toFixed(4);
    return gold_wt

  }

  calculate_gold_amount(current_gold_price, tax, weight) {
    tax = 1.0 + parseFloat(tax) / 100.0
    var current_gold_price_with_tax = (current_gold_price * tax).toFixed(2)
    var gold_amount = (weight * current_gold_price_with_tax).toFixed(2);
    return gold_amount
  }

  sendEvents(user_action, product_name) {
    let eventObj = {
      "event_name": 'GOLD',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Gold Locker',
        "trade": this.state.value === 0 ? 'sell' : 'delivery',
        "amount": this.state.amountError ? 'invalid' : this.state.amount ? 'valid' : 'empty',
        "weight": this.state.weightError ? 'invalid' : this.state.weight ? 'valid' : 'empty',
        "product_name": product_name
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  sellGold = async () => {

    this.sendEvents('next');

    let amount = this.state.amount;
    let weight = this.state.weight;
    if (!weight || weight < 0) {
      toast('Please enter a correct value for the weight', 'error');
      return;
    }

    if (!amount || amount < 0) {
      toast('Please enter a correct value for the amount', 'error');
      return;
    }

    if (amount >= 0 && amount < 1) {
      toast('Minimum amount should be Rs. 1', 'error');
      return;
    }

    if (amount > parseFloat(this.state.maxAmount) ||
      weight > parseFloat(this.state.maxWeight)) {
      toast("You don't have enough gold", 'error');
      return;
    }

    let goldSellInfo = this.state.goldSellInfo;
    goldSellInfo.amount = amount;
    goldSellInfo.weight = weight;
    goldSellInfo.isAmount = this.state.isAmount;

    this.setState({
      show_loader: true,
      goldSellInfo: goldSellInfo
    });

    window.localStorage.setItem('timeAvailableSell', this.state.timeAvailable);
    window.localStorage.setItem('sellData', JSON.stringify(goldSellInfo));

    this.setState({
      show_loader: false
    });
    this.navigate(this.state.provider + '/bank-details');
  }

  selectGoldProduct(index) {
    this.sendEvents('next', this.state.gold_products[index].disc);
    let selectedProduct = this.state.gold_products[index];
    window.localStorage.setItem('goldProduct', JSON.stringify(selectedProduct));
    this.navigate(this.state.provider + '/select-gold-product');
  };


  handleClose = () => {
    this.setState({
      openPopup: false
    });
  }

  navigate = (pathname) => {
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
    if (event.target.name === 'amount' && event.target.value) {
      amount = Math.floor(event.target.value);
      isWeight = false;
      isAmount = true;
      weight = ((amount) / (this.state.goldSellInfo.plutus_rate)).toFixed(4);

    } else if (event.target.name === 'weight' && event.target.value) {
      weight = event.target.value;
      amount = ((this.state.goldSellInfo.plutus_rate) * (weight)).toFixed(2);
      isWeight = true;
      isAmount = false;
    } else {
      isWeight = false;
      isAmount = false;
      amount = '';
      weight = '';
    }

    if (!weight || parseFloat(weight) < 0 ||
      parseFloat(weight) > this.state.maxWeight) {
      weightError = true;
    }

    if (!amount || parseFloat(amount) < 0) {
      amountError = true;
    }

    if (amount >= 0 && parseFloat(amount) < 1) {
      amountError = true;
    }

    if (parseFloat(amount) > parseFloat(this.state.maxAmount) ||
      parseFloat(weight) > parseFloat(this.state.maxWeight)) {
      amountError = true;
    }

    this.setState({
      isWeight: isWeight,
      isAmount: isAmount,
      amountError: amountError,
      weightError: weightError,
      amount: amount,
      weight: weight
    })
  };


  render() {

    return (
      <Container
        showLoader={this.state.show_loader}
        title="My 24K Safegold Locker"
        edit={this.props.edit}
        buttonTitle="Proceed"
        handleClick={this.sellGold}
        noPadding={true}
        disable={!this.state.isRegistered}
        noFooter={this.state.value === 1}
        events={this.sendEvents('just_set_events')}
      >
        {/* <div className="FlexRow locker-head">
          <div className="FlexRow block1">
            <img alt="Gold" className="img-mygold" src={safegold_logo} width="35" style={{ marginRight: 10 }} />
            <div>
              <div className="grey-color" style={{ marginBottom: 5 }}>Gold Quantity</div>
              <div>{this.state.goldInfo.gold_balance || 0} gm</div>
            </div>
          </div>
          <div className="block2">
            <div className="grey-color" style={{ marginBottom: 5 }}>Gold Value</div>
            <div>{inrFormatDecimal(this.state.goldInfo.sell_value || 0)}</div>
          </div>
        </div> */}
       
        <div className="page home container-padding" id="goldSection">
          <div className="page-body-gold" id="goldInput">
            <div className="buy-info1">
              <div className="FlexRow">
                <span className="buy-info2a">Current Sell Price</span>
                <span className="buy-info2b">Price valid for
                  &nbsp;<span className="timer-green">{this.state.minutes}:{this.state.seconds}</span>
                </span>
              </div>
              <div className="buy-info3">
                {inrFormatDecimal(this.state.goldSellInfo.plutus_rate)}/gm
              </div>
            </div>
            <div className="buy-input">
              <div className="buy-input1">
                Enter amount of gold you want to sell
              </div>
              <div className="label">
                <div className="FlexRow">
                  <div>
                    <div>
                      <div className="input-above-text">In Rupees (₹)</div>
                      <div className="input-box InputField">
                        <input type="number" autoComplete="off" placeholder="Amount" name="amount"
                          onChange={this.setAmountGms()} value={this.state.amount} disabled={!this.state.isRegistered || this.state.isWeight} />
                      </div>
                    </div>
                  {this.state.isRegistered &&  <div className={'input-below-text ' + (this.state.amountError ? 'error' : '')}
                    >Min ₹1.00 {this.state.sellWeightDiffrence && <span>*</span>}
                    {this.state.maxAmount > 1 &&<span>- Max ₹ {this.state.maxAmount}</span>}
                    </div>}
                  </div>
                  <div className="symbol">
                    =
                  </div>
                  <div>
                    <div className="input-above-text">In Grams (gm)</div>
                    <div className="input-box InputField">
                      <input type="number" autoComplete="off" placeholder="Weight" name="weight"
                        onChange={this.setAmountGms()} value={this.state.weight} disabled={!this.state.isRegistered || this.state.isAmount} />
                    </div>
                   {this.state.isRegistered && <div className={'input-below-text ' + (this.state.weightError ? 'error' : '')}>
                      {this.state.sellWeightDiffrence && <span>*</span>}Max {this.state.maxWeight} gm
                      </div>}
                  </div>
                </div>
                {this.state.sellWeightDiffrence && <div style={{ margin: '30px 0 0 0' }}>
                  <div style={{ margin: '0 0 4px 0', color: '#6F6F6F', fontSize: 11, fontWeight: 600 }}>
                    *Why is my Max Amount/Weight less than Locker quantity?
                  </div>
                  <div style={{ color: '#838383', fontSize: 10, fontWeight: 400 }}>
                    You can sell your purchases after 7 days i.e. If you buy gold today you can sell anytime
                    after 7 days have elapsed
                  </div>
                </div>}
              </div>
            </div>
          </div>
          </div>
      </Container>
    );
  }
}

export default GoldSellHome;
