import React, { Component } from 'react';

import Container from '../common/Container';
import wallet from 'assets/wallet_icon.svg';
import Button from 'material-ui/Button';
import Grid from '@material-ui/core/Grid';
import { getAcronym } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import axios from 'axios';
import Api from 'utils/api';
import InfiniteScroll from 'react-infinite-scroller';
import qs from 'qs';
import { getConfig } from '../../utils/functions';
import { capitalize } from '../../utils/validators';

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
      refer_message_3: '',
      referral_code: '',
      type_of_referee_identifier: '',
      total_earnings: 0.00,
      hasMoreItems: false,
      nextPage: null,
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName,
      link: getConfig().appLink
    }
  }

  componentDidMount() {
    axios.all([
      axios.get('/api/referral/v2/listreferees/mine'),
      axios.get('/api/referral/v2/getactivecampaign/mine')
    ])
      .then(axios.spread((listRes, campaignRes) => {
        const { data, next_page } = listRes.data.pfwresponse.result;
        const { amount_per_referral, campaign_expiry_date, refer_message_1, refer_message_2, refer_message_3, referral_code, type_of_referee_identifier, total_earnings } = campaignRes.data.pfwresponse.result;

        this.setState({
          show_loader: false,
          data,
          amount_per_referral,
          campaign_expiry_date,
          refer_message_1,
          refer_message_2,
          refer_message_3,
          referral_code,
          type_of_referee_identifier,
          total_earnings,
          hasMoreItems: (next_page) ? true : false,
          nextPage: (next_page) ? next_page : null
        });
      }, error => {
        this.setState({ show_loader: false });
      }))
      .catch(error => {
        this.setState({ show_loader: false });
      });
  }

  loadItems = (page) => {
    Api.get(this.state.nextPage).then(res => {
      const { data, next_page } = res.pfwresponse.result;

      this.setState({
        data: [...this.state.data, ...data],
        hasMoreItems: (next_page) ? true : false,
        nextPage: (next_page) ? next_page : null
      });
    }).catch(error => {
    });
  }

  sendEvents(user_action, user = null) {
    let eventObj = {
      event_name: "refer_earn",
      properties: {
        user_action: user_action,
        screen_name: "my_earnings",
        earn: this.state.total_earnings,
        user: user,
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }


  shareHandler = () => {
    let message = `Try out ${this.state.type}: a simple app to make smart investments with zero paperwork! Use my referral code ${(this.state.referral_code || '').toUpperCase()}. Click here to download: ${this.state.link}`;
    if (this.state.type === 'finity') {
      message = `Hey, I found ${this.state.type} to be one of the best apps to invest in direct mutual funds at 0% commission. Use referral code  ${(this.state.referral_code || '').toUpperCase()}. Click on this link to download ${this.state.type} ${this.state.link}`;
    }
    this.sendEvents("share")
    if (getConfig().Android) {
      message = `Try out ${this.state.type}: a simple app to make smart investments with zero paperwork! Use my referral code ${(this.state.referral_code || '').toUpperCase()}. Click here to download:`
      if (this.state.type === 'finity') {
        message = `Hey, I found ${this.state.type} to be one of the best apps to invest in direct mutual funds at 0% commission. Use referral code  ${(this.state.referral_code || '').toUpperCase()}. Click on this link to download ${this.state.type}`;
      }
      let url = `${getConfig().actionUrl}?action_type=native&native_module=app%2Frefer_via_apps&message=${message}`
      nativeCallback({ action: 'open_module', message: { action_url: url } });
    }
    if (getConfig().iOS) {
      nativeCallback({ action: 'share', message: { message: message } });
    }
  }

  remindHandler = (length, item, index) => {
    let message = `Hey, looks like you have downloaded the ${this.state.type} app but have not started investing yet. Waiting will cost you severely in potential returns so begin today! Tap: ${this.state.link}`;
    if (this.state.type === 'finity') {
      message = `Hey mate, now enjoy commission-free investing on ${this.state.type}. Check out 5,000 + direct mutual funds, get quality investment advice, one-tap portfolio tracking & much more. Invest now ${this.state.link}`;
    }
    this.sendEvents("remind", item);

    if (getConfig().Android) {
      message = `Hey, looks like you have downloaded the ${this.state.type} app but have not started investing yet. Waiting will cost you severely in potential returns so begin today! Tap:`
      if (this.state.type === 'finity') {
        message = `Hey mate, now enjoy commission-free investing on ${this.state.type}. Check out 5,000 + direct mutual funds, get quality investment advice, one-tap portfolio tracking & much more. Invest now ${this.state.link}`;
      }
      let url = `${getConfig().actionUrl}?action_type=native&native_module=app%2Frefer_via_apps&message=${message}`
      nativeCallback({ action: 'open_module', message: { action_url: url } });
    }

    if (getConfig().iOS) {
      nativeCallback({ action: 'remind', message: { message: message } });
    }
  }

  renderAction = (length, item, index) => {
    if (item.investment_status === 'pending') {
      return <h3 onClick={() => this.remindHandler(length, item, index)} className="action">Remind</h3>;
    }
    if (item.investment_status === 'success') {
      return <h3 className="action GreyText">Earned {item.amount_earned}</h3>
    }
  }

  renderIcon = (item) => {
    if (item.type_of_referee_identifier === 'name') {
      return (
        <div className={`icon ${(item.investment_status === 'success' && item.amount_earned > 0) ? 'DarkGreyBackground' : ''}`}><span>{getAcronym(item.referee_name.toUpperCase())}</span></div>
      );
    } else if (item.type_of_referee_identifier === 'email') {
      return (
        <div className={`icon ${(item.investment_status === 'success' && item.amount_earned > 0) ? 'DarkGreyBackground' : ''}`}><span>@</span></div>
      );

    } else if (item.type_of_referee_identifier === 'mobile') {
      return (
        <div className={`icon ${(item.investment_status === 'success' && item.amount_earned > 0) ? 'DarkGreyBackground' : ''}`}><span>{item.referee_name.slice(-2)}</span></div>
      );
    }
  }

  renderList = () => {
    const dataLength = this.state.data.filter(item => item.investment_status === 'pending');
    const loader = <div className="loader" key={0}>Loading...</div>

    let items = [];
    // eslint-disable-next-line
    this.state.data.map((item, i) => {
      items.push(
        <div className="Item" key={i}>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={3}>
              {this.renderIcon(item)}
            </Grid>
            <Grid item xs={5}>
              <span className="name">{capitalize((item.referee_name.length > 15) ? item.referee_name.replace('+91|', '').substring(0, 10) + '...' : item.referee_name)}</span>
            </Grid>
            <Grid item xs={4}>
              {this.renderAction(dataLength, item, i)}
            </Grid>
          </Grid>
        </div>
      );
    });

    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={(page) => this.loadItems(page)}
        hasMore={this.state.hasMoreItems}
        loader={loader}
      >
        <div className="list">
          {items}
        </div>
      </InfiniteScroll>
    );
  }

  renderFandF = () => {
    return (
      <div className="FandF">
        <h1>Refer your family and friends</h1>
        <p>& get <span className="BoldText">₹{this.state.amount_per_referral}</span> in Paytm after their first investment</p>
        <div className="Share">
          <p>REFERRAL CODE</p>
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
            REFER NOW
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
                {this.state.refer_message_3}
              </p>
              <div className="Share">
                <p>REFERRAL CODE</p>
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
                  REFER NOW
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // eslint-disable-next-line
    return (
      <div className="List">
        <h1>Earn more</h1>
        <p>Remind your friends to invest with {capitalize(this.state.type)} & increase your Paytm earnings. Get ₹{this.state.amount_per_referral} for every friend who invests</p>
        <div className="Referres">
          {this.renderList()}
        </div>
      </div>
    );
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={'My earnings'}
        noFooter={true}
        events={this.sendEvents("just_set_events")}
      >
        <div className="Earning">
          <div className="ReferPaytmGrid pad20">
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
