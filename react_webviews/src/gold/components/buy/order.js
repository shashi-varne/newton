import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import stopwatch from 'assets/stopwatch.png';
import { inrFormatDecimal } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';

class BuyOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openResponseDialog: false,
      minutes: "",
      seconds: "",
      buyData: {},
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      countdownInterval: null
    }
  }

  componentWillMount() {
    console.log("buy order*************");
    let buyData = JSON.parse(window.localStorage.getItem('buyData'));
    console.log(buyData);
    let timeAvailable = window.localStorage.getItem('timeAvailable');
    // let timeAvailable = 3456;
    this.setState({
      buyData: buyData,
      timeAvailable: timeAvailable
    })
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

  componentWillUnmount() {
    clearInterval(this.state.countdownInterval);
  }

  componentDidMount() {
    if (this.state.timeAvailable >= 0 && this.state.buyData) {
      let intervalId = setInterval(this.countdown, 1000);
      this.setState({
        countdownInterval: intervalId,
        show_loader: false
      });
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleClick = async () => {
    this.setState({
      show_loader: true,
    });

    let nativeRedirectUrl = window.location.protocol + '//' + window.location.host +
      '/gold/buy-gold-order?base_url=' + this.state.params.base_url;

    nativeCallback({
      action: 'take_control', message: {
        back_url: nativeRedirectUrl,
        back_text: 'Are you sure you want to exit the payment process?'
      }
    });

    let paymentRedirectUrl = encodeURIComponent(
      window.location.protocol + '//' + window.location.host + '/gold/buy/payment'
    );

    var pgLink = this.state.buyData.payment_link;
    // eslint-disable-next-line
    pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl;
    window.location = pgLink;
  }

  countdown = () => {
    let timeAvailable = this.state.timeAvailable;
    if (timeAvailable <= 0) {
      this.setState({
        minutes: '',
        seconds: ''
      })
      this.navigate('my-gold');
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
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Buy Gold"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <div>
          <div className="order-tile">
            <div className="FlexRow order-heading">
              <div className="order-tile-head">
                Order Summary
              </div>
              <div className="">
                <div className="stopwatch-title">Price valid for </div>
                <div className="FlexRow stopwatch">
                  <img alt="Gold" className="stopwatch-order" src={stopwatch} width="15" />
                  <span className="timer">{this.state.minutes}:{this.state.seconds}</span>
                </div>
              </div>
            </div>
            <div className="order-tile2">
              <span className="order-tile-total1">Total payble amount</span>
              <span className="float-right order-tile-total1">{inrFormatDecimal(this.state.buyData.total_amount || 0)}</span>
            </div>
            <div className="order-tile2">
              <span className="order-tile-other-text">Gold grams to be added to your vault</span>
              <span className="float-right order-tile-other-text">{this.state.buyData.gold_weight} gm</span>
            </div>
            <div className="order-tile2">
              <span className="order-tile-other-text">Rate</span>
              <span className="float-right order-tile-other-text">{inrFormatDecimal(this.state.buyData.plutus_rate)}/gm</span>
            </div>
            <div className="order-tile2">
              <span className="order-tile-other-text">Total GST (3%)</span>
              <span className="float-right order-tile-other-text">{inrFormatDecimal(this.state.buyData.gst_amount || 0)}</span>
            </div>
            <div className="order-tile2">
              <span className="order-tile-other-text">Net purchase amount</span>
              <span className="float-right order-tile-other-text">{inrFormatDecimal(this.state.buyData.purchase_price || 0)}</span>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default BuyOrder;
