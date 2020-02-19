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
import DotDotLoader from '../../../common/ui/DotDotLoader';

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
      topStatusData: {},
      order: {
        cssMapper: {}
      }
    }
  }

  statusMapper = (data)  => {
    let cssMapper = {
      'init': {
        color: 'yellow',
        disc: 'Pending'
      },
      'success': {
        color: 'green',
        disc: 'Success'
      },
      'failed': {
        color: 'red',
        disc: 'Failed'
      },
      'rejected': {
        color: 'red',
        disc: 'Rejected'
      },
      'cancelled': {
        color: 'red',
        disc: 'Cancelled'
      }
    }

    let type = this.state.orderType;
    let statusKey = 'plutus_' + type + '_order_status';
    if(type === 'delivery') {
      statusKey = 'order_status';
    }
    
    let obj = cssMapper[data[statusKey]] || cssMapper['init'];

    
    let title = '';
    if(type === 'buy') {
      title = 'Bought ' + data.gold_weight + ' gms'; 
    }

    if(type === 'sell') {
      title = 'Sold ' + data.gold_weight + ' gms'; 
    }

    if(type === 'delivery') {
      title = 'Delivery of ' + data.description; 
    }

    obj.title = title;

    return obj;
  }

  async componentDidMount() {

    let journeyData = [
      { 'title': 'Purchase initiated', 'icon': 'check_green_pg', 'status': 'success' },
      { 'title': 'Purchase initiated', 'icon': 'text_error_icon', 'status': 'error' },
      { 'title': 'Purchase initiated', 'icon': 'not_done_yet_step', 'status': 'pending' }
    ];

    this.setState({
      journeyData: journeyData
    })

    this.setState({
      show_loader: true,
    });

    let { provider } = this.props.match.params;
    let { orderType } = this.props.match.params;
    let { transact_id } = this.props.match.params;

    this.setState({
      provider: provider,
      transact_id: transact_id,
      orderType: orderType
    })

    try {
      const res = await Api.get('/api/gold/report/orders/safegold?transaction_id=' + transact_id +
        '&order_type=' + orderType);
      if (res.pfwresponse.status_code === 200) {
        let order = res.pfwresponse.result || {};
        order.cssMapper = this.statusMapper(order);
        this.setState({
          show_loader: false,
          order: order
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      console.log(err);
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }
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

  getJourneyBorder = (props, index) => {
    if (index === this.state.journeyData.length - 1) {
      return 'none';
    } else if (props.status === 'success') {
      return '1px solid ' + getConfig().primary;
    }

    return '';
  }

  renderJourney = (props, index) => {
    return (
      <div key={index} className="tile" style={{ borderLeft: this.getJourneyBorder(props, index) }}>
        <img
          className="icon"
          src={require(`assets/${props.icon}.svg`)} alt="Gold" />
        {props.status === 'pending' &&
          <p className="text-on-img">{index + 1}</p>
        }
        <div className="title">
          {props.title}
        </div>
      </div>

    );
  }

  async emailInvoice() {

    let path = this.state.order.invoice_link;
    this.setState({
      invoiceLoading: true,
    });

    try {
      const res = await Api.get('/api/gold/invoice/download/mail', { url: path });
      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        if (result.message === 'success') {
          toast('Invoice has been sent succesfully to your registered email');
        } else {
          toast(result.message || result.error);
        }
        this.setState({
          invoiceLoading: false,
        });
      } else {
        this.setState({
          invoiceLoading: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        invoiceLoading: false
      });
      toast('Something went wrong', 'error');
    }
  }


  getPurchaseTitle =() => {
    let title = 'Gold purchase amount';

    if (this.state.orderType === 'sell') {
      title = 'Gold selling amount';
    } else if (this.state.orderType === 'delivery') {
      title = 'Making charges';
    } 

    return title;
  }
  
  render() {

    return (
      <Container
        showLoader={this.state.show_loader}
        title={this.state.order.cssMapper.title}
        noFooter={true}
        events={this.sendEvents('just_set_events')}
      >

        <div style={{ margin: '0px 0 40px 0' }} className={`report-color-state ${this.state.order.cssMapper.color}`}>
          <div className="circle"></div>
          <div className="report-color-state-title">{this.state.order.cssMapper.disc}</div>
        </div>
        <div className="gold-trans-detail-card">
          <img
            className="icon"
            src={require(`assets/${this.state.productName}/order_id.svg`)} alt="Gold" />
          <div className="block2">
            <div className="title">
              Order ID
              </div>
            <div className="subtitle">
              {this.state.order.provider_txn_id}
              </div>
          </div>
        </div>

        <div className="gold-trans-detail-card">
          <img
            className="icon"
            src={require(`assets/${this.state.productName}/sip_date_icon.svg`)} alt="Gold" />
          <div className="block2">
            <div className="title">
              Order date
              </div>
            <div className="subtitle">
            {this.state.order.dt_created}
              </div>
          </div>
        </div>

        <div className="gold-trans-detail-card">
          <img
            className="icon"
            src={require(`assets/${this.state.productName}/amount_icon.svg`)} alt="Gold" />
          <div className="block2">
            <div className="title">
              {this.getPurchaseTitle()}
              </div>
            <div className="subtitle">
              {inrFormatDecimal(this.state.order.total_amount || 
                this.state.order.delivery_minting_cost)}
            </div>
          </div>
        </div>

        {this.state.orderType === 'delivery' && 
           <div className="gold-trans-detail-card">
            <img
              className="icon"
              src={require(`assets/${this.state.productName}/track_order.svg`)} alt="Gold" />
            <div className="block2">
              <div className="title">
                Tracking URL
                </div>
              <div className="subtitle">
                {this.state.order.courier_tracking_id}
              </div>
            </div>
          </div>
        }

        <div className="gold-trans-detail-card" style={{ alignItems: 'baseline', marginBottom: 0 }}>
          <img
            className="icon"
            src={require(`assets/${this.state.productName}/status_sip_icon.svg`)} alt="Gold" />
          <div className="block2" style={{ margin: '0px 0 0 8px', position: 'relative', top: '-18px' }}>
            <div className="title">
              {this.state.orderType === 'delivery' && <span>Delivery</span>}  Status
              </div>

            <div className="subtitle" style={{ margin: '10px 0 0 7px' }}>
              <div className="generic-progress-vertical">
                {this.state.journeyData.map(this.renderJourney)}
              </div>
            </div>
          </div>
        </div>

        <div className="common-hr"></div>

        <div className="send-invoice">
          <SVG
            preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().secondary)}
            src={ic_send_email}
          />
          {!this.state.invoiceLoading &&
            <div onClick={() => this.emailInvoice()}
            style={{color: getConfig().secondary, marginLeft: 10}}>
              Email invoice
            </div>
          }
          {this.state.invoiceLoading &&
            <DotDotLoader style={{
              textAlign: 'left',
              marginLeft: 10
              }} 
            />
          }
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
