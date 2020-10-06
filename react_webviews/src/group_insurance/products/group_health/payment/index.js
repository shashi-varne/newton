import React, { Component } from 'react';

import Container from '../../../common/Container';

import { getUrlParams } from 'utils/validators';
// eslint-disable-next-line
import { nativeCallback } from 'utils/native_callback';
import { inrFormatDecimal2, storageService, numDifferentiationInr } from 'utils/validators';
import ContactUs from '../../../../common/components/contact_us';
import { initialize } from '../common_data';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import { getConfig } from 'utils/functions';

const commonMapper = {
  'success': {
    'top_icon': 'ils_covid_success',
    'top_title': 'Payment successful',
    'mid_title': 'Premium payment details',
    'button_title': 'CHECK REPORTS'
  },
  'pending': {
    'top_icon': 'ils_covid_pending',
    'top_title': 'Payment pending!',
    'mid_title': 'Premium payment details',
    'button_title': 'OK'
  },
  'failed': {
    'top_icon': 'ils_covid_failed',
    'top_title': 'Payment failed',
    'mid_title': '',
    'button_title': 'RETRY'
  }
}

class GroupHealthPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: getUrlParams(),
      commonMapper: {},
      lead: {},
      policy_data: {},
      providerData: {},
      productName: getConfig().productName,
      force_onload_call: true,
      screen_name: 'payment_screen'
    }

    this.initialize = initialize.bind(this);
  }


  async componentWillMount() {
    
    nativeCallback({ action: 'take_control_reset' });
    let { status } = this.state.params;
    let paymentFailed, paymentPending, paymentSuccess = false;
    let get_lead  = false;

    if (status === 'success') {
      paymentSuccess = true;
    } else if (status === 'failed') {
      paymentFailed = true;
      get_lead = true;
    } else {
      paymentPending = true;
      if (!status) {
        status = 'pending';
      }
      get_lead = true;
    }

    this.setState({
      status: status,
      commonMapper: commonMapper[status],
      paymentSuccess: paymentSuccess,
      paymentPending: paymentPending,
      paymentFailed: paymentFailed,
      get_lead: get_lead
    }, () => {
      this.initialize();
    })
   
  }

  onload = async() => {
    console.log(this.state);
    if(!this.state.get_lead) {
      try {

        this.setState({
          show_loader: true
        });
  
        let quote_id = storageService().get('ghs_ergo_quote_id');
  
        const res = await Api.get(`/api/ins_service/api/insurance/${this.state.provider_api}/get/policy/` + quote_id);
  
        var resultData = res.pfwresponse.result;
  
        this.setState({
          show_loader: false
        });
        if (res.pfwresponse.status_code === 200) {
  
          let lead = resultData.policy_data.insured_lead_details || {};
          let policy_data = resultData.policy_data || {};
  
          this.setState({
            policy_data: policy_data,
            lead: lead
          })
        } else {
          toast(resultData.error || resultData.message
            || 'Something went wrong');
        }
      } catch (err) {
        console.log(err)
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
      }
    }
  }

  sendEvents(user_action, data = {}) {
    let eventObj = {
      "event_name": 'health_insurance',
       "properties": {
        "user_action": user_action,
        "product": this.state.provider,
        "flow": this.state.insured_account_type || '',
        "screen_name": 'payment',
        'status': this.state.status
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

    let state = '';
    if(this.state.paymentFailed) {
      state =  `/group-insurance/group-health/${this.state.provider}/final-summary`;
      this.setState({
        forceClose: true
      }, ()=> {
        this.navigate(state);
      })
      
    } else if(this.state.paymentPending) {
      state  = `/group-insurance/group-health/${this.state.provider}/landing`;
      this.navigate(state);
    } else {
      state  = `/group-insurance/group-health/${this.state.provider}/reportdetails/${this.state.policy_data.lead_id}`;
      this.navigate(state);
    }

    
  }

  render() {
    let {policy_data, screenData, provider} = this.state;
    return (
      <Container
        provider={this.state.provider}
        showLoader={this.state.show_loader}
        noHeader={this.state.show_loader}
        title={this.state.commonMapper['top_title']}
        handleClick={this.handleClick}
        edit={this.props.edit}
        fullWidthButton={true}
        onlyButton={true}
        buttonTitle={this.state.commonMapper.button_title}
        events={this.sendEvents('just_set_events')}
        headerData={{
          icon: 'close'
        }}
      >
        <div className="gold-payment-container" id="goldSection">
          <div>
            <img style={{ width: '100%' }}
              src={require(`assets/${this.state.productName}/${this.state.commonMapper['top_icon']}.svg`)}
              alt="" />
          </div>
          <div className="main-tile">

            <div>
              {this.state.paymentSuccess && provider === 'RELIGARE' &&
              <div>
                {policy_data.policy_number && 
                <p className="top-content">
                  Payment of {inrFormatDecimal2(this.state.lead.total_amount)} for {this.state.lead.base_plan_title} {this.state.lead.plan_title} is successful.
                {policy_data.policy_number && <span>Now you have access to {screenData.total_cities}+ cashless hospitals.</span>}
                </p>
                }
                {!policy_data.policy_number && 
                <p className="top-content">
                  You will soon be contacted by {this.state.lead.base_plan_title} team for a medical review before issuing the policy!
                </p>
                }

                </div>
              }


            {this.state.paymentSuccess && provider === 'HDFCERGO' &&
              <div>
                <p className="top-content">
                  Payment of {inrFormatDecimal2(this.state.lead.total_amount)} for {this.state.providerData.title} {this.state.lead.plan_title} is successful.
                {policy_data.policy_number && <span>Now you have access to {screenData.total_cities}+ cashless hospitals.</span>}
                </p>

                </div>
              }

            {this.state.paymentSuccess && provider === 'STAR' &&
              <div>
                <p className="top-content">
                Your application is currently under process, please check 
                the policy status in 10 minutes from the “Reports section”.
                </p>

                </div>
              }

              {this.state.paymentPending &&
                <div>
                  <p className="top-content">
                    Payment of {inrFormatDecimal2(this.state.lead.total_amount)} for {provider === 'HDFCERGO' ? this.state.providerData.title  : this.state.lead.base_plan_title} {this.state.lead.plan_title} is pending.
                          </p>
                </div>
              }

              {this.state.paymentFailed &&
                <div>
                  <p className="top-content">
                    Payment of {inrFormatDecimal2(this.state.lead.total_amount)} for {provider === 'HDFCERGO' ? this.state.providerData.title  : this.state.lead.base_plan_title} {this.state.lead.plan_title} has failed.
                            </p>
                  <p className="top-content">
                    If amount has been debited it will be refunded back to you in 3-5 business days.
                  </p>
                </div>
              }

            </div>



            {this.state.paymentSuccess &&
              <div style={{ margin: '30px 0 30px 0', display: 'flex', position: 'relative' }} className="highlight-text highlight-color-info">
                <div>
                 {this.state.providerData.logo && <img className="highlight-text11"
                    src={require(`assets/${this.state.providerData.logo}`)}
                    style={{ width: 30 }}
                    alt="info" />}
                </div>

                <div>
                  <div className="highlight-text1">

                    <div className="highlight-text12" style={{ display: 'flex' }}>
                      <div>
                        {this.state.providerData.subtitle}
                      </div>
                    </div>
                  </div>
                  <div className="highlight-text2" style={{ color: '#767E86', marginLeft: 7 }}>
                    <div style={{ margin: '5px 0 6px 0' }}>Sum 
                    insured {numDifferentiationInr(this.state.lead.sum_assured)} for {this.state.lead.tenure} year</div>
                    {policy_data.policy_number && 
                    <div style={{ margin: '5px 0 6px 0' }}>Policy number: {policy_data.policy_number || '-'}</div>
                    }
                    {!policy_data.policy_number && this.state.provider === 'HEFCERGO' &&
                    <div style={{ margin: '5px 0 6px 0' }}>Transaction number. : {policy_data.ergo_payment_id || '-'}</div>
                    }
                     {!policy_data.policy_number && this.state.provider === 'RELIGARE' &&
                    <div style={{ margin: '5px 0 6px 0' }}>Propsal number : {policy_data.proposal_number || '-'}</div>
                    }
                    {/* <div style={{ margin: '5px 0 6px 0' }}>
                      {formatDateAmPm(this.state.policy_data.transaction_date)}
                      </div> */}
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
                      {inrFormatDecimal2(this.state.lead.base_premium_showable || this.state.lead.premium)}
                    </div>
                  </div>

                  {this.state.lead.add_ons_amount && 
                    <div className="content-points">
                      <div className="content-points-inside-text">
                       Add ons amount
                      </div>
                      <div className="content-points-inside-text">
                        {inrFormatDecimal2(this.state.lead.add_ons_amount)}
                      </div>
                    </div>
                  }

                  <div className="content-points">
                    <div className="content-points-inside-text">
                      GST
                                </div>
                    <div className="content-points-inside-text">
                      {inrFormatDecimal2(this.state.lead.tax_amount)}
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
                      {inrFormatDecimal2(this.state.lead.total_amount)}
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
