import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
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
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

class GoldSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openDialog: false,
      openPopup: false,
      popupText: '',
      apiError: '',
      goldInfo: {},
      userInfo: {},
      goldSellInfo: {},
      gold_products: {},
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
      value: 0
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

  componentDidMount() {
    this.setState({
      show_loader: false,
    });

    Api.get('/api/gold/user/account').then(res => {
      if (res.pfwresponse.status_code == 200) {
        let result = res.pfwresponse.result;
        let isRegistered = true;
        if (result.gold_user_info.user_info.registration_status == "pending" ||
          !result.gold_user_info.user_info.registration_status ||
          result.gold_user_info.is_new_gold_user) {
          isRegistered = false;
        }
        this.setState({
          show_loader: false,
          goldInfo: result.gold_user_info.safegold_info,
          userInfo: result.gold_user_info.user_info,
          maxWeight: parseFloat(((30 - result.gold_user_info.safegold_info.gold_balance) || 30).toFixed(4)),
          isRegistered: isRegistered
        });
      } else {
        this.setState({
          show_loader: false, openDialog: true,
          apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
        });
      }

    }).catch(error => {
      this.setState({ show_loader: false });
      console.log(error);
    });

    Api.get('/api/gold/sell/currentprice').then(res => {
      if (res.pfwresponse.status_code == 200) {
        let goldInfo = this.state.goldInfo;
        let result = res.pfwresponse.result;
        goldInfo.sell_value = ((result.sell_info.plutus_rate) * (goldInfo.gold_balance || 0)).toFixed(2) || 0;
        this.setState({
          show_loader: false,
          goldSellInfo: result.sell_info,
          goldInfo: goldInfo
        });
      } else {
        this.setState({
          show_loader: false, openDialog: true,
          apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
        });
      }

    }).catch(error => {
      this.setState({ show_loader: false });
      console.log(error);
    });

    Api.get('/api/gold/user/sell/balance').then(res => {

      if (res.pfwresponse.status_code == 200) {
        let result = res.pfwresponse.result;
        let maxWeight = result.sellable_gold_balance || 0;
        let maxAmount = ((this.state.goldSellInfo.plutus_rate) * (maxWeight)).toFixed(2);

        this.setState({
          show_loader: false,
          maxWeight: maxWeight,
          maxAmount: maxAmount
        });
      } else {
        this.setState({
          show_loader: false, openDialog: true,
          apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
        });
      }

    }).catch(error => {
      this.setState({ show_loader: false });
      console.log(error);
    });

    Api.get('/api/gold/delivery/products').then(res => {
      if (res.pfwresponse.status_code == 200) {
        this.setState({
          show_loader: false,
          gold_products: res.pfwresponse.result.safegold_products
        });
      } else {
        this.setState({
          show_loader: false, openDialog: true,
          apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
        });
      }

    }).catch(error => {
      this.setState({ show_loader: false });
      console.log(error);
    });

  }

  countdown() {
    let timeAvailable = this.state.timeAvailable;
    if (timeAvailable <= 0) {
      this.setState({
        minutes: '',
        seconds: ''
      })
      window.location.reload();
      return;
    }

    setTimeout(
      function () {
        let minutes = Math.floor(timeAvailable / 60);
        let seconds = Math.floor(timeAvailable - minutes * 60);
        timeAvailable--;
        this.setState({
          timeAvailable: timeAvailable,
          minutes: minutes,
          seconds: seconds
        })
        this.countdown();
      }
        .bind(this),
      3000
    );
  };

  calculate_gold_wt(current_gold_price, tax, buy_price) {
    tax = 1.0 + parseFloat(tax) / 100.0
    var current_gold_price_with_tax = (current_gold_price * tax).toFixed(2);
    var gold_wt = (buy_price / current_gold_price_with_tax).toFixed(4);
    return gold_wt

  }

  calculate_gold_amount(current_gold_price, tax, weight) {
    console.log(current_gold_price);
    tax = 1.0 + parseFloat(tax) / 100.0
    var current_gold_price_with_tax = (current_gold_price * tax).toFixed(2)
    var gold_amount = (weight * current_gold_price_with_tax).toFixed(2);
    return gold_amount
  }

  buyGold = async (amount, weight) => {

    if (!weight || weight < 0) {
      // toast('Please enter a correct value for the weight');
      return;
    }

    if (!amount || amount < 0) {
      // toast('Please enter a correct value for the amount');
      return;
    }

    if (amount >= 0 && amount < 1) {
      // toast('Minimum amount should be Rs. 1');
      return;
    }

    if (amount > parseFloat(this.state.maxAmount) ||
      weight > parseFloat(this.state.maxWeight)) {
      // toast("You don't have enough gold");
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
    window.localStorage.setItem('sellData', goldSellInfo);

    this.navigate('bank-details');
    this.setState({
      show_loader: false
    });

  }

  selectGoldProduct(index) {
    let selectedProduct = this.state.gold_products[index];
    window.localStorage.setItem('goldProduct', selectedProduct);
    this.navigate('select-gold-product');
  };


  handleClose = () => {
    this.setState({
      openDialog: false,
      openPopup: false
    });
  }

  renderResponseDialog = () => {
    return (
      <Dialog
        open={this.state.openDialog}
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

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  }

  productImgMap = () => {
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
      <img alt="Gold" className="delivery-icon" src={prod_image_map[3]} width="80" />
    );
  }

  render() {

    return (
      <Container
        showLoader={this.state.show_loader}
        title="My 24K Safegold Locker"
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <div className="FlexRow">
          <div className="FlexRow" style={{ justifyContent: 'flex-start', flex: 1, marginRight: '2px', background: '#fff', padding: '10px' }}>
            <img className="img-mygold" src={safegold_logo} width="35" style={{ marginRight: 10 }} />
            <div>
              <div className="grey-color" style={{ marginBottom: 5 }}>Gold Quantity</div>
              <div>3.3329 gm</div>
            </div>
          </div>
          <div style={{ flex: 1, background: '#fff', padding: '10px' }}>
            <div className="grey-color" style={{ marginBottom: 5 }}>Gold Value</div>
            <div>₹ 10,498.64</div>
          </div>
        </div>
        <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Sell" />
            <Tab label="Deliver" />
          </Tabs>
          {this.state.value === 0 && <div className="page home" id="goldSection">
          <div className="page-body-gold" id="goldInput">
            <div className="buy-info1">
              <div className="FlexRow">
                <span className="buy-info2a">Current Buying Price</span>
                <span className="buy-info2b">Price valid for
                  <span className="timer-green">1:45</span>
                </span>
              </div>
              <div className="buy-info3">
                ₹ 3,998.25/gm
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
                    <div className="input-box">
                      <input type="text" placeholder="Amount" />
                    </div>
                    <div className="input-below-text">Min ₹1.00 - *Max ₹-0.757.95</div>
                  </div>
                  <div className="symbol">
                    =
                  </div>
                  <div>
                    <div className="input-above-text">In Grams (gm)</div>
                    <div className="input-box">
                      <input type="text" placeholder="Weight" />
                    </div>
                    <div className="input-below-text">*Max -0.234 gm</div>
                  </div>
                </div>
                <div className="disclaimer">
                  *You can place your order for sell/delivery after 2 working day from your buying transaction date
                </div>
              </div>
            </div>
          </div>
        </div>}
        {this.state.value === 1 && <div>
          <div className="FlexRow" style={{justifyContent: 'center', flexWrap: 'wrap'}}>
            <div className="delivery-tile">
              {this.productImgMap()}
              
              <div className="">1gm SafeGold Gold Coin</div>
              <div className="">Charges Rs. 360</div>
            </div>
            <div className="delivery-tile">
              {this.productImgMap()}
              
              <div className="">1gm SafeGold Gold Coin</div>
              <div className="">Charges Rs. 360</div>
            </div>
            <div className="delivery-tile">
              {this.productImgMap()}
              
              <div className="">1gm SafeGold Gold Coin</div>
              <div className="">Charges Rs. 360</div>
            </div>
            <div className="delivery-tile">
              {this.productImgMap()}
              
              <div className="">1gm SafeGold Gold Coin</div>
              <div className="">Charges Rs. 360</div>
            </div>
          </div>
        </div>}
        {this.renderResponseDialog()}
      </Container>
    );
  }
}

export default GoldSummary;
