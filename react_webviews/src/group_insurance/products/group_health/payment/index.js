import React, { Component } from 'react';

import Container from '../../../common/Container';

import { getUrlParams } from 'utils/validators';
// eslint-disable-next-line
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import { inrFormatDecimal2, storageService, formatDateAmPm } from 'utils/validators';
import ContactUs from '../../../../common/components/contact_us';
import { initialize } from '../common_data'

const commonMapper = {
    'success': {
      'top_icon': 'ils_covid_success',
      'top_title': 'Insurance payment successful',
      'mid_title': 'Insurance payment details',
      'button_title': 'CHECK REPORTS',
      'cta_state': '/gold/gold-locker'
    },
    'pending': {
      'top_icon': 'ils_covid_pending',
      'top_title': 'Insurance payment pending!',
      'mid_title': 'Insurance payment details',
      'button_title': 'GO TO LOCKER',
      'cta_state':  '/gold/gold-locker'
    },
    'failed': {
      'top_icon': 'ils_covid_failed',
      'top_title': 'Insurance payment failed',
      'mid_title': '',
      'button_title': 'RETRY',
      'cta_state': '/gold/buy'
    }
}

class GroupHealthPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: getUrlParams(),
      commonMapper: {},
      get_lead: true
    }

    this.initialize = initialize.bind(this);
  }

 
  componentWillMount() {

    this.initialize();

    nativeCallback({ action: 'take_control_reset' });
    let { status } = this.state.params;
    let paymentFailed,paymentPending, paymentSuccess = false;

    if(status === 'success') {
      paymentSuccess = true;
    } else if (status === 'failed') {
        paymentFailed = true;
    } else {
        paymentPending = true;
        if(!status) {
            status = 'pending';
        }
    }

    this.setState({
      status: status,
      commonMapper: commonMapper[status],
      paymentSuccess: paymentSuccess,
      paymentPending: paymentPending,
      paymentFailed: paymentFailed
    })
  }

  onload = () => {
      console.log(this.state.lead);
  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }


  sendEvents(user_action, data={}) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'payment',
        'flow': this.state.orderType,
        'status': this.state.statusFinal,
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


  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        noHeader={this.state.show_loader}
        title={this.state.commonMapper['top_title']}
        handleClick={this.handleClick}
        edit={this.props.edit}
        fullWidthButton={true}
        onlyButton={true}
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
                  
                    <div>
                        {this.state.paymentSuccess && 
                          <p className="top-content"> 
                           Payment of ₹7,640 for HDFC ERGO my health Suraksha
                        silver smart is successful. Now you have access to 10000+ cashless hospitals.
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
                            Payment of ₹7,640 for HDFC ERGO my health Suraksha silver smart has failed.
                            </p>
                            <p className="top-content"> 
                            If amount has been debited it will be refunded back to you in 3-5 business days. 
                            </p>
                          </div> 
                        }
                      
                    </div>
                  


                  {this.state.paymentSuccess &&
                          <div style={{ margin: '30px 0 30px 0', display:'flex',position: 'relative' }} className="highlight-text highlight-color-info">
                            <div>
                            <img className="highlight-text11" 
                              src={ require(`assets/${this.state.providerData.logo}`)}
                              style={{width:30}}
                              alt="info" />
                            </div>
                            
                            <div>
                              <div className="highlight-text1">
                              
                                <div className="highlight-text12" style={{display:'flex'}}>
                                  <div>
                                    {this.state.providerData.subtitle}
                                  </div>
                                </div>
                              </div>
                              <div className="highlight-text2" style={{color: '#767E86',marginLeft:7}}>
                                <div style={{margin: '5px 0 6px 0'}}>Sum assured ₹3 lacs for 1 year</div>
                                <div style={{margin: '5px 0 6px 0'}}>Policy id: F6453QXXXX</div>
                                <div style={{margin: '5px 0 6px 0'}}>6nd Jan, 01:31 PM</div>
                              </div>
                            </div>
                          </div>
                  }


           {!this.state.paymentFailed &&
                  <div>
                      <div className="mid-title">{this.state.commonMapper.mid_title}</div>
                        <div className="content">
                            <div className="content-points">
                                <div className="content-points-inside-text">
                                Basic premium
                                </div>
                                <div className="content-points-inside-text">
                                  {inrFormatDecimal2(1000)}
                                </div>
                            </div>

                            <div className="content-points">
                                <div className="content-points-inside-text">
                                GST
                                </div>
                                <div className="content-points-inside-text">
                                {inrFormatDecimal2(10000)}
                                </div>
                            </div>
                        </div>

                      <div className="hr"></div>

                      <div className="content2">
                          <div className="content2-points">
                              <div className="content2-points-inside-text">
                              Total amount paid
                              </div>
                              <div className="content2-points-inside-text">
                                {inrFormatDecimal2(10000)}
                              </div>
                          </div>
                      </div>
                      <div className="hr"></div>
                  </div>
                  }
                </div>

                <ContactUs />
        </div>
      </Container>
    );
  }
}

export default GroupHealthPayment;
