import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { inrFormatDecimal } from 'utils/validators';
import safegold_logo from 'assets/safegold_logo_60x60.png';
import arrow from 'assets/arrow.png';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { ToastContainer } from 'react-toastify';
import toast from '../../ui/Toast';

class GoldSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openResponseDialog: false,
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
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      countdownInterval: null
    }
  }

  componentWillMount() {
    if (this.state.ismyway) {
      this.setState({
        type: 'myway'
      });
    } else if (this.state.isPrime) {
      this.setState({
        type: 'Fisdom Prime'
      });
    } else {
      this.setState({
        type: 'fisdom'
      });
    }
  }

  async componentDidMount() {
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
          // show_loader: false,
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
      if (res2.pfwresponse.status_code === 200) {
        let goldInfo = this.state.goldInfo;
        let result = res2.pfwresponse.result;
        goldInfo.sell_value = ((result.sell_info.plutus_rate) * (goldInfo.gold_balance || 0)).toFixed(2) || 0;
        this.setState({
          // show_loader: false,
          goldSellInfo: result.sell_info,
          goldInfo: goldInfo
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res2.pfwresponse.result.error || res2.pfwresponse.result.message || 'Something went wrong', 'error');
      }


      const res3 = await Api.get('/api/gold/buy/currentprice');

      if (res3.pfwresponse.status_code === 200) {
        let result = res3.pfwresponse.result;
        let goldBuyInfo = result.buy_info;
        var currentDate = new Date();
        var validityDate = new Date(goldBuyInfo.rate_validity);
        let timeAvailable = ((validityDate.getTime() - currentDate.getTime()) / 1000);

        let amount = '', weight = '';
        if (window.localStorage.getItem('buyAmountRegister')) {

          amount = window.localStorage.getItem('buyAmountRegister');
          window.localStorage.setItem('buyAmountRegister', 0);
          weight = this.calculate_gold_wt(goldBuyInfo.plutus_rate,
            goldBuyInfo.applicable_tax, amount);
        }

        this.setState({
          show_loader: false,
          goldBuyInfo: result.buy_info,
          plutusRateID: result.buy_info.plutus_rate_id,
          amount: amount || '',
          weight: weight || '',
          timeAvailable: timeAvailable

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

  buyGold = async () => {

    if (this.state.userInfo.mobile_verified === false ||
      this.state.isRegistered === false) {
      window.localStorage.setItem('buyAmountRegister', this.state.amount);
      this.navigate('gold-register')
      return;
    }

    var options = {
      plutus_rate_id: this.state.goldBuyInfo.plutus_rate_id,
      buy_price: parseFloat(this.state.amount)
    }

    if (parseFloat(this.state.weight) > this.state.maxWeight) {
      toast('You can not buy more than ' + this.state.maxWeight + ' gm', 'error');
      return;
    }

    if (!parseFloat(this.state.weight) || parseFloat(this.state.weight) < 0) {
      toast('Please enter a correct value for the weight', 'error');
      return;
    }

    if (!parseFloat(this.state.amount) || parseFloat(this.state.amount) < 0) {
      toast('Please enter a correct value for the amount', 'error');
      return;
    }

    if (parseFloat(this.state.amount) >= 0 && parseFloat(this.state.amount) < 1) {
      toast('Minimum amount should be Rs. 1', 'error');
      return;
    }

    this.setState({
      show_loader: true
    });

    try {

      const res = await Api.post('/api/gold/user/buy/verify', options);

      if (res.pfwresponse.status_code === 200 &&
        res.pfwresponse.result.payment_details.plutus_rate === this.state.goldBuyInfo.plutus_rate) {
        let result = res.pfwresponse.result;
        var buyData = result.payment_details;
        window.localStorage.setItem('buyData', JSON.stringify(buyData));
        window.localStorage.setItem('timeAvailable', this.state.timeAvailable);
        window.localStorage.setItem('base_url', this.state.params.base_url);

        this.navigate('buy-gold-order');
        this.setState({
          show_loader: false,
        });
      } else if (res.pfwresponse.result.is_gold_rate_changed) {
        let new_rate = res.pfwresponse.result.new_rate;
        let amountUpdated, weightUpdated;
        if (this.state.isAmount) {
          amountUpdated = this.state.amount;
          weightUpdated = this.calculate_gold_wt(new_rate.plutus_rate,
            new_rate.applicable_tax, this.state.amount);
        } else {
          weightUpdated = this.state.weight;
          amountUpdated = this.calculate_gold_amount(new_rate.plutus_rate,
            new_rate.applicable_tax, this.state.weight);
        }
        this.setState({
          show_loader: false,
          amountUpdated: amountUpdated,
          weightUpdated: weightUpdated,
          new_rate: new_rate,
          openPopup: true
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
          'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }

  }


  handleClose = () => {
    this.setState({
      openResponseDialog: false,
      openPopup: false
    });
  }

  renderResponseDialog = () => {
    return (
      <Dialog
        open={this.state.openResponseDialog}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.state.apiError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handlePopup = () => {
    this.setState({
      openPopup: false
    });

    if (this.state.isAmount) {
      this.buyGold(this.state.new_rate.plutus_rate_id, this.state.amount);
    } else {
      this.buyGold(this.state.new_rate.plutus_rate_id, this.state.amountUpdated);
    }
  }

  renderPopup = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openPopup}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >

        {this.state.isAmount &&
          <div>
            <DialogTitle id="form-dialog-title">Confirm Updated Price</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Your checkout value has been updated to
                Rs.{this.state.amountUpdated} ({this.state.weightUpdated}gm) as the
                previous gold price has expired.
              </DialogContentText>
            </DialogContent>
          </div>
        }
        {this.state.isWeight &&
          <div>
            <DialogTitle id="form-dialog-title">Confirm Updated Weight</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Your checkout value has been updated to
              {this.state.weightUpdated}gm (Rs.{this.state.amountUpdated}) as the
                                                                                                                                                                                                                                  previous gold price has expired.
              </DialogContentText>
            </DialogContent>
          </div>
        }
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            CANCEL
          </Button>
          <Button onClick={this.handlePopup} color="primary" autoFocus>
            CONTINUE
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  navigate = (pathname) => {
    clearTimeout(this.timerHandle);
    this.timerHandle = 0;

    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
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
      weight = this.calculate_gold_wt(this.state.goldBuyInfo.plutus_rate,
        this.state.goldBuyInfo.applicable_tax, amount);
      isWeight = false;
      isAmount = true;
    } else if (event.target.name === 'weight' && event.target.value) {
      weight = event.target.value;
      amount = this.calculate_gold_amount(this.state.goldBuyInfo.plutus_rate,
        this.state.goldBuyInfo.applicable_tax, weight);
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

    if (parseFloat(amount) >= 0 && parseFloat(amount) < 1) {
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
        title="Gold Summary"
        handleClick={this.buyGold}
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
        noPadding={true}
      >
        <div className="page home" id="goldSection">
          <div className="text-center goldheader" onClick={() => this.navigate('/gold/my-gold-locker')}>
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
                  <div className="my-gold-details-header2b">{inrFormatDecimal(this.state.goldInfo.sell_value) || 0}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="page-body-gold container-padding" id="goldInput">
            <div className="buy-info1">
              <div className="FlexRow">
                <span className="buy-info2a">Current Buying Price</span>
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
              <div className="label">
                <div className="FlexRow">
                  <div>
                    <div className="input-above-text">In Rupees (₹)</div>
                    <div className="input-box InputField">
                      <input type="text" name="amount" placeholder="Amount"
                        onChange={this.setAmountGms()} value={this.state.amount} />
                    </div>
                    <div className={'input-below-text ' + (this.state.amountError ? 'error' : '')}>Min ₹1.00</div>
                  </div>
                  <div className="symbol">
                    =
                  </div>
                  <div>
                    <div className="input-above-text">In Grams (gm)</div>
                    <div className="input-box InputField">
                      <input type="text" name="weight" placeholder="Weight"
                        onChange={this.setAmountGms()} value={this.state.weight} />
                    </div>
                    <div className={'input-below-text ' + (this.state.weightError ? 'error' : '')}>Max {this.state.maxWeight} gm</div>
                  </div>
                </div>
              </div>
              <div className="disclaimer">
                Purchase amount is inclusive of 3% GST
              </div>
            </div>
          </div>
        </div>
        {this.renderResponseDialog()}
        {this.renderPopup()}
        <ToastContainer autoClose={3000} />
      </Container>
    );
  }
}

export default GoldSummary;
