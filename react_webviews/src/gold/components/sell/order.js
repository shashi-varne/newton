import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import stopwatch from 'assets/stopwatch.png';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openDialog: false,
      openPopup: false,
      minutes: "",
      seconds: "",
      timeAvailable: "",
      sellData: {},
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
    }
    this.countdown = this.countdown.bind(this);
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
    let timeAvailable = window.localStorage.getItem('timeAvailableSell');
    console.log(timeAvailable);

    let sellData = JSON.parse(window.localStorage.getItem('sellData'));
    console.log(sellData);
    this.setState({
      timeAvailable: timeAvailable,
      sellData: sellData
    })
    if (timeAvailable >= 0 && sellData) {
      this.countdown(timeAvailable);
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  countdown(timeAvailable) {
    if (timeAvailable <= 0) {
      this.setState({
        minutes: '',
        seconds: ''
      })
      // window.location.reload();
      return;
    }
    setTimeout(
      function () {
        let minutes = Math.floor(timeAvailable / 60);
        let seconds = Math.floor(timeAvailable - minutes * 60);
        --timeAvailable;
        this.setState({
          timeAvailable: timeAvailable,
          minutes: minutes,
          seconds: seconds
        })
        window.localStorage.setItem('timeAvailableSell', timeAvailable);
        this.countdown(timeAvailable);
      }
        .bind(this),
      1000
    );
  };

  handleClick = async () => {
    var options = {
      "plutus_rate_id": this.state.sellData.plutus_rate_id,
      "sell_price": this.state.sellData.amount,
      'account_number': this.state.sellData.account_number,
      'ifsc_code': this.state.sellData.ifsc_code
    }

    this.setState({
      show_loader: true,
    });

    Api.post('/api/gold/user/sell/confirm', options).then(res => {
      if (res.pfwresponse.status_code == 200) {
        let result = res.pfwresponse.result;
        var sellDetails = result.sell_confirmation_info;
        var options2 = {
          orderType: 'sell',
          weight: sellDetails.gold_weight,
          status: sellDetails.provider_sell_order_status,
          message: result.message
        }
        window.localStorage.setItem('sellDetails', JSON.stringify(sellDetails));
        this.navigate('/gold/sell/payment/' + sellDetails.provider_sell_order_status)
        // $state.go('gold-payment-callback', options2);
        this.setState({
          show_loader: false,
        });
      } else if (res.pfwresponse.result.is_gold_rate_changed) {
        let new_rate = res.pfwresponse.result.new_rate;
        let amountUpdated, weightUpdated;
        let sellData = this.state.sellData;
        if (sellData.isAmount) {
          amountUpdated = sellData.amount;
          weightUpdated = (sellData.amount) * (new_rate.plutus_rate);
        } else {
          weightUpdated = sellData.weight;
          amountUpdated = (sellData.weight) / (new_rate.plutus_rate);
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
          show_loader: false, openDialog: true,
          apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
        });
      }

    }).catch(error => {
      this.setState({ show_loader: false });
      console.log(error);
    });

  }
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

        {this.state.sellData.isAmount &&
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
        {!this.state.sellData.isAmount &&
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

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Sell Gold"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <div className="order-tile">
          <div className="FlexRow order-heading">
            <div className="order-tile-head">
              Sell Order Summary
            </div>
            <div className="">
              <div className="stopwatch-title">Price valid for </div>
              <div className="FlexRow stopwatch">
                <img className="stopwatch-order" src={stopwatch} width="15" />
                <span className="timer">{this.state.minutes}:{this.state.seconds}</span>
              </div>
            </div>
          </div>
          <div className="order-tile2">
            <span className="order-tile-total1">Net Sell Value</span>
            <span className="float-right order-tile-total1">{this.state.sellData.amount}</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Gold grams to be deducted from your vault</span>
            <span className="float-right order-tile-other-text">{this.state.sellData.weight} gm</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Rate</span>
            <span className="float-right order-tile-other-text">{this.state.sellData.plutus_rate}/gm</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Bank Account Number</span>
            <span className="float-right order-tile-other-text">{this.state.sellData.account_number}</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">IFSC Code</span>
            <span className="float-right order-tile-other-text">{this.state.sellData.ifsc_code}</span>
          </div>
        </div>
        {this.renderResponseDialog()}
        {this.renderPopup()}
      </Container>
    );
  }
}

export default About;
