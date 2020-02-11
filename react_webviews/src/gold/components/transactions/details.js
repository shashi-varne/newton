import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import toast from '../../../common/ui/Toast';
import {
  inrFormatDecimal
} from 'utils/validators';

import SVG from 'react-inlinesvg';
import ic_send_email from 'assets/ic_send_email.svg';

class GoldTransactionDetail extends Component {
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
      provider: 'mmtc',
      productName: getConfig().productName,
      journeyData: [],
      topStatusData: {}
    }
  }

  async componentDidMount() {

    let journeyData = [
        {'title': 'Purchase initiated', 'icon': 'check_green_pg', 'status': 'success'},
        {'title': 'Purchase initiated', 'icon': 'text_error_icon', 'status': 'error'},
        {'title': 'Purchase initiated', 'icon': 'not_done_yet_step', 'status': 'pending'}
    ];

    let topStatusData = {
        status: 'pending',
        disc: 'PENDING',
        color: 'yellow'
    }

    this.setState({
        journeyData: journeyData,
        topStatusData: topStatusData
    })

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


    } catch (err) {
      this.setState({
        show_loader: false,
      });
      toast('Something went wrong', 'error');
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

  getJourneyBorder =(props, index) => {
    if(index === this.state.journeyData.length -1) {
        return 'none';
    } else if (props.status === 'success') {
        return '1px solid '  + getConfig().primary;
    }

    return '';
  }

  renderJourney = (props, index) => {
      return(
        <div key={index} className="tile" style={{borderLeft: this.getJourneyBorder(props, index)}}>
            <img 
            className="icon"
            src={ require(`assets/${props.icon}.svg`)} alt="Gold" />
            {props.status === 'pending' && 
                <p className="text-on-img">{index + 1}</p>
            }
            <div className="title">
            {props.title}
            </div>
        </div>

      );
  }
  
  render() {

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Bought 0.024 gms gold"
        noFooter={true}
        events={this.sendEvents('just_set_events')}
      >

        <div style={{margin: '0px 0 40px 0'}} className={`report-color-state ${this.state.topStatusData.color}`}>
          <div className="circle"></div>
          <div className="report-color-state-title">{this.state.topStatusData.disc}</div>
        </div>
        <div className="gold-trans-detail-card">
            <img 
                className="icon"
              src={ require(`assets/${this.state.productName}/order_id.svg`)} alt="Gold" />
            <div className="block2">
              <div className="title">
              Order ID
              </div>
              <div className="subtitle">
              D4290M
              </div>
            </div>
        </div>

        <div className="gold-trans-detail-card">
            <img 
                className="icon"
              src={ require(`assets/${this.state.productName}/sip_date_icon.svg`)} alt="Gold" />
            <div className="block2">
              <div className="title">
              Order date
              </div>
              <div className="subtitle">
              2nd Jan 2019
              </div>
            </div>
        </div>

        <div className="gold-trans-detail-card">
            <img 
                className="icon"
              src={ require(`assets/${this.state.productName}/amount_icon.svg`)} alt="Gold" />
            <div className="block2">
              <div className="title">
              Gold purchase amount
              </div>
              <div className="subtitle">
              {inrFormatDecimal(300)}
              </div>
            </div>
        </div>

        <div className="gold-trans-detail-card" style={{alignItems: 'baseline', marginBottom: 0}}>
            <img 
                className="icon"
              src={ require(`assets/${this.state.productName}/status_sip_icon.svg`)} alt="Gold" />
            <div className="block2" style={{margin: '0px 0 0 8px', position: 'relative', top: '-18px'}}>
              <div className="title">
              Status
              </div>

              <div className="subtitle" style={{margin: '10px 0 0 7px'}}>
                <div className="generic-progress-vertical">
                   {this.state.journeyData.map(this.renderJourney)}
                </div>
              </div>
            </div>
        </div>

        <div className="common-hr"></div>

        <div className="gold-send-invoice">
            <SVG
            preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().secondary)}
            src={ic_send_email}
            />
            <div style={{color: getConfig().secondary, marginLeft: 10}}>Email invoice</div>
        </div>
        <div className="success-bottom">
            <div className="success-bottom1">
              For any query, reach us at
            </div>
            <div className="success-bottom2">
              <div className="success-bottom2a">
                {getConfig().mobile}
              </div>
              <div className="success-bottom2b">
                |
              </div>
              <div className="success-bottom2a">
                {getConfig().askEmail}
              </div>
            </div>
          </div>
      </Container>
    );
  }
}

export default GoldTransactionDetail;
