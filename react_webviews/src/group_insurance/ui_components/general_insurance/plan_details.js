import React, { Component } from 'react';
import Container from '../../common/Container';
import ic_read_fisdom from 'assets/ic_read_fisdom.svg';
import ic_read_myway from 'assets/ic_read_myway.svg';
import ic_claim_assist_fisdom from 'assets/ic_claim_assist_fisdom.svg';
import ic_claim_assist_myway from 'assets/ic_claim_assist_myway.svg';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import bhartiaxa_logo from 'assets/provider.svg'

import instant_fisdom from 'assets/instant_fisdom.svg';
import instant_myway from 'assets/instant_myway.svg';


import ic_ci_d1_fisdom from 'assets/ic_ci_d1_fisdom.svg';
import ic_ci_d1_myway from 'assets/ic_ci_d1_myway.svg';

import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { insuranceProductTitleMapper } from '../../constants';
import {
  inrFormatDecimal, calculateAge
} from 'utils/validators';

const coverAmountMapper = {
  'PERSONAL_ACCIDENT': {
    1000000: 0,
    500000: 1,
    200000: 2,
  },
  'HOSPICASH': {
    10000: 0,
    7500: 1,
    5000: 2,
    1500: 3,
  },
  'SMART_WALLET': {
    50000: 2,
    100000: 1,
    150000: 0
  },
  'DENGUE': {
    35000: 0,
    25000: 1,
    15000: 2,
  },
  'CORONA': {
    // 100000: 0,
    50000: 0,
    25000: 1,
  },
  'HEALTH_SURAKSHA': {
    7500000: 0,
    1500000: 1,
    500000: 2
  },
  'HEALTH_SUPER_TOPUP': {
    1600000: 0,
    1100000: 1,
    600000: 2
  }
}

const premiumAmountMapper = {
  'CRITICAL_HEALTH_INSURANCE': {
    1150: 0,
    1000: 1
  },
  'HOME_INSURANCE': {
    328: 0,
    182: 1
  }
}

let styles = {};

class PlanDetailsClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      skelton: true,
      checked: true,
      parent: this.props.parent || {
        'plan_data': {

        }
      },
      type: getConfig().productName,
      color: getConfig().primary,
      quoteData: {},
      premiudmDtailsStored: window.sessionStorage.getItem('group_insurance_plan_final_data') ?
        JSON.parse(window.sessionStorage.getItem('group_insurance_plan_final_data')) : ''
    };

    this.renderPlans = this.renderPlans.bind(this);
    this.openInBrowser = this.openInBrowser.bind(this);
    this.handleClickCurrent = this.handleClickCurrent.bind(this);

  }

  componentWillMount() {
    let productTitle = insuranceProductTitleMapper[this.props.parent ? this.props.parent.state.product_key : ''];
    if (this.props.parent.state.product_key === 'SMART_WALLET') {
      productTitle += ' (fraud protection)';
    }

    let instant_issuance = this.props.parent.state.integeration_type === 'redirection' ? false : true;
    let isRedirectionModal = this.props.parent.state.integeration_type === 'redirection' ? true : false;
    let instant_icon = this.state.type !== 'fisdom' ? instant_myway : instant_fisdom;
    let lead_id = window.sessionStorage.getItem('group_insurance_lead_id_selected') || '';
    let ic_ci_d1_icon = this.state.type !== 'fisdom' ? ic_ci_d1_myway : ic_ci_d1_fisdom;
    this.setState({
      lead_id: lead_id || '',
      instant_icon: instant_icon,
      productTitle: productTitle,
      instant_issuance: instant_issuance,
      ic_ci_d1_icon: ic_ci_d1_icon,
      isRedirectionModal: isRedirectionModal
    })

  }

  openInBrowser(url, type) {
    if (!url) {
      return;
    }

    let header_title_mapper = {
      'terms_and_conditions': 'Terms & Conditions',
      'read_document': this.state.productTitle ? this.state.productTitle + ' - details' : 'Read Detailed Document'
    }

    let current_url = window.location.href;
    this.sendEvents(type);

    if (getConfig().Web || getConfig().redirect_url) {
      nativeCallback({
        action: 'open_in_browser',
        message: {
          url: url
        }
      });
    } else {
      this.setState({
        show_loader: true
      })


      nativeCallback({
        action: 'take_control', message: {
          back_url: current_url,
          show_top_bar: false
        },

      });

      nativeCallback({
        action: 'show_top_bar', message: {
          title: header_title_mapper[type], icon: 'close'
        }
      });

      nativeCallback({ action: 'open_pdf', message: { url: url } });
    }

  }

  setPremiumData(premium_details, leadData) {
    if (!leadData || Object.keys(leadData).length === 0) {
      this.setState({
        selectedIndex: this.props.parent.state.recommendedIndex || 0
      })
      return;
    }
    Object.keys(premium_details).forEach((key) => {
      premium_details[key] = leadData[key]
    })

    let premiumMapper = ["CRITICAL_HEALTH_INSURANCE", "HOME_INSURANCE"];
    let product_key = this.props.parent.state.product_key;

    let mapper = coverAmountMapper;
    let mapperValue = premium_details.cover_amount;

    if (premiumMapper.indexOf(product_key) !== -1) {
      mapper = premiumAmountMapper;
      mapperValue = premium_details.premium;
    }

    let selectedIndex = mapper[product_key][mapperValue] || this.props.parent.state.recommendedIndex;
    this.setState({
      selectedIndex: selectedIndex || 0
    })
  }

  setErrorData = (type) => {

    this.setState({
      showError: false
    });
    if(type) {
      let mapper = {
        'onload':  {
          handleClick1: this.onload,
          button_text1: 'Retry'
        },
        'submit': {
          handleClick1: this.handleClickCurrent,
          button_text1: 'Retry',
          handleClick2: () => {
            this.setState({
              showError: false
            })
          },
          button_text2: 'DISMISS'
        }
      };
  
      this.setState({
        errorData: mapper[type]
      })
    }

  }

  onload = async () => {

    this.setErrorData('onload');

    this.setState({
      skelton: true,
      ic_claim_assist: this.state.type !== 'fisdom' ? ic_claim_assist_myway : ic_claim_assist_fisdom,
      ic_read: this.state.type !== 'fisdom' ? ic_read_myway : ic_read_fisdom
    })

    let premium_details = {
      "product_name": this.props.parent.state.product_key,
      cover_amount: '',
      premium: '',
      tax_amount: ''
    };

    styles.color = {
      color: this.state.color
    }

    let error = '';
    let errorType = '';
    try {
      
      let provider = this.props.parent.state.provider || 'bhartiaxa';
      let service = provider === 'bhartiaxa' ? 'insurancev2': 'ins_service';
      
      const resQuote = await Api.get('/api/'+ service +'/api/insurance/' +
        provider + '/get/quote?product_name=' +
        this.props.parent.state.product_key)

      if (resQuote && resQuote.pfwresponse.status_code === 200) {

        let quoteData = resQuote.pfwresponse.result;
        this.setState({
          quoteData: quoteData,
          productTitle: quoteData.product_title || this.state.productTitle
        })

      } else {
        error = resQuote.pfwresponse.result.error || resQuote.pfwresponse.result.message
        || true;
      }

      if (this.state.lead_id) {
        let res = await Api.get('api/insurancev2/api/insurance/bhartiaxa/lead/get/' + this.state.lead_id)


        if (res.pfwresponse.status_code === 200) {

          var leadData = res.pfwresponse.result.lead;
          this.setPremiumData(premium_details, leadData);
          this.setState({
            leadData: leadData,
            skelton: false
          })

        } else {
          error = res.pfwresponse.result.error || res.pfwresponse.result.message
          || true;
        }
      } else {

        let data = {};
        if (this.state.premiudmDtailsStored) {
          data = this.state.premiudmDtailsStored[this.props.parent.state.product_key] || {};
        }
        this.setPremiumData(premium_details, data || {});

        if(!error) {
          this.setState({
            skelton: false
          })
        }
        
      }

    } catch (err) {
      console.log(err)
      error = true;
      errorType = 'crash';
      this.setState({
        skelton:false
      })
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

    this.setState({
      premium_details: premium_details
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

  selectPlan = (index) => {
    this.setState({
      selectedIndex: index
    });
  }

  renderBenefits = (props, index) => {
    return (
      <div key={index} className={`plan-details-item ${(props.isDisabled) ? 'disabled' : ''}`}
      >
        <img className="plan-details-icon" src={props.icon} alt="" />
        <div>
          <div className="plan-details-text">{props.disc}</div>
          {((props.isDisabled && props.disc2) ||
            (this.props.parent.state.product_key === 'HOSPICASH' && props.disc2))
            && <div style={{ color: '#6F6F6F', margin: '7px 0 0 0', fontSize: 10 }}>
              {props.disc2}</div>}
        </div>
      </div>
    )
  }

  renderThings = (props, index) => {
    return (
      <div key={index} onClick={() => this.openThings(props)} style={{
        display: 'flex', alignItems: 'center', borderTop: index === 0 ? '1px solid #EFEDF2' : '', borderBottom: '1px solid #EFEDF2', paddingTop: '15px',
        paddingBottom: '15px', cursor: 'pointer'
      }}>
        <img className="plan-details-icon" src={props.icon} alt="" />
        <div>
          <div className="plan-details-text">{props.disc} ?</div>
        </div>
      </div>
    )
  }

  renderDiseases = (props, index) => {
    return (
      <div key={index} className={`plan-details-item ${(props.isDisabled) ? 'disabled' : ''}`}>
        <div className="plan-diseases-text">{index + 1}. {props}</div>
      </div>
    )
  }

  renderPlans(props, index) {
    if (this.state.selectedIndex === index) {
      styles.activeplan = {
        border: `2px solid ${this.state.color}`
      }
    } else {
      styles.activeplan = {
        border: `2px solid #fff`
      }
    }

    return (
      <div key={index}
        style={styles.activeplan}
        className={`accident-plan-item`}
        onClick={() => this.selectPlan(index)}>
        {!props.product_plan_title &&
          <div className="accident-plan-item1">
            {!props.cover_text && this.props.parent.state.product_key !== 'CORONA' && <span>Cover amount</span>}
            {!props.cover_text && this.props.parent.state.product_key === 'CORONA' && <span>Sum assured</span>}
            {props.cover_text && <span>{props.cover_text}</span>}
          </div>}

        {props.product_plan_title && <div className="accident-plan-item1">
          <span style={{ color: '#160d2e', fontSize: 14 }}>{props.product_plan_title}</span>
        </div>}

        {props.plan_title &&
          <div className="accident-plan-item2">
            {props.plan_title}
          </div>}

        {!props.plan_title && !props.product_plan_title && props.sum_assured &&
          <div className="accident-plan-item2">
            {props.plan_title || inrFormatDecimal(props.sum_assured)}
            {this.props.parent.state.product_key === 'HOSPICASH' && <span>/day</span>}
          </div>}
          {!this.state.isRedirectionModal && this.props.parent.state.product_key === 'CORONA' && <span className="accident-plan-item4" >in</span>}
        <div className="accident-plan-item3" style={{ display: this.state.isRedirectionModal ? 'grid' : 'flex' }}>
          {!this.state.isRedirectionModal && this.props.parent.state.product_key !== 'CORONA' && <span className="accident-plan-item4">in</span>}
          {this.state.isRedirectionModal && <span className="accident-plan-item4" style={{ marginBottom: 3 }}>starts from</span>}
          {this.props.parent.state.product_key !== 'CORONA' &&
            <span className="accident-plan-item-color" style={{ color: getConfig().primary, fontWeight: 'bold' }}>₹
          {props.premium}/{props.plan_frequency || 'year'}</span>
          }
          {this.props.parent.state.product_key === 'CORONA' &&
            <span className="accident-plan-item-color" style={{ color: getConfig().primary, fontWeight: 'bold', marginTop : '-20px'}}>₹
          {props.premium} <span style={{ fontSize: '9px', color: '#6f6f6f' }}>{props.plan_frequency || 'for a year'}</span></span>
          }
        </div>
        {props.plus_benefit &&
          <div className="accident-plan-benefit" style={styles.color}>
            {props.plus_benefit}
          </div>
        }
        {!props.card_top_info && this.state.parent.state.recommendedIndex === index &&
          <div className="recommended">RECOMMENDED</div>
        }

        {props.card_top_info &&
          <div className="card-top-info">
            {props.card_top_info}
          </div>}
      </div>
    )
  }

  navigate = (pathname, search, premium_details, diseasesData) => {
    this.props.parent.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams,
      params: {
        diseasesData: diseasesData || {}
      }
    }, {premium_details: premium_details});
  }

  async handleClickCurrent() { 
    this.sendEvents('next');

    this.setErrorData('submit');

    var final_data = {
      "product_plan": this.props.parent.state.plan_data.premium_details[this.state.selectedIndex].product_plan,
      "premium": this.props.parent.state.plan_data.premium_details[this.state.selectedIndex].premium,
      "cover_amount": this.props.parent.state.plan_data.premium_details[this.state.selectedIndex].sum_assured,
      "tax_amount": this.props.parent.state.plan_data.premium_details[this.state.selectedIndex].tax_amount,
      "productTitle": this.state.productTitle
    } 
    final_data.product_name = this.props.parent.state.product_key;
    let group_insurance_plan_final_data = this.state.group_insurance_plan_final_data || {};
    group_insurance_plan_final_data[final_data.product_name] = final_data;
    window.sessionStorage.setItem('group_insurance_plan_final_data',
      JSON.stringify(group_insurance_plan_final_data));

   

    if (this.state.isRedirectionModal) {
      this.navigate('form-redirection', '', final_data);
      return;
    }

    this.setState({
      show_loader: 'button'
    });

    let error = '';
    let errorType = '';
    try {

      let res2 = {};
      if (this.state.lead_id) {
        final_data.lead_id = this.state.lead_id;
        res2 = await Api.post('api/insurancev2/api/insurance/bhartiaxa/lead/update', final_data)


        if (res2.pfwresponse.status_code === 200) {
          let dt_created = res2.pfwresponse.result.updated_lead.dt_created;
          dt_created = dt_created.replace(/\\-/g, '/').split('-').join('/');
          let createdAge = calculateAge(dt_created);
          let ageRef = calculateAge('18/11/2020');
          let diffAge = ageRef - createdAge;

          final_data.lead  = res2.pfwresponse.result.updated_lead || {};


          if(this.props.parent.state.product_key === 'CORONA' && diffAge <= 0){
            this.navigate('declaration', '', final_data);
          } else{
            this.navigate('form', '', final_data);
          }
        } else {
          this.setState({
            show_loader: false
          })
          error = res2.pfwresponse.result.error || res2.pfwresponse.result.message
          || true;
        }
      } else {
          if(this.props.parent.state.product_key === 'CORONA' && !this.state.lead_id){
             this.navigate('declaration', '', final_data);
          }else {
            this.navigate('form', '', final_data);
      }
    }
    } catch (err) {
      error = true;
      errorType = "crash";
      this.setState({
        show_loader: false
      })                                                                                                                                                                          
    }
    // set error data
    if(error) {
      this.setState({
        show_loader:false,
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType
        },
        showError:true
      })
    }

  }

  openDiseases() {

    if (!this.props.parent.state.plan_data.premium_details) {
      return;
    }

    let plan_selected = this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0];
    let product_diseases_covered = plan_selected.product_diseases_covered;

    let dieseasesTitle = 'HDFC ERGO ' + plan_selected.product_plan_title + ' plan';
    let diseasesData = {
      product_diseases_covered: product_diseases_covered,
      dieseasesTitle: dieseasesTitle
    }

    this.navigate('/group-insurance/common/diseases', '', '', diseasesData);

  }

  openThings = (props) => {
    this.sendEvents('next', props.key);
    if (props.key === 'claim') {
      this.openClaim();
    } else {
      this.openCovered(props);
    }
  }

  openCovered = (props) => {
    if (!props.data) {
      return;
    }

    let dieseasesTitle = props.disc;
    let diseasesData = {
      product_diseases_covered: props.data,
      dieseasesTitle: dieseasesTitle,
      key: props.key
    }

    if (props.key === 'is_covered') {
      this.navigate('/group-insurance/common/cover', '', '', diseasesData);
    } else if (props.key === 'not_covered') {
      this.navigate('/group-insurance/common/notcover', '', '', diseasesData);
    }

  }

  openClaim() {

    this.navigate('/group-insurance/common/claim', '', '');

  }

  sendEvents(user_action, type) {
    let selectedIndex = this.state.selectedIndex || 0;
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'plan_details',
        "type": this.props.parent.state.product_key,
        "cover_amount": this.props.parent.state.plan_data.premium_details[selectedIndex] ?
          this.props.parent.state.plan_data.premium_details[selectedIndex].sum_assured : '',
        "premium": this.props.parent.state.plan_data.premium_details[selectedIndex] ?
          this.props.parent.state.plan_data.premium_details[selectedIndex].premium : '',
        "cover_period": 1,
        "tnc_checked": "yes"
      }
    };

    if (this.props.parent.state.product_key === 'CORONA' && type) {
      if (type === 'is_covered') {
        eventObj.properties.is_covered = "yes";
      } else if (type === "not_covered") {
        eventObj.properties.not_covered = "yes";
      } else if (type === "claim") {
        eventObj.properties.claim = "yes";
      }
    }
    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        fullWidthButton={true}
        product_key={this.props.parent ? this.props.parent.state.product_key : ''}
        buttonTitle={this.props.parent.state.provider === 'hdfcergo' ? 'Get Free Quote' : 'Get this Plan'}
        onlyButton={true}
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        showError={this.state.showError}
        // showError={true}
        errorData={this.state.errorData}
        handleClick={() => this.handleClickCurrent()}
        title={this.state.productTitle || ''}
        classOverRideContainer="accident-plan">
        <div className="accident-plan-heading-container">
          <div className="accident-plan-heading">
            {this.props.parent.state.product_key !== 'CORONA' &&
              <h1 className="accident-plan-title">{this.state.productTitle}</h1>
            }
            {this.props.parent.state.product_key === 'CORONA' &&
              <h1  style={{fontWeight:'bold'}} className="accident-plan-title">{this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].product_tag_line} 
              <span style={{fontWeight:'400'}}>{this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].product_tag_line2}</span> </h1>
            }
            <img src={this.state.quoteData.logo || bhartiaxa_logo} alt="" />
          </div>
          <div className="accident-plan-subtitle">
            {this.props.parent.state.plan_data.product_tag_line}
          </div>
        </div>
        <div className="accident-plans">
          {this.state.instant_issuance && <div style={{ display: 'flex', justifyContent: 'flex-end', margin: ' 0 0px 0 0' }}>
            <div style={{
              fontSize: '14px', lineHeight: '24px', color: '#4a4a4a',
              display: 'flex', width: 'fit-content', background: '#ede9f5', padding: '0px 10px 0 10px'
            }}>
              <img style={{ margin: '0px 5px 0 0' }} src={this.state.instant_icon} alt="" />
              instant policy issuance
              </div>
          </div>}
          <div style={{ paddingTop: 20 }} className="accident-plan-heading-title">Select a plan</div>
          <div className="accident-plan-list-container">
            <div className="accident-plan-list">
              {this.props.parent && this.props.parent.state.plan_data &&
                this.props.parent.state.plan_data.premium_details &&
                this.props.parent.state.plan_data.premium_details.map(this.renderPlans)}
            </div>
          </div>
        </div>
        {this.props.parent.state.product_key === 'DENGUE' &&
          <div style={{ marginTop: '40px', padding: '0 15px' }}>
            <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '500', marginBottom: '10px' }}>Diseases covered</div>


            <div className="plan-details">

            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {this.props.parent && this.props.parent.state.plan_data &&
                this.props.parent.state.plan_data.premium_details &&
                this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].product_diseases_covered.map(this.renderDiseases)}
            </div>
          </div>
        } 

        {this.props.parent.state.product_key === 'CRITICAL_HEALTH_INSURANCE' &&
          <div style={{ marginTop: '40px', padding: '0 15px' }}>
            <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '500', marginBottom: '10px' }}>Diseases covered</div>
            <div className="plan-details-item" >
              <img className="plan-details-icon" src={this.state.ic_ci_d1_icon} alt="" />
              <div>
                <div className="plan-details-text">{this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].product_diseases_covered.length} life-threatening diseases covered</div>
                <div onClick={() => this.openDiseases()} className="round-visible-button">
                  Diseases covered &nbsp;&nbsp;&nbsp;
                </div>
              </div>
            </div>
          </div>
        }

        <div style={{ marginTop: '40px', padding: '0 15px' }}>
          <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '500', marginBottom: '10px' }}>

            {!this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].product_benefits_title && this.props.parent.state.product_key !== 'CORONA' &&
              <span>Benefits that are covered</span>}
            {!this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].product_benefits_title && this.props.parent.state.product_key === 'CORONA' &&
              <span>Plan benefits</span>}
            {this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].product_benefits_title &&
              <span>{this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].product_benefits_title}</span>}
          </div>


          <div className="plan-details">
          </div>

          {this.props.parent && this.props.parent.state.plan_data &&
            this.props.parent.state.plan_data.premium_details &&
            this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].product_benefits.map(this.renderBenefits)}
        </div>

        {this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].product_benefits2 &&

          <div style={{ marginTop: '40px', padding: '0 15px' }}>
            <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '500', marginBottom: '10px' }}>

              {!this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].product_benefits_title2 &&
                <span>Benefits that are covered</span>}
              {this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].product_benefits_title2 &&
                <span>{this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].product_benefits_title2}</span>}
            </div>


            <div className="plan-details">
            </div>

            {this.props.parent && this.props.parent.state.plan_data &&
              this.props.parent.state.plan_data.premium_details &&
              this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].product_benefits2.map(this.renderBenefits)}
          </div>
        }
        {this.props.parent.state.product_key === 'CORONA' &&
          <div>
            <div style={{ marginTop: '40px', padding: '0 15px' }}>
              <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '500', marginBottom: '20px' }}>Things to know</div>
              <div>
                <div className="plan-details-text">{this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].things_to_know.map(this.renderThings)}</div>
              </div>

            </div>
            <div style={{ marginTop: '40px', padding: '0 15px' }}>
              <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '500' }}>Waiting period</div>
              <div>
                <div className="plan-details-text">{this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].waiting_period.map(this.renderBenefits)}</div>
              </div>
            </div>
          </div>
        }
        {this.props.parent.state.product_key !== 'CORONA' &&
          <div className="accident-plan-claim">
            <img className="accident-plan-claim-icon" src={this.state.ic_claim_assist} alt="" />
            <div>
              <div className="accident-plan-claim-title">Claim assistance</div>
              <div className="accident-plan-claim-subtitle">{this.state.quoteData.claim_assistance_line ||
                'Call Bharti AXA on toll free 1800-103-2292'}</div>
            </div>
          </div>
        }
        {this.props.parent.state.provider !== 'hdfcergo' &&
          <div className="accident-plan-read"
            onClick={() => this.openInBrowser(this.state.quoteData.read_document, 'read_document')}>
            <img className="accident-plan-read-icon" src={this.state.ic_read} alt="" />
            <div className="accident-plan-read-text" style={styles.color}>Read Detailed Document</div>
          </div>}

        <div className="CheckBlock2 accident-plan-terms" style={{}}>
          <Grid container spacing={16} alignItems="center">
            <Grid item xs={1} className="TextCenter">
              <Checkbox
                defaultChecked
                checked={this.state.checked}
                color="default"
                value="checked"
                name="checked"
                onChange={() => console.log('Clicked')}
                className="Checkbox" />
            </Grid>
            <Grid item xs={11}>
              <div className="accident-plan-terms-text" style={{}}>
                I accept <span onClick={() => this.openInBrowser(this.state.quoteData.terms_and_conditions || this.state.quoteData.tnc,
                  'terms_and_conditions')} className="accident-plan-terms-bold" style={styles.color}>
                  Terms and conditions</span></div>
            </Grid>
          </Grid>
          {this.props.parent.state.product_key === 'CORONA' &&
            <div className="bottom-info">Instant policy issuance and no paper work</div>
          }
        </div>
      </Container>
    );
  }
}

const PlanDetails = (props) => (
  <PlanDetailsClass
    {...props} />
);

export default PlanDetails;