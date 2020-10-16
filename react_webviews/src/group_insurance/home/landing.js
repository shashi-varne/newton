import React, { Component } from 'react';
import Container from '../common/Container';
import qs from 'qs';
import { insuranceStateMapper } from '../constants';
import insurance_fisdom from 'assets/ic_fisdom_insurance_fisdom.svg';
import insurance_myway from 'assets/ic_fisdom_insurance_myway.svg';

import hospicash_fisdom from 'assets/ic_hospicash_fisdom.svg';
import hospicash_myway from 'assets/ic_hospicash_myway.svg';
import accident_fisdom from 'assets/ic_personal_accident_fisdom.svg';
import accident_myway from 'assets/ic_personal_accident_myway.svg';
import wallet_fisdom from 'assets/ic_wallet_fisdom.svg';
import wallet_myway from 'assets/ic_wallet_myway.svg';
import dengue_fisdom from 'assets/ic_dengue_insurance_fisdom.svg';
import dengue_myway from 'assets/ic_dengue_insurance_myway.svg';
import corona_fisdom from 'assets/ic_coronavirus_insurance_fisdom.svg';
import corona_myway from 'assets/ic_coronavirus_insurance_myway.svg';
// import resume_tag from 'assets/resume_tag.png';

import instant_fisdom from 'assets/instant_fisdom.svg';
import instant_myway from 'assets/instant_myway.svg';

import health_fisdom from 'assets/ic_health_fisdom.svg';
import health_myway from 'assets/ic_health_myway.svg';
import insurancelogo from 'assets/life_insurance.svg'


import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { getBhartiaxaStatusToState } from '../constants';
import { nativeCallback } from 'utils/native_callback';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      type: getConfig().productName,
      insuranceProducts: [],
      partner_code: getConfig().partner_code,
      params: qs.parse(props.history.location.search.slice(1))
    }

    this.renderPorducts = this.renderPorducts.bind(this);
  }

  componentWillMount() {
    window.sessionStorage.setItem('group_insurance_payment_started', '');
    window.sessionStorage.setItem('group_insurance_payment_urlsafe', '');
    window.sessionStorage.setItem('group_insurance_plan_final_data', '');
    nativeCallback({ action: 'take_control_reset' });
    window.sessionStorage.setItem('group_insurance_payment_url', '');
    let insurance = this.state.type !== 'fisdom' ? insurance_myway : insurance_fisdom;
    //  let  health_icon  = this.state.type !== 'fisdom' ? health_myway : health_fisdom;
    let hospicash = this.state.type !== 'fisdom' ? hospicash_myway : hospicash_fisdom;
    let accident_icon = this.state.type !== 'fisdom' ? accident_myway : accident_fisdom;
    let wallet_icon = this.state.type !== 'fisdom' ? wallet_myway : wallet_fisdom;
    let instant_icon = this.state.type !== 'fisdom' ? instant_myway : instant_fisdom;
    let dengue_icon = this.state.type !== 'fisdom' ? dengue_myway : dengue_fisdom;
    let corona_icon = this.state.type !== 'fisdom' ? corona_myway : corona_fisdom;
    let health_insurance_icon = this.state.type !== 'fisdom' ? health_myway : health_fisdom;
    

    let insuranceProducts = [
      {
        key: 'LIFEINSURANCE',
        title: 'Life insurance',
        subtitle: 'Starts from ₹10,000/year',
        icon: insurancelogo
      },
      {
        key: 'HEALTH_INSURANCE',
        title: 'Health insurance',
        subtitle: 'Starts from ₹5,000/year',
        icon: health_insurance_icon
      },
      {
        key: 'CORONA',
        title: 'Coronavirus insurance',
        subtitle: 'starts from ₹459',
        icon: corona_icon
      },
      {
        key: 'PERSONAL_ACCIDENT',
        title: 'Personal accident insurance',
        subtitle: 'Starts from ₹ 200/year',
        icon: accident_icon
      },
      {
        key: 'HOSPICASH',
        title: 'Hospital daily cash',
        subtitle: 'Starts from ₹ 133/year',
        icon: hospicash
      },
      {
        key: 'SMART_WALLET',
        title: 'Smart wallet (fraud protection)',
        subtitle: 'Starts from ₹ 250/year',
        icon: wallet_icon
      }
    ];

    if (this.state.partner_code === 'hbl') {
      let index = insuranceProducts.findIndex(obj => obj.key === "CORONA");
      insuranceProducts.splice(index, 1);
    }

    let { params } = this.props.location || {};
    let openModuleData = params ? params.openModuleData : {}

    let redirect_url =  decodeURIComponent(getConfig().redirect_url);
    if(!openModuleData.sub_module && redirect_url && redirect_url.includes("exit_web")) {
      window.location.href = redirect_url;
    }

    this.setState({
      openModuleData: openModuleData || {},
      insuranceProducts: insuranceProducts,
      insurance: insurance,
      instant_icon: instant_icon,
      dengue_icon: dengue_icon
    })
  }

  async componentDidMount() {

    try {
      const res = await Api.get('/api/ins_service/api/insurance/application/summary')

      if (!this.state.openModuleData.sub_module) {
        this.setState({
          show_loader: false
        })
      }

      if (res.pfwresponse.status_code === 200) {

        var resultData = res.pfwresponse.result.response;

        let group_insurance = resultData.group_insurance;
        let term_insurance = resultData.term_insurance;
        let BHARTIAXA = group_insurance && group_insurance.insurance_apps ? group_insurance.insurance_apps.BHARTIAXA : {};
        let resumeFlagTerm = this.setTermInsData(term_insurance, BHARTIAXA);

        let resumeFlagAll = {
          'TERM_INSURANCE': resumeFlagTerm
        }

        if (!BHARTIAXA) {
          BHARTIAXA = {};
        }
        let BHARTIAXA_APPS = {
          'PERSONAL_ACCIDENT': BHARTIAXA['PERSONAL_ACCIDENT'],
          'HOSPICASH': BHARTIAXA['HOSPICASH'],
          'SMART_WALLET': BHARTIAXA['SMART_WALLET'],
          'DENGUE': BHARTIAXA['DENGUE'],
          'CORONA': BHARTIAXA['CORONA']
        }

        for (var key in BHARTIAXA_APPS) {
          let policy = BHARTIAXA_APPS[key];
          if (policy && policy.length > 0) {
            let data = policy[0];
            if (data.status !== 'complete' && data.lead_payment_status === 'payment_done') {
              resumeFlagAll[data.product_name] = true;
            } else {
              resumeFlagAll[data.product_name] = false;
            }
          }
        }

        let insuranceProducts = this.state.insuranceProducts;
        for (var i = 0; i < insuranceProducts.length; i++) {
          let key = insuranceProducts[i].key;
          insuranceProducts[i].resume_flag = resumeFlagAll[key];
        }

        this.setState({
          group_insurance: group_insurance,
          term_insurance: term_insurance,
          BHARTIAXA_APPS: BHARTIAXA_APPS,
          insuranceProducts: insuranceProducts,
          resumeFlagAll: resumeFlagAll
        })

        if (this.state.openModuleData.sub_module) {
          let navigateMapper = {
            hospicash: 'HOSPICASH',
            personal_accident: 'PERSONAL_ACCIDENT',
            smart_wallet: 'SMART_WALLET',
            term_insurance: 'TERM_INSURANCE',
            dengue: 'DENGUE',
            corona: 'CORONA'
          };

          let pathname = navigateMapper[this.state.openModuleData.sub_module] ||
            this.state.openModuleData.sub_module;
          this.handleClick(pathname);
        }

      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message
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

  navigate = (pathname, search) => {
    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams,
      params: {
        fromHome: true
      }
    });
  }

  getLeadId(product_key) {
    let id = ''
    if (product_key !== 'term_insurance') {
      if (this.state.BHARTIAXA_APPS[product_key] &&
        this.state.BHARTIAXA_APPS[product_key].length > 0) {
        id = this.state.BHARTIAXA_APPS[product_key][0].lead_id;
      }
    }

    return id;
  }

  setTermInsData(termData) {

    window.sessionStorage.setItem('excluded_providers', '');
    window.sessionStorage.setItem('required_providers', '');
    window.sessionStorage.setItem('quoteSelected', '');
    window.sessionStorage.setItem('quoteData', '');
    let pathname = '';
    let resumeFlagTerm = false;

    if (!termData.error) {
      let insurance_apps = termData.insurance_apps;
      let application, required_fields;
      required_fields = termData.required;
      if (insurance_apps.complete.length > 0) {
        application = insurance_apps.complete[0];
        pathname = 'report';
      } else if (insurance_apps.failed.length > 0) {
        application = insurance_apps.failed[0];
        pathname = 'report';
      } else if (insurance_apps.init.length > 0) {
        application = insurance_apps.init[0];
        resumeFlagTerm = true;
        pathname = 'journey';
      } else if (insurance_apps.submitted.length > 0) {
        resumeFlagTerm = true;
        application = insurance_apps.submitted[0];
        pathname = 'journey';
      } else {
        // intro
        pathname = 'intro';
      }

      if (application) {
        let data = {
          application: application,
          required_fields: required_fields
        }
        window.sessionStorage.setItem('cameFromHome', true);
        window.sessionStorage.setItem('homeApplication', JSON.stringify(data));
        pathname = 'journey';
        this.setState({
          termApplication: application
        })
      }
    } else {
      pathname = 'intro';
    }

    let fullPath = '/group-insurance/term/' + pathname;

    this.setState({
      redirectTermPath: fullPath
    })

    return resumeFlagTerm;

  }

  handleClick = (product_key) => {

    this.sendEvents('next', product_key)
    var BHARTIAXA_PRODUCTS = ['PERSONAL_ACCIDENT', 'HOSPICASH', 'SMART_WALLET', 'HEALTH', 'DENGUE', 'CORONA'];

    var lead_id = '';
    var path = '';
    var fullPath = '';
    if (BHARTIAXA_PRODUCTS.indexOf(product_key) !== -1) {
      if (this.state.BHARTIAXA_APPS && this.state.BHARTIAXA_APPS[product_key] &&
        this.state.BHARTIAXA_APPS[product_key].length > 0) {
        let data = this.state.BHARTIAXA_APPS[product_key][0];
        lead_id = data.lead_id;

        path = getBhartiaxaStatusToState(data);
        if (data.status === 'complete') {
          lead_id = '';
        }

      } else {
        path = 'plan';
      }

      fullPath = insuranceStateMapper[product_key] + '/' + path;
    } else if (product_key === 'LIFEINSURANCE') {
      fullPath = 'lifeinsurance/landing';
    } else if (product_key === 'HEALTH_INSURANCE') {
      fullPath = 'health/landing';
    }    
    else if (product_key === 'HOME_INSURANCE') {
      fullPath = 'home_insurance/general/plan';
    } else {

      // this.navigate(this.state.redirectTermPath);
      this.navigate('/group-insurance/term/intro');
      return;
    }


    window.sessionStorage.setItem('group_insurance_lead_id_selected', lead_id || '');
    this.navigate('group-insurance/' + fullPath);
  }

  renderPorducts(props, index) {
    return (
      <div key={index} onClick={() => this.handleClick(props.key)} style={{
        display: 'flex', alignItems: 'center', borderBottomWidth: '1px',
        borderBottomColor: '#EFEDF2', borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '', paddingTop: '15px',
        paddingBottom: '15px', justifyContent: 'space-between', cursor: 'pointer'
      }}>
        <div style={{ display: 'flex' }}>
          <img src={props.icon} alt="" style={{ marginRight: '15px' }} />
          <div>
            <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px', fontWeight: 500 }}>{props.title}
              {props.key === 'CORONA' && !props.resume_flag &&
                <span style={{
                  padding: '3px 7px',
                  borderRadius: 10, fontSize: 10, background: getConfig().primary, margin: '0 0 0 10px', color: 'white'
                }}>New</span>}
            </div>
            <div style={{ color: '#7e7e7e', fontSize: '13px' }}>{props.subtitle}</div>
          </div>
        </div>
        {props.resume_flag &&
          <div style={{
            background: '#ff6868', color: '#fff', fontSize: 8, letterSpacing: 0.1,
            textTransform: 'uppercase', padding: '2px 5px', borderRadius: 3
          }}>RESUME</div>
        }
      </div>
    )
  }

  sendEvents(user_action, insurance_type) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance',
        "insurance_type": insurance_type ? insurance_type : ''
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {


    return (
      <Container
        events={this.sendEvents('just_set_events')}
        noFooter={true}
        showLoader={this.state.show_loader}
        title="Insurance">
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '16px', lineHeight: '24px', color: '#160d2e', margin: 0, fontWeight: '500' }}>Insurance is a priority, <br></br> not an option.</h1>
            <img src={this.state.insurance} alt="" />
          </div>
          <div style={{
            marginTop: '10px', fontSize: '14px', lineHeight: '24px', color: '#4a4a4a',
            display: 'flex'
          }}>
            <img style={{ margin: '0px 5px 0 0' }} src={this.state.instant_icon} alt="" />
            Instant policy issuance
            </div>
          <div style={{ marginTop: '20px', color: '#4a4a4a', fontSize: '10px', lineHeight: '24px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '2px' }}>Claim assistance | No medical | Zero paperwork</div>
          <div className='products' style={{ marginTop: '50px' }}>
            <h1 style={{ fontWeight: '700', color: '#160d2e', fontSize: '20px' }}>Get started</h1>
            <div>

              {this.state.insuranceProducts.map(this.renderPorducts)}

            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Landing;