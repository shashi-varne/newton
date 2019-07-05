import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import stopwatch from 'assets/stopwatch.png';
import { inrFormatDecimal } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

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
      type: getConfig().productName,
      countdownInterval: null
    }
  }

  componentWillMount() {
    nativeCallback({ action: 'take_control_reset' });
    let buyData = JSON.parse(window.localStorage.getItem('buyData'));
    let timeAvailable = window.localStorage.getItem('timeAvailable');
    // let timeAvailable = 3456;
    this.setState({
      buyData: buyData,
      timeAvailable: timeAvailable
    })
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
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'GOLD',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Buy Order Summary'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async () => {
    this.sendEvents('next');
    this.setState({
      show_loader: true,
    });

    let nativeRedirectUrl = window.location.origin +
      '/gold/buy-gold-order' + getConfig().searchParams;

    // nativeCallback({
    //   action: 'take_control', message: {
    //     back_url: nativeRedirectUrl,
    //     back_text: 'Are you sure you want to exit the payment process?'
    //   }
    // });

    let paymentRedirectUrl = encodeURIComponent(
      window.location.origin + '/gold/buy/payment'
    );

    var pgLink = this.state.buyData.payment_link;
    // eslint-disable-next-line
    pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl + '&back_url=' + encodeURIComponent(nativeRedirectUrl) + '&order_type=buy';
    if (getConfig().generic_callback) {
      pgLink += '&generic_callback=' + getConfig().generic_callback;
    }
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
        events={this.sendEvents('just_set_events')}
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
              <span className="float-right order-tile-total1 buy-order-tile22">{inrFormatDecimal(this.state.buyData.total_amount || 0)}</span>
            </div>
            <div className="order-tile2">
              <span className="order-tile-other-text">Gold grams to be added to your vault</span>
              <span className="float-right order-tile-other-text buy-order-tile22">{this.state.buyData.gold_weight} gm</span>
            </div>
            <div className="order-tile2">
              <span className="order-tile-other-text">Rate</span>
              <span className="float-right order-tile-other-text buy-order-tile22">{inrFormatDecimal(this.state.buyData.plutus_rate)}/gm</span>
            </div>
            <div className="order-tile2">
              <span className="order-tile-other-text">Total GST (3%)</span>
              <span className="float-right order-tile-other-text buy-order-tile22">{inrFormatDecimal(this.state.buyData.gst_amount || 0)}</span>
            </div>
            <div className="order-tile2">
              <span className="order-tile-other-text">Net purchase amount</span>
              <span className="float-right order-tile-other-text buy-order-tile22">{inrFormatDecimal(this.state.buyData.purchase_price || 0)}</span>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default BuyOrder;
