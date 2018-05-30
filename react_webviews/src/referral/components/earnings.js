import React, { Component } from 'react';

import Container from '../common/Container';
import wallet from 'assets/earning_wallet_icon.png';
import divider from 'assets/or_line.png';
import Button from 'material-ui/Button';
import Grid from '@material-ui/core/Grid';
import { getAcronym } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import axios from 'axios';

class Earnings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      data: [],
      amount_per_referral: 0,
      campaign_expiry_date: '',
      refer_message_1: '',
      refer_message_2: '',
      referral_code: '',
      type_of_referee_identifier: '',
      total_earnings: 0.00
    }
  }

  componentDidMount() {
    axios.all([
      axios.get('/api/referral/v2/listreferees/mine'),
      axios.get('/api/referral/v2/getactivecampaign/mine')
    ])
    .then(axios.spread((listRes, campaignRes) => {
      const { data } = listRes.data.pfwresponse.result;
      const { amount_per_referral, campaign_expiry_date, refer_message_1, refer_message_2, referral_code, type_of_referee_identifier, total_earnings } = campaignRes.data.pfwresponse.result;

      this.setState({
        show_loader: false,
        data,
        amount_per_referral,
        campaign_expiry_date,
        refer_message_1,
        refer_message_2,
        referral_code,
        type_of_referee_identifier,
        total_earnings
      });

      let eventObj = {
        "event_name": "earnings_view",
        "properties": {
          "earnings_value": total_earnings,
          "list_size": data.length
        }
      };

      nativeCallback({ events: eventObj });
    }, error => {
      this.setState({show_loader: false});
      console.log(error);
    }))
    .catch(error => {
      this.setState({show_loader: false});
      console.log(error);
    });
  }

  capitalize = (string) => {
    return string.toLowerCase().replace(/(^|\s)[a-z]/g,function(f){return f.toUpperCase();})
  }

  shareHandler = () => {
    let message = 'Try out fisdom: a simple app to make smart investments with zero paperwork! Use my referral code '+this.state.referral_code.toUpperCase()+'. Click here to download: http://m.onelink.me/32660e84';
    let eventObj = {
      "event_name": "share_clicked",
      "properties": {
        "where": "earnings",
        "earnings_value": this.state.total_earnings
      }
    };

    nativeCallback({ action: 'share', message: { message: message }, events: eventObj });
  }

  remindHandler = (length, item, index) => {
    let message = 'Hey, looks like you have downloaded the fisdom app but have not started investing yet. Waiting will cost you severely in potential returns so begin today! Tap: http://m.onelink.me/32660e84';
    let eventObj = {
      "event_name": "remind_clicked",
      "properties": {
        "list_no": index + 1,
        "application_status": item.application_status,
        "intial_kyc_status": item.initial_kyc_status,
        "earnings_value": this.state.total_earnings,
        "list_size": length
      }
    };

    nativeCallback({ action: 'remind', message: { message: message }, events: eventObj });
  }

  renderAction = (length, item, index) => {
    if (item.investment_status === 'pending') {
      return <h3 onClick={() => this.remindHandler(length, item, index)} className="action">Remind</h3>;
    }
    if (item.investment_status === 'success') {
      return <h3 className="action GreyText">Invested</h3>
    }
  }

  renderIcon = (item) => {
    if (item.type_of_referee_identifier === 'name') {
      return (
        <div className={`icon ${(item.investment_status === 'success' && item.earning > 0) ? 'DarkGreyBackground' : ''}`}><span>{getAcronym(item.referee_name.toUpperCase())}</span></div>
      );
    } else if (item.type_of_referee_identifier === 'email') {
      return (
        <div className={`icon ${(item.investment_status === 'success' && item.earning > 0) ? 'DarkGreyBackground' : ''}`}><span>@</span></div>
      );

    } else if (item.type_of_referee_identifier === 'mobile') {
      return (
        <div className={`icon ${(item.investment_status === 'success' && item.earning > 0) ? 'DarkGreyBackground' : ''}`}><span>{item.referee_name.slice(-2)}</span></div>
      );
    }
  }

  renderList = () => {
    const dataLength = this.state.data.filter(item => item.investment_status === 'pending' );

    return this.state.data.map((item, i) =>
      <div className="Item" key={i}>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={3}>
            {this.renderIcon(item)}
          </Grid>
          <Grid item xs={6}>
            <span className="name">{this.capitalize((item.referee_name.length > 15) ? item.referee_name.substring(0,15)+'...' : item.referee_name)}</span>
          </Grid>
          <Grid item xs={3}>
            {this.renderAction(dataLength, item, i)}
          </Grid>
        </Grid>
      </div>
    );
  }

  renderFandF = () => {
    return (
      <div className="FandF">
        <h1>Refer your family and friends</h1>
        <p>& get <span className="BoldText">₹{this.state.amount_per_referral}</span> in Paytm after their first investment</p>
        <div className="Share">
          <p>Share your code</p>
          <h2>{this.state.referral_code}</h2>
        </div>
        <div className="ShareButton">
          <Button
            disableRipple={true}
            disableFocusRipple={true}
            fullWidth={true}
            variant="raised"
            size="large"
            color="secondary"
            onClick={this.shareHandler} >
            Share Now
          </Button>
        </div>
      </div>
    );
  }

  renderData = () => {
    // eslint-disable-next-line
    if (this.state.total_earnings == 0 && this.state.data.length == 0) {
      return (
        <div className="ReferDetails">
          <div className="Refer pad15">
            <div>
              <h1>{this.state.refer_message_1}</h1>
              <p>
                {this.state.refer_message_2}
              </p>
              <div className="Share">
                <p>Share your code</p>
                <h2>{this.state.referral_code}</h2>
              </div>
              <div className="ShareButton">
                <Button
                  disableRipple={true}
                  disableFocusRipple={true}
                  fullWidth={true}
                  variant="raised"
                  size="large"
                  color="secondary"
                  onClick={this.shareHandler} >
                  Share Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // eslint-disable-next-line
    if (this.state.total_earnings == 0 && this.state.data.length > 0) {
      return (
        <div className="List pad15">
          <h1>Remind and Earn</h1>
          <p>Remind your friends and family to invest with Fisdom and you get ₹{this.state.amount_per_referral} when they invest.</p>
          <div className="Referres">
            {this.renderList()}
          </div>
          <img src={divider} alt="" />
          {this.renderFandF()}
        </div>
      );
    }
    if (this.state.total_earnings > 0 && this.state.data.length > 0) {
      return (
        <div className="List pad15">
          <h1>Earn more</h1>
          <p>by reminding your friends who already signed up on fisdom with your code</p>
          <div className="Referres">
            {this.renderList()}
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={'Earnings'}
        >
        <div className="Earning">
          <div className={`ReferPaytmGrid pad25 GreyBackground ${(this.state.total_earnings > 0) ? '' : 'EarningsPaytmGrid'}`}>
            <Grid container spacing={24} alignItems="center">
              <Grid item xs={3}>
                <img src={wallet} alt="" />
              </Grid>
              <Grid item xs={9}>
                <p><span className="blue">Pay</span><span className="blue_light">tm</span> earnings</p>
                <h1><span>₹</span>{this.state.total_earnings}</h1>
              </Grid>
            </Grid>
          </div>
          {this.renderData()}
        </div>
      </Container>
    );
  }
}

export default Earnings;
