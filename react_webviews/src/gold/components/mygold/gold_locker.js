import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import safegold_logo from 'assets/safegold_logo_60x60.png';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import one_gm_front from 'assets/1gm_front.png';
import two_gm_front from 'assets/2gm_front.png';
import five_gm_front from 'assets/5gm_front.png';
import five_gmbar_front from 'assets/5gmbar_front.png';
import ten_gm_front from 'assets/10gm_front.png';
import ten_gmbar_front from 'assets/10gmbar_front.png';
import twenty_gmbar_front from 'assets/20gmbar_front.png';
import ArrowRight from '@material-ui/icons/ChevronRight';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { ToastContainer } from 'react-toastify';
import toast from '../../ui/Toast';
import { inrFormatDecimal } from 'utils/validators';

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
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      value: 0,
      error: false,
      errorMessage: '',
      countdownInterval: null
    }
    this.renderDeliveryProducts = this.renderDeliveryProducts.bind(this);
  }

  componentWillMount() {
    if (this.state.params.isDelivery) {
      this.setState({
        value: 1
      });
    }
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
          maxWeight: parseFloat(result.gold_user_info.safegold_info.gold_balance).toFixed(4),
          isRegistered: isRegistered
        });
      } else {
        this.setState({
          // show_loader: false,
          error: true,
          errorMessage: res.pfwresponse.result.error || res.pfwresponse.result.message ||
            'Something went wrong'
        });
        // toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
        //   'Something went wrong', 'error');
      }

      const res2 = await Api.get('/api/gold/sell/currentprice');
      if (res2.pfwresponse.status_code === 200) {
        let goldInfo = this.state.goldInfo;
        let result = res2.pfwresponse.result;
        var currentDate = new Date();
        // var validityDate = new Date('2019-01-24 14:41:14');
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
          // show_loader: false,
          error: true,
          errorMessage: res2.pfwresponse.result.error || res2.pfwresponse.result.message ||
            'Something went wrong'
        });
        // toast(res2.pfwresponse.result.error || res2.pfwresponse.result.message ||
        //   'Something went wrong', 'error');
      }

      const res3 = await Api.get('/api/gold/user/sell/balance');

      if (res3.pfwresponse.status_code === 200) {

        // todo*
        let maxWeight = this.state.maxWeight;
        // let result = res3.pfwresponse.result;
        // let maxWeight = result.sellable_gold_balance || 0;
        let maxAmount = ((this.state.goldSellInfo.plutus_rate) * (maxWeight || 0)).toFixed(2);
        this.setState({
          // maxWeight: maxWeight,
          maxAmount: maxAmount
        });
      } else {
        this.setState({
          // show_loader: false,
          error: true,
          errorMessage: res3.pfwresponse.result.error || res3.pfwresponse.result.message ||
            'Something went wrong'
        });
        // toast(res3.pfwresponse.result.error || res3.pfwresponse.result.message ||
        //   'Something went wrong', 'error');
      }

      const res4 = await Api.get('/api/gold/delivery/products');
      if (res4.pfwresponse.status_code === 200) {
        this.setState({
          show_loader: false,
          gold_products: res4.pfwresponse.result.safegold_products
        });
      } else {
        this.setState({
          // show_loader: false,
          error: true,
          errorMessage: res4.pfwresponse.result.error || res4.pfwresponse.result.message ||
            'Something went wrong'
        });
        // toast(res4.pfwresponse.result.error || res4.pfwresponse.result.message ||
        //   'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false,
        error: true,
        errorMessage: 'Something went wrong'
      });
      // toast('Something went wrong', 'error');
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

  sellGold = async () => {

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
    this.navigate('bank-details');
  }

  selectGoldProduct(index) {
    let selectedProduct = this.state.gold_products[index];
    window.localStorage.setItem('goldProduct', JSON.stringify(selectedProduct));
    this.navigate('select-gold-product');
  };


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
          <Button onClick={this.handleClose} color={this.state.type !== 'fisdom' ? 'secondary' : 'primary'} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleChange = (event, value) => {
    this.setState({ value });
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

  productImgMap = (product) => {
    const prod_image_map = {
      2: one_gm_front,
      3: two_gm_front,
      1: five_gm_front,
      14: five_gmbar_front,
      8: ten_gm_front,
      12: ten_gmbar_front,
      15: twenty_gmbar_front,
    };

    return (
      <img alt="Gold" className="delivery-icon" src={prod_image_map[product.id]} width="80" />
    );
  }

  renderDeliveryProducts(props, index) {
    return (
      <div key={index} onClick={() => this.selectGoldProduct(index)} className="delivery-tile">
        {this.productImgMap(props)}

        <div className="">{props.description}</div>
        <div className="">Charges Rs. {props.delivery_minting_cost}</div>
      </div>
    )
  }

  render() {

    return (
      <Container
        showLoader={this.state.show_loader}
        title="My 24K Safegold Locker"
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
        handleClick={this.sellGold}
        noPadding={true}
        disable={!this.state.isRegistered}
        noFooter={this.state.value === 1}
      >
        <div className="FlexRow locker-head">
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
        </div>
        <div className="FlexRow locker-head transaction-history" onClick={() => this.navigate('gold-transactions')}>
          <div className="link">Transactions History</div>
          <div className="arrow"><ArrowRight /></div>
        </div>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor={this.state.type !== 'fisdom' ? 'secondary' : 'primary'}
          textColor={this.state.type !== 'fisdom' ? 'secondary' : 'primary'}
          variant="fullWidth"
        >
          <Tab label="Sell" />
          <Tab label="Deliver" />
        </Tabs>
        {this.state.value === 0 && <div className="page home container-padding" id="goldSection">
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
                Enter amount of gold you want to buy
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
                    <div className={'input-below-text ' + (this.state.amountError ? 'error' : '')}>Min ₹1.00-*Max ₹ {this.state.maxAmount}</div>
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
                    <div className={'input-below-text ' + (this.state.weightError ? 'error' : '')}>*Max {this.state.maxWeight} gm</div>
                  </div>
                </div>
                {/* <div className="disclaimer">
                  *You can place your order for sell/delivery after 2 working day from your buying transaction date
                </div> */}
              </div>
            </div>
          </div>
          {this.state.error && this.state.isRegistered && <p className="error">{this.state.errorMessage}</p>}
          {!this.state.isRegistered && <p className="error">Click <b><span onClick={() => this.navigate('gold-register')}>here</span></b> to register yourself for gold account</p>}
        </div>}
        {this.state.value === 1 && <div>
          <div className="FlexRow" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            {this.state.gold_products && this.state.gold_products.map(this.renderDeliveryProducts)}
          </div>
        </div>}
        {this.renderResponseDialog()}
        <ToastContainer autoClose={3000} />
      </Container>
    );
  }
}

export default GoldSummary;
