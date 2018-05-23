import React, { Component } from 'react';

import Container from '../common/Container';
import Card from '../common/Card';
import Api from 'utils/api';
import wallet from 'assets/earning_wallet_icon.png';
import gift from 'assets/refer_gift_icon.png';
import hand from 'assets/hand_icon.png';
import Button from 'material-ui/Button';
import Grid from '@material-ui/core/Grid';
import qs from 'qs';
import { nativeCallback } from 'utils/native_callback';

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      amount_per_referral: 0,
      campaign_expiry_date: '',
      refer_message_1: '',
      refer_message_2: '',
      referral_code: '',
      mobile: '',
      total_earnings: 0,
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  componentDidMount() {
    Api.get('/api/referral/v2/getactivecampaign/mine').then(res => {
      const { amount_per_referral, campaign_expiry_date, refer_message_1, refer_message_2, referral_code, mobile, total_earnings } = res.pfwresponse.result;

      this.setState({
        show_loader: false,
        amount_per_referral,
        campaign_expiry_date,
        refer_message_1,
        refer_message_2,
        referral_code,
        mobile,
        total_earnings
      });
    }).catch(error => {
      this.setState({show_loader: false});
      console.log(error);
    });
  }

  navigate = (pathname) => {
    let eventObj = {
      "event_name": "earnings_view",
      "properties": {
        "earnings_value": this.state.total_earnings
      }
    };

    nativeCallback({ events: eventObj });

    this.props.history.push({
      pathname: pathname,
      search: '?base_url='+this.state.params.base_url
    });
  }

  navigateWithparam = (pathname, param) => {
    let eventObj = {
      "event_name": "TnC_click"
    };

    nativeCallback({ events: eventObj });

    this.props.history.push({
      pathname: pathname,
      search: '?mobile='+this.state.mobile+'&base_url='+this.state.params.base_url
    });
  }

  shareHandler = () => {
    let message = 'Try out fisdom: a simple app to make smart investments with zero paperwork! Use my referral code '+this.state.referral_code.toUpperCase()+'. Click here to download: http://m.onelink.me/32660e84';
    let eventObj = {
      "event_name": "share_clicked",
      "properties": {
        "where": "home",
        "earnings_value": this.state.total_earnings
      }
    };

    nativeCallback({ action: 'share', message: { message: message }, events: eventObj });
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={'Refer & Earn'}
        background='GreyBackground'
        >
        <div className="Refer pad15">
          <Card>
            <img src={gift} alt="" />
            <div className="margin_top">
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
                  fullWidth={true}
                  variant="raised"
                  size="large"
                  color="secondary"
                  onClick={this.shareHandler} >
                  Share Now
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <Grid container spacing={24} alignItems="center" className="ReferPaytmGrid" onClick={() => this.navigate('/referral/earnings')}>
              <Grid item xs>
                <img src={wallet} alt="" />
              </Grid>
              <Grid item xs={6}>
                <p><span className="blue">Pay</span><span className="blue_light">tm</span> earnings</p>
                <h1><span>₹</span> {this.state.total_earnings}</h1>
              </Grid>
              <Grid item xs>
                <h2 className="view">View</h2>
              </Grid>
            </Grid>
          </Card>

          {
            this.state.campaign_expiry_date &&
            <Card nopadding={true}>
              <Grid container spacing={24} alignItems="center" className="ReferTermsGrid">
                <Grid item xs={3}>
                  <img src={hand} alt="" />
                </Grid>
                <Grid item xs={9}>
                  <p>Your friends should invest before</p>
                  <h3>{this.state.campaign_expiry_date}</h3>
                </Grid>
              </Grid>
              <div className="terms" onClick={() => this.navigateWithparam('/referral/terms')}>
                *View T&C
              </div>
            </Card>
          }
        </div>
      </Container>
    );
  }
}

export default Details;
