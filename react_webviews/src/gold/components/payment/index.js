import React, { Component } from 'react';

import Container from '../../common/Container';
import Api from 'utils/api';
import SVG from 'react-inlinesvg';
import ic_send_email from 'assets/ic_send_email.svg';

import toast from '../../../common/ui/Toast';
import { getUrlParams } from 'utils/validators';
// eslint-disable-next-line
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import { inrFormatDecimal2, storageService, formatDateAmPm } from 'utils/validators';
import DotDotLoader from '../../../common/ui/DotDotLoader';
import { gold_providers } from '../../constants';

const commonMapper = {
  'buy': {
    'success': {
      'top_icon': 'ils_gold_purchase_success',
      'top_title': 'Gold purchase successful!',
      'mid_title': 'Payment details',
      'button_title': 'Go to locker',
      'cta_state': '/gold/gold-locker'
    },
    'pending': {
      'top_icon': 'ils_gold_purchase_pending',
      'top_title': 'Gold purchase pending!',
      'mid_title': 'Payment details',
      'button_title': 'Go to locker',
      'cta_state':  '/gold/gold-locker'
    },
    'failed': {
      'top_icon': 'ils_gold_purchase_failed',
      'top_title': 'Oops! gold purchase failed',
      'mid_title': '',
      'button_title': 'Retry buy gold',
      'cta_state': '/gold/buy'
    }
  },
  'sell': {
    'success': {
      'top_icon': 'ils_gold_sell_success',
      'top_title': 'Gold sell successful!',
      'mid_title': 'Sold gold details',
      'button_title': 'Continue to locker',
      'cta_state': '/gold/gold-locker'
    },
    'pending': {
      'top_icon': 'ils_gold_sell_failed',
      'top_title': 'Gold sell failed!',
      'mid_title': '',
      'button_title': 'Continue to locker',
      'cta_state':  '/gold/gold-locker'
    },
    'failed': {
      'top_icon': 'ils_gold_sell_failed',
      'top_title': 'Gold sell failed!',
      'mid_title': '',
      'button_title': 'Continue to locker',
      'cta_state':  '/gold/gold-locker'
    }
  },
  'delivery': {
    'success': {
      'top_icon': 'sucess_order_delivery',
      'top_title': 'Order placed',
      'mid_title': 'Payment details',
      'button_title': 'Go to locker',
      'cta_state': '/gold/gold-locker'
    },
    'pending': {
      'top_icon': 'pending_order_delivery',
      'top_title': 'Delivery order pending!',
      'mid_title': 'Payment details',
      'button_title': 'Go to locker',
      'cta_state':  '/gold/gold-locker'
    },
    'failed': {
      'top_icon': 'failed_order_delivery',
      'top_title': 'Oops! delivery order failed',
      'mid_title': '',
      'button_title': 'Retry purchase',
      'cta_state':  '/gold/delivery-products'
    }
  }
}

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openResponseDialog: false,
      provider_info: {},
      weight: "",
      params: getUrlParams(),
      provider: this.props.match.params.provider,
      productName: getConfig().productName,
      orderData: {},
      report: {}
    }
    this.trackDelivery = this.trackDelivery.bind(this);
  }

  componentWillMount() {
    nativeCallback({ action: 'take_control_reset' });
    let { status } = this.state.params;
    if(!status) {
      status = 'failed';
    }
    let { orderType } = this.props.match.params;
    let weight,amount,
       paymentError, paymentMessage, paymentPending, invoiceLink;

    let transact_id;

    let orderKey = orderType + 'Data';
    let orderData = storageService().getObject(orderKey) || {};
    weight = orderData.weight_selected || '';
    amount = orderData.amount_selected || '';
    invoiceLink = orderData.invoice_link || '';
    transact_id = orderData.transact_id || '';

    let paymentFailed, paymentSuccess;
    if (status === 'failed' || status === 'error') {
      paymentFailed = true;
    } else if (status === 'success') {
      paymentSuccess = true;
    } else if (status === 'pending') {
      paymentPending = true;
    }

    this.setState({
      status: status,
      orderType: orderType,
      weight: weight,
      amount: amount,
      orderData: orderData,
      paymentError: paymentError,
      paymentSuccess: paymentSuccess,
      paymentFailed: paymentFailed,
      paymentMessage: paymentMessage,
      paymentPending: paymentPending,
      invoiceLink: invoiceLink,
      commonMapper: commonMapper[orderType][status],
      providerData: gold_providers[this.state.provider],
      transact_id: transact_id
    })

    this.getTransDetails(transact_id, orderType);

  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/gold/user/account/' + this.state.provider);
      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        this.setState({
          provider_info: result.gold_user_info.provider_info,
          userInfo: result.gold_user_info.user_info,
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
      }

      const res2 = await Api.get('/api/gold/sell/currentprice/' + this.state.provider);
      if (res2.pfwresponse.status_code === 200) {
        let provider_info = this.state.provider_info;
        let result = res2.pfwresponse.result;
        provider_info.sell_value = ((result.sell_info.plutus_rate) * (provider_info.gold_balance || 0)).toFixed(2) || 0;
        this.setState({
          goldSellInfo: result.sell_info,
          provider_info: provider_info,
          show_loader: false,
        });

      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
      }
    } catch (err) {
      console.log(err);
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }

  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  trackDelivery() {
    window.localStorage.setItem('deliveryTransaction', 'delivery');
    this.navigate('/gold/gold-transactions')
    this.props.history.push({
      pathname: '/gold/gold-transactions',
      search: getConfig().searchParams
    });
  }

  emailInvoice = async () => {

    let path = this.state.report.invoice_link;
    this.setState({
      download_invoice_clicked: true
    })
    if(!path) {
      toast('Invoice not generated, please try after sometime');
      return;
    }

    this.setState({
      invoiceLoading: true,
    });

    try {
      const res = await Api.get('/api/gold/invoice/download/mail/' + this.state.provider, { url: path });
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
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
      }
    } catch (err) {
      this.setState({
        invoiceLoading: false
      });
      toast('Something went wrong');
    }
  }

   getTransDetails = async (transact_id, orderType) => {

    if(transact_id) {
      this.setState({
        show_loader: true,
      });
  
      try {
        const res = await Api.get('/api/gold/report/orders/' + this.state.provider + '?transaction_id=' + transact_id +
        '&order_type=' + orderType);
        if (res.pfwresponse.status_code === 200) {
          this.setState({
            report: res.pfwresponse.result
          });
        } else {
          this.setState({
            show_loader: false
          });
          toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
        }
      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
      }
    } else {
      this.setState({
        report: {}
      })
    }
    
  }

  sendEvents(user_action, data={}) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'payment',
        'flow': this.state.orderType,
        'status': this.state.status,
        'download_invoice_clicked': this.state.download_invoice_clicked ? 'yes': 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.sendEvents('next');
    this.navigate(this.state.commonMapper['cta_state']);
  }

  getHiddenBank(account_number) {
    account_number = account_number.toString();
    let str = '';
    let len = ((account_number.length)/2).toFixed(0);

    for(var i = 0; i < len - 1; i++) {
      str += 'X';
    }

    str += '-';
    for(var j = account_number.length - len; j < account_number.length; j++) {
      str += account_number[j];
    }

    return str;

  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        noHeader={this.state.show_loader}
        title={this.state.commonMapper['top_title']}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle={this.state.commonMapper.button_title}
        events={this.sendEvents('just_set_events')}
        headerData={ {
          icon: 'close'
        }}
      >
        <div className="gold-payment-container" id="goldSection">
          <div>
          <img style={{width: '100%'}} 
          src={ require(`assets/${this.state.productName}/${this.state.commonMapper['top_icon']}.svg`)} 
          alt="Gold" />
          </div>
                <div className="main-tile">
                  
                  {this.state.orderType === 'buy' && 
                    <div>
                        {this.state.paymentSuccess && 
                          <p className="top-content"> 
                            <b>{this.state.weight} gms </b> gold worth <b>{inrFormatDecimal2(this.state.amount)}</b> added to your {this.state.providerData.title} gold locker.  
                          </p>
                        }

                        {this.state.paymentPending && 
                          <div>
                            <p className="top-content"> 
                            Your purchase of <b>{this.state.weight} gms </b> gold worth <b>{inrFormatDecimal2(this.state.amount)}</b> is awaiting confirmation.  
                            </p>
                            <p className="top-content"> 
                            If confirmed within 30 minutes we will place gold 
                            purchase order (at live price) else it will be refunded in 3-5 business days.  
                            </p>
                          </div>
                        }

                        {this.state.paymentFailed && 
                          <div>
                            <p className="top-content"> 
                              Your purchase of <b>{this.state.weight} gms</b> gold worth <b>{inrFormatDecimal2(this.state.amount)}</b> is failed.
                            </p>
                            <p className="top-content"> 
                              If any amount has been debited, it will be refunded within 3-5 business days.  
                            </p>
                          </div> 
                        }
                      
                    </div>
                  
                  }

                  {this.state.orderType === 'sell' && 
                    <div>

                        {this.state.paymentSuccess && 
                          <p className="top-content"> 
                            <b>{this.state.weight} gms</b> gold worth <b>{inrFormatDecimal2(this.state.amount)}</b> sold successfully, {inrFormatDecimal2(this.state.amount)} will be 
                        credited to {this.state.orderData.bank.bank_name}
                        ({this.getHiddenBank(this.state.orderData.bank.account_number)}) within 48 hrs.  
                          </p>
                        }

                        {this.state.paymentPending && 
                          <p className="top-content"> 
                            <b>{this.state.weight} gms</b> gold worth <b>{inrFormatDecimal2(this.state.amount)}</b> sold successfully, {inrFormatDecimal2(this.state.amount)} will be 
                            credited to {this.state.orderData.bank.bank_name}
                            ({this.getHiddenBank(this.state.orderData.bank.account_number)}) within 48 hrs. 
                          </p>
                        }

                        {this.state.paymentFailed && 
                          <div>
                            <p className="top-content"> 
                            Your sale of <b>{this.state.weight} gms</b> gold worth <b>{inrFormatDecimal2(this.state.amount)}</b> is failed.
                            </p>
                            <p className="top-content"> 
                            If gold value has been debited, it will be restored back to your gold locker within 24hrs. 
                            </p>
                          </div>
                        }
                    </div>
                  
                  }

                  {this.state.orderType !== 'delivery' && this.state.paymentSuccess &&
                          <div style={{ margin: '30px 0 30px 0', display:'flex' }} className="highlight-text highlight-color-info">
                            <div>
                            <img className="highlight-text11" 
                              src={ require(`assets/${this.state.providerData.logo}`)}
                              style={{width:30}}
                              alt="info" />
                            </div>
                            
                            <div>
                              <div className="highlight-text1" style={{position: 'relative'}}>
                              
                                <div className="highlight-text12" style={{display:'flex'}}>
                                  <div>
                                    {this.state.providerData.title}
                                  </div>
                                  <div className="karat">
                                    {this.state.providerData.karat}
                                  </div>
                                </div>
                              </div>
                              <div className="highlight-text2" style={{color: '#767E86',marginLeft:7}}>
                                <div style={{margin: '5px 0 6px 0'}}>Updated value {this.state.provider_info.gold_balance} gms</div>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                  <div>Order id: {this.state.transact_id}</div>
                                    <div>{formatDateAmPm(this.state.report.dt_created)}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                  }

                  {this.state.orderType === 'delivery' && 
                    <div>

                        {this.state.paymentSuccess && 
                          <p className="top-content"> 
                           Your delivery order of gold coin is successfully placed.
                          </p>
                        }
                       
                        {this.state.paymentPending && 
                          <p className="top-content"> 
                           Your delivery order of gold coin is awaiting confirmation.
                          </p>
                        }

                        {this.state.paymentFailed && 
                          <p className="top-content"> 
                           Your delivery order of gold coin is failed.
                          </p>
                        }

                        <div style={{ margin: '30px 0 30px 0' }} className="highlight-text highlight-color-info">
                          <div  style={{textAlign: 'right', fontSize:10, color: getConfig().primary}}>24K 99.99%</div>
                          <div className="highlight-text1">
                            <img className="highlight-text11" style={{width: 34}} 
                            src={this.state.orderData.media.images[0]} alt="info" />
                            <div className="highlight-text12" style={{display:'grid'}}>
                                <div>{this.state.orderData.description}</div>
                              {!this.state.paymentFailed &&
                               <div style={{color: '#767E86', fontWeight: 400}}>Order id: {this.state.transact_id}</div>
                               }
                            </div>
                          </div>
                        </div>

                        {this.state.paymentPending && 
                            <p className="top-content"> 
                            If confirmed within 30 minutes we will place gold 
                            purchase order (at live price) else it will be refunded in 3-5 business days.  
                            </p>
                        }
                      
                    </div>
                  
                  }

           {!this.state.paymentFailed &&
                  <div>
                      <div className="mid-title">{this.state.commonMapper.mid_title}</div>
                      {this.state.orderType !== 'delivery' && 
                        <div className="content">
                            <div className="content-points">
                                <div className="content-points-inside-text">
                                  Buy price for <b>{this.state.weight}</b> gms
                                </div>
                                <div className="content-points-inside-text">
                                  {inrFormatDecimal2(this.state.orderData.base_amount)}
                                </div>
                            </div>

                            <div className="content-points">
                                <div className="content-points-inside-text">
                                GST
                                </div>
                                <div className="content-points-inside-text">
                                {inrFormatDecimal2(this.state.orderData.gst_amount)}
                                </div>
                            </div>
                        </div>
                      }

                      {this.state.orderType === 'delivery' && 
                        <div className="content">
                            <div className="content-points">
                                <div className="content-points-inside-text">
                                  Making charges
                                </div>
                                <div className="content-points-inside-text">
                                  {inrFormatDecimal2(this.state.orderData.delivery_minting_cost)}
                                </div>
                            </div>

                            <div className="content-points">
                                <div className="content-points-inside-text">
                                Shipping charges
                                </div>
                                <div className="content-points-inside-text">
                                Free
                                </div>
                            </div>
                        </div>
                      }

                      <div className="hr"></div>

                      <div className="content2">
                          <div className="content2-points">
                              <div className="content2-points-inside-text">
                                Total
                              </div>
                              <div className="content2-points-inside-text">
                                {inrFormatDecimal2(this.state.orderData.total_amount || 
                                  this.state.orderData.delivery_minting_cost)}
                              </div>
                          </div>
                      </div>

                      <div className="hr"></div>
                  </div>
                  }


                  {this.state.paymentSuccess &&
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
        </div>
      </Container>
    );
  }
}

export default Payment;
