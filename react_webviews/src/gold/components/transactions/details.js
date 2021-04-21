import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import toast from '../../../common/ui/Toast';
import ContactUs from '../../../common/components/contact_us';
import {
  inrFormatDecimal, formatDateAmPm
} from 'utils/validators';

import SVG from 'react-inlinesvg';
import ic_send_email from 'assets/ic_send_email.svg';
import DotDotLoader from '../../../common/ui/DotDotLoader';
import { getTransactionStatus, setTransationsSteps, getUniversalTransStatus } from '../../constants';
import { copyToClipboard } from 'utils/validators';

let icon_mapper = {
  'pending': 'not_done_yet_step',
  'pending_triangle': 'warning_icon',
  'init': 'not_done_yet_step',
  'failed': 'text_error_icon',
  'success': 'ic_completed'
};

class GoldTransactionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skelton: true,
      goldInfo: {},
      userInfo: {},
      goldSellInfo: {},
      isRegistered: false,
      params: qs.parse(props.history.location.search.slice(1)),
      value: 0,
      error: false,
      errorMessage: '',
      countdownInterval: null,
      provider: this.props.match.params.provider,
      productName: getConfig().productName,
      journeyData: [],
      topStatusData: {},
      order: {
        cssMapper: {}
      },
      icon_mapper: icon_mapper,
      copyText: 'COPY'
    }
  }

  statusMapper = (data) => {

    let cssMapper = {
      'pending': {
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
      }
    }

    let type = this.state.orderType;
    let uniStatus = getUniversalTransStatus(data);

    let obj = cssMapper[uniStatus];
    obj.uniStatus = uniStatus;

    let title = '';
    if (type === 'buy') {
      title = 'Bought ' + data.gold_weight + ' gms';
    }

    if(type === 'buy_back') {
      title = 'By offer ' + data.gold_weight + ' gms'; 
    }

    if (type === 'sell') {
      title = 'Sold ' + data.gold_weight + ' gms';
    }

    if (type === 'delivery') {
      title = 'Delivery of ' + (data.description || '');
    }

    obj.title = title;

    return obj;
  }

  async getOrderData(baseData) {
    const res = await Api.get('/api/gold/report/orders/' + this.state.provider +
      '?transaction_id=' + baseData.transact_id + '&order_type=' + baseData.orderType);
    if (res.pfwresponse.status_code === 200) {
      let order = res.pfwresponse.result || {};

      order.orderType = this.state.orderType;
      order.provider = this.state.provider;

      order.final_status = getTransactionStatus(order);
      order.cssMapper = this.statusMapper(order);
      let journeyData = setTransationsSteps(order);
      this.setState({
        skelton: false,
        order: order,
        journeyData: journeyData
      });
    } else {
      this.setState({
        skelton: false
      });
      toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
    }
  }

  async componentDidMount() {

    this.setState({
      skelton: true,
    });

    let { provider } = this.props.match.params;
    let { orderType } = this.props.match.params;
    let { transact_id } = this.props.match.params;

    let baseData = {
      provider: provider,
      orderType: orderType,
      transact_id: transact_id
    };

    this.setState({
      provider: provider,
      transact_id: transact_id,
      orderType: orderType
    })

    try {

      if (orderType === 'delivery') {
        var url_mapper = {
          'check_status': '/api/gold/check/transactions/mine/' + provider,
          'update_status': '/api/gold/update/' + orderType + '/transactions/mine/' + provider,
          'refund': '/api/gold/update/' + orderType + '/transactions/mine/' + provider
        }

        var deliveryUpdateUrl = url_mapper['update_status'] + '?txn_id=' + transact_id;

        const res = await Api.get(deliveryUpdateUrl);
        if (res.pfwresponse.status_code === 200) {
          this.getOrderData(baseData);
        } else {
          this.setState({
            skelton: false
          });
          toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
        }
      } else {
        this.getOrderData(baseData);
      }

    } catch (err) {
      console.log(err);
      this.setState({
        skelton: false
      });
      toast('Something went wrong');
    }
  }



  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'transaction_detail',
        "flow": this.state.orderType,
        "download_invoice_clicked": this.state.download_invoice_clicked ? 'yes' : 'no',
        "status": this.state.order.cssMapper.uniStatus || ''
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
      return '2px solid white';
    } else if (props.status === 'success') {
      return '2px solid ' + getConfig().styles.primaryColor;
    }

    return '';
  }

  renderJourney = (props, index) => {
    return (
      <div key={index} className="tile" style={{ borderLeft: this.getJourneyBorder(props, index) }}>
        <div style={{ position: 'relative' }}>
          {props.status === 'success' &&
            <SVG
              style={{ backgroundColor: '#fff', zIndex: 111 }}
              preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().styles.primaryColor)}
              src={require(`assets/${this.state.icon_mapper[props.status]}.svg`)}
              className="icon normal-step-icon"
            />}
          {props.status !== 'success' &&
            <SVG
              // preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().styles.primaryColor)}
              src={require(`assets/${this.state.icon_mapper[props.status]}.svg`)}
              className="icon normal-step-icon"
            />}
          {props.status === 'pending' &&
            <p className="text-on-img">{index + 1}</p>
          }
        </div>
        <div className="title">
          {props.title}
        </div>
      </div>

    );
  }

  async emailInvoice() {

    let path = this.state.order.invoice_link;

    this.setState({
      download_invoice_clicked: true
    })
    if (!path) {
      toast('Invoice not generated, please try after sometime');
      return;
    }

    this.setState({
      invoiceLoading: true,
    });

    try {
      const res = await Api.get('/api/gold/invoice/download/mail/' + this.state.provider, 
      { txn_id: this.state.transact_id, order_type: this.state.orderType });
      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        if (result.message === 'success') {
          this.setState({
            invoiceSent: true
          })
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
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
      }
    } catch (err) {
      this.setState({
        invoiceLoading: false
      });
      toast('Something went wrong');
    }
  }

  copyItem = (string) => {
    if (copyToClipboard(string)) {
      toast('Tracking number copied');
      this.setState({
        copyText: 'Copied'
      })
      this.sendEvents('copy');
    }
  }

  openInBrowser = (url) => {
    nativeCallback({
      action: 'open_in_browser',
      message: {
        url: url
      }
    });
  }


  getPurchaseTitle = () => {
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
        // showLoader={this.state.show_loader}
        skelton={this.state.skelton}
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
              {formatDateAmPm(this.state.order.dt_created)}
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
                Tracking details
                </div>
              {this.state.order.courier_tracking_id &&
                <div className="subtitle">
                  <span>Courier service : {this.state.order.courier_company || ' -'}</span>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    margin: '3px 0 0 0', alignItems: 'center'
                  }}>
                    <span>Tracking number : {this.state.order.courier_tracking_id || ' -'}</span>

                    {this.state.order.tracking_link &&
                      <span
                        onClick={() => this.openInBrowser(this.state.order.tracking_link)}
                        style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                        color: getConfig().styles.primaryColor,marginLeft:10, cursor: 'pointer',
                        textDecoration:'underline' }}>Track
                      </span>
                    }

                    {this.state.order.courier_tracking_id &&
                      <span
                        onClick={() => this.copyItem(this.state.order.courier_tracking_id)}
                        style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                        color: getConfig().styles.secondaryColor,marginLeft:10, cursor: 'pointer' }}>{this.state.copyText}
                      </span>
                    }

                    
                  </div>
                </div>
              }

              {!this.state.order.courier_tracking_id &&
                <div className="subtitle">
                  -
                </div>
              }
            </div>
          </div>
        }

        <div className="gold-trans-detail-card" style={{ alignItems: 'baseline', marginBottom: 0 }}>
          <img
            className="icon"
            src={require(`assets/${this.state.productName}/status_sip_icon.svg`)} alt="Gold" />
          <div className="block2" style={{ margin: '0px 0 0 15px', position: 'relative', top: '-18px' }}>
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

        <div>
          {!this.state.invoiceSent && this.state.order.orderType !== 'buy_back' &&
            <div className="send-invoice">
              <SVG
                preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().styles.secondaryColor)}
                src={ic_send_email}
              />
              {!this.state.invoiceLoading &&
                <div onClick={() => this.emailInvoice()}
                  style={{ color: getConfig().styles.secondaryColor, marginLeft: 10 }}>
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
          }
          {this.state.invoiceSent &&
            <div className="send-invoice">
              <img className="sent-icon"
                src={require(`assets/completed_step.svg`)}
                alt="Gold" />
              <span className="sent">Sent</span>
            </div>
          }
        </div>

        <ContactUs />
      </Container>
    );
  }
}

export default GoldTransactionDetail;
