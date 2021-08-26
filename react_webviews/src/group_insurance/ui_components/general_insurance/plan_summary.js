import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import provider from 'assets/provider.svg';
import { getUrlParams, numDifferentiationInr, storageService } from '../../../utils/validators';

import Api from 'utils/api';
import { getConfig, getBasePath } from 'utils/functions';
import { insuranceStateMapper, insuranceProductTitleMapper } from '../../constants';
import { nativeCallback } from 'utils/native_callback';
import instant_fisdom from 'assets/instant_fisdom.svg';
import instant_myway from 'assets/instant_myway.svg';
import {Imgc} from 'common/ui/Imgc';
import { isRmJourney, getShortUrl } from 'group_insurance/products/group_health/common_data';

class PlanSummaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      parent: this.props.parent,
      summaryData: {},
      leadData: this.props.parent.props.location.state ? this.props.parent.props.location.state.lead : '',
      type: getConfig().productName,
      group_insurance_payment_started: window.sessionStorage.getItem('group_insurance_payment_started') || '',
      isRmJourney: isRmJourney(),
      isGuestUser : storageService().getBoolean('guestUser') || getUrlParams().guestUser,
      screen_name: 'plan_summary'
    };
    this.getShortUrl = getShortUrl.bind(this);
    this.handleClickCurrent = this.handleClickCurrent.bind(this);
    
  }

  componentWillMount() {

    if (this.state.group_insurance_payment_started) {
      window.sessionStorage.setItem('group_insurance_payment_started', '');
    }
    
    let instant_icon = this.state.type !== 'fisdom' ? instant_myway : instant_fisdom;
    let product_title = insuranceProductTitleMapper[this.props.parent ? this.props.parent.state.product_key : ''];
    nativeCallback({ action: 'take_control_reset' });
    let lead_id = window.sessionStorage.getItem('group_insurance_lead_id_selected') || getUrlParams().leadId;
    storageService().set('group_insurance_lead_id_selected', lead_id)

    this.setState({
      lead_id: lead_id || '',
      instant_icon: instant_icon,
      product_title: product_title
    })

  }

  setErrorData = (type, func) => {

    this.setState({
      showError: false
    });
    if(type) {
      let mapper = {
        'onload':  {
          handleClick1: this.onload,
          button_text1: 'Retry',
          title1: ''
        },
        'submit': {
          handleClick1:  func ? func : this.handleClickCurrent,
          button_text1: 'Retry',
          handleClick2: () => {
            this.setState({
              showError: false
            })
          },
          button_text2: 'Dismiss'
        }
      };
  
      this.setState({
        errorData: {...mapper[type], setErrorData : this.setErrorData}
      })
    }

  }

  onload = async() => {
    this.setErrorData('onload');

    if (this.state.group_insurance_payment_started) {
      this.navigate('payment-callback');
      return;
    }

    var lead = this.state.leadData;

    if(!this.state.leadData) {
      this.setState({
        skelton: true
      })
      let error = '';
      let errorType = '';
      let url = ''
      let res = {}
      const summary_url = 'api/insurancev2/api/insurance/bhartiaxa/lead/get/' + this.state.lead_id;
      const urlParams = getUrlParams();
      try {

        if(urlParams.guestUser){
          const guestLeadId = storageService().get('guestLeadId') || urlParams.guestLeadId ||'';
          url  = `api/guest/user/session/summary/data/fetch?guest_lead_id=${guestLeadId}`
          const body = {
            'summary_url':  summary_url
          }
          res = await Api.post(url, body)
          lead = res.pfwresponse.result.insurancev2_result.lead;
        }else{
          url  = summary_url
          res = await Api.get(url)
          lead = res.pfwresponse.result.lead;
        }
        
        
        if (res.pfwresponse.status_code === 200) {
          this.setState({
            skelton: false
          })
        } else {
          error = res.pfwresponse.result.error || res.pfwresponse.result.message
          || true;
        }
      } catch (err) {
        error= true;
        errorType= "crash";
      }
  
       // set error data
       if(error) {
        this.setState({
          errorData: {
            ...this.state.errorData,
            title2: error,
            type: errorType
          },
          showError:'page'
        })
      }
  
    }

    let summaryData = {
      "product_title": lead.product_title || '',
      "cover_amount": lead.cover_amount || '',
      "product_coverage": lead.product_coverage || '',
      "dt_policy_start": lead.dt_policy_start || '',
      "dt_policy_end": lead.dt_policy_end || '',
      "base_premium": lead.base_premium || '',
      "tax_amount": lead.tax_amount || '',
      "premium": lead.premium || ''
    }

    this.setState({
      summaryData: summaryData
    })

    
  }
  async componentDidMount() {
    this.onload();
  }


  componentDidUpdate(prevState) {

    if (this.state.parent !== this.props.parent) {
      this.setState({
        parent: this.props.parent || {}
      })
    }
  }

  navigate = (pathname) => {
    this.props.parent.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  async handleClickCurrent() {

    this.setErrorData('submit');
    let error='';
    let errorType = '';
    try {
      this.setState({
        show_loader: 'button'
      })
      let res2;
      const url = 'api/insurancev2/api/insurance/bhartiaxa/start/payment?lead_id=' + this.state.lead_id;
      res2 = await Api.get(url)

      if (res2.pfwresponse.status_code === 200) {
        let basepath = getBasePath();
        let current_url = basepath + '/group-insurance/' +
          insuranceStateMapper[this.props.parent.state.product_key] + '/summary' + getConfig().searchParams

        let nativeRedirectUrl = current_url;

        let paymentRedirectUrl = encodeURIComponent(
          basepath + '/group-insurance/' + insuranceStateMapper[this.props.parent.state.product_key] + '/payment'
        );

        var payment_link = res2.pfwresponse.result.payment_link;
        var pgLink = payment_link;
        let app = getConfig().app;
        var back_url = encodeURIComponent(current_url);
        // eslint-disable-next-line
        pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl +
          '&app=' + app + '&back_url=' + back_url + '&generic_callback=' + getConfig().generic_callback;

        if (getConfig().code) {
          pgLink += '&partner_code=' + getConfig().code;
        }

        this.sendEvents('next');

        window.sessionStorage.setItem('group_insurance_payment_url', pgLink);
        window.sessionStorage.setItem('group_insurance_payment_urlsafe', res2.pfwresponse.result.insurance_payment_urlsafe || '');
        window.sessionStorage.setItem('group_insurance_payment_started', true);

        if (getConfig().app === 'ios') {
          nativeCallback({
            action: 'show_top_bar', message: {
              title: 'Payment'
            }
          });
        }
        nativeCallback({
          action: 'take_control', message: {
            back_url: nativeRedirectUrl,
            back_text: 'Are you sure you want to exit the payment process?'
          }
        });

        window.location.href = pgLink;

      } else {
        this.setState({
          show_loader: false
        })
        error=res2.pfwresponse.result.error || res2.pfwresponse.result.message
          || true;
      }

    } catch (err) {
      this.setState({
        show_loader:false,
      })
      error=true;
      errorType= "crash";
    }
    if(error) {
      this.setState({
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType
        },
        showError:true
      })
    }
  }

  sendEvents(user_action, insurance_type) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'summary',
        "type": this.props.parent.state.product_key,
        'rm_payment_link_copied': user_action === 'copy' ? 'yes' : 'no',
        'guest_user_make_payment': this.state.isGuestUser ? 'yes' : 'no',
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }
  
  copyPaymentLink = () =>{
    this.sendEvents('copy');
    var productMapper = {
      'DENGUE': 'dengue', 
      'HOSPICASH': 'hospicash', 
      'PERSONAL_ACCIDENT': 'accident',
      'SMART_WALLET': 'wallet'
    }
    
    var guestLeadId = storageService().get('guestLeadId')
    var baxaSumaryUrl = `${window.location.origin}/group-insurance/${productMapper[this.props.parent.state.product_key]}/summary${getConfig().searchParams}&leadId=${this.state.lead_id}&guestLeadId=${guestLeadId}&guestUser=true`
    
    this.setErrorData('submit', this.copyPaymentLink)
    this.getShortUrl(baxaSumaryUrl);
  }

  render() {

    return (
      <Container
        fullWidthButton={true}
        buttonTitle={this.state.isRmJourney ? 'Copy payment link' : 'Make payment'}
        onlyButton={true}
        noBackIcon={this.state.isGuestUser}
        product_key={this.props.parent ? this.props.parent.state.product_key : ''}
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
        handleClick={this.state.isRmJourney ? this.copyPaymentLink : this.handleClickCurrent}
        title="Summary"
        classOverRide="fullHeight"
        classOverRideContainer="plan-summary"
      >
        <div className="plan-summary-heading">
          <div className="plan-summary-heading-text">{this.state.product_title}</div>
          <Imgc style={{width: '79px', height: '56px'}} src={provider} alt="" />
        </div>
        <div className="plan-summary-mid">
          <div className="plan-summary-mid1">
            {this.props.parent.state.product_key !== 'CORONA' &&
              <div className="plan-summary-mid11">Cover amount</div>
            }
            {this.props.parent.state.product_key === 'CORONA' &&
              <div className="plan-summary-mid11">Sum assured</div>
            }
            <div className="plan-summary-mid12">{numDifferentiationInr(String(this.state.summaryData.cover_amount || 0))}
              {this.props.parent.state.product_key === 'HOSPICASH' && <span>/day</span>}
            </div>
          </div>
          <div className="plan-summary-mid1">
            <div className="plan-summary-mid11">Cover period</div>
            <div className="plan-summary-mid12">{this.state.summaryData.product_coverage} year</div>
          </div>
          <div className="plan-summary-mid1 plan-summary-mid1-bg">
            <div className="plan-summary-mid11">Start date</div>
            <div className="plan-summary-mid12">{this.state.summaryData.dt_policy_start}</div>
          </div>
          <div className="plan-summary-mid1">
            <div className="plan-summary-mid11">End date</div>
            <div className="plan-summary-mid12">{this.state.summaryData.dt_policy_end}</div>
          </div>
        </div>
        <div className="plan-summary-premium">
          <div className="plan-summary-premium-heading">Premium details:</div>
          <div className="plan-summary-premium-list">
            <div className="plan-summary-premium-list1">Base premium</div>
            <div className="plan-summary-premium-list2">{numDifferentiationInr(this.state.summaryData.base_premium)}</div>
          </div>
          <div className="plan-summary-premium-list">
            <div className="plan-summary-premium-list1">GST & taxes</div>
            <div className="plan-summary-premium-list2">{numDifferentiationInr(this.state.summaryData.tax_amount)}</div>
          </div>
          <div className="divider"></div>
          <div className="plan-summary-premium-list">
            <div className="plan-summary-premium-list1 plan-summary-premium-font">Total payable</div>
            <div className="plan-summary-premium-list2 plan-summary-premium-amount">{numDifferentiationInr(this.state.summaryData.premium)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 0 0' }}>
          <div style={{
            marginTop: '10px', fontSize: '14px', lineHeight: '24px', color: '#4a4a4a',
            display: 'flex'
          }}>
            <img style={{ margin: '0px 5px 0 0' }} src={this.state.instant_icon} alt="" />
            Instant policy issuance
            </div>
        </div>
        <div className="baxa-disclaimer">
          <p style={{ color: getConfig().styles.primaryColor, marginBottom: '25px', textAlign: 'center'}}>*Maximum of 2 policy purchases per user allowed, anymore can lead to dispute during claim</p>
        </div>
      </Container>
    );


  }
}

const PlanSummary = (props) => (
  <PlanSummaryClass
    {...props} />
);

export default PlanSummary;