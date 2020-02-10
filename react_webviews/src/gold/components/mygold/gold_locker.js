import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import GoldBottomSecureInfo from '../ui_components/gold_bottom_secure_info';

class GoldLocker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      goldInfo: {},
      userInfo: {},
      goldSellInfo: {},
      isRegistered: false,
      params: qs.parse(props.history.location.search.slice(1)),
      value: 0,
      error: false,
      errorMessage: '',
      countdownInterval: null,
      provider: 'safegold'
    }
  }

  componentWillMount() {
    if (this.state.params.isDelivery) {
      this.setState({
        value: 1
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
        goldInfo.sell_value = ((result.sell_info.plutus_rate) * (goldInfo.gold_balance || 0)).toFixed(2) || 0;
        this.setState({
          goldSellInfo: result.sell_info,
          goldInfo: goldInfo,
        });

      } else {
        this.setState({
          error: true,
          errorMessage: res2.pfwresponse.result.error || res2.pfwresponse.result.message ||
            'Something went wrong'
        });
      }


   
    } catch (err) {
      this.setState({
        show_loader: false,
      });
      // toast('Something went wrong', 'error');
    }

    this.setState({
      show_loader: false
    });
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

  

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  
  render() {

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Gold locker"
        noFooter={true}
        events={this.sendEvents('just_set_events')}
      >
        
        <GoldBottomSecureInfo />
      </Container>
    );
  }
}

export default GoldLocker;
