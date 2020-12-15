import React, { Component } from 'react';
import Container from '../common/Container';
import qs from 'qs';
import { insuranceStateMapper } from '../constants';

import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { getBhartiaxaStatusToState } from '../constants';
import { nativeCallback } from 'utils/native_callback';
import '../common/Style.scss'

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

    let insuranceProducts = [
      {
        key: 'LIFE_INSURANCE',
        title: 'Life Insurance',
        subtitle: 'Starts from ₹7,700/year',
        icon: 'life_insurance'
      },
      {
        key: 'HEALTH_INSURANCE',
        title: 'Health Insurance',
        subtitle: 'Starts from ₹4,000/year',
        icon: 'ic_health'
      },
      {
        key: 'CORONA',
        title: 'Coronavirus Insurance',
        subtitle: 'Starts from ₹750/year',
        icon: 'ic_coronavirus_insurance'
      },
      {
        key: 'PERSONAL_ACCIDENT',
        title: 'Personal Accident Insurance',
        subtitle: 'Starts from ₹200/year',
        icon: 'ic_personal_accident'
      },
      {
        key: 'HOSPICASH',
        title: 'Hospital Daily Cash',
        subtitle: 'Starts from ₹750/year',
        icon: 'ic_hospicash'
      },
      {
        key: 'DENGUE',
        title: 'Dengue insurance',
        subtitle: 'Starts from ₹50/year',
        icon: 'dengue_icon'
      },
      {
        key: 'SMART_WALLET',
        title: 'Smart Wallet(fraud protection)',
        subtitle: 'Starts from ₹250/year',
        icon: 'ic_wallet'
      },
      {
        key: 'HOME_INSURANCE',
        title: 'Home insurance',
        subtitle: 'Secure your home and interiors',
        icon: 'home_insurance_icon'
      },
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

  policymove = ()=> {
    this.sendEvents('next', "")
    this.navigate('/group-insurance/group-insurance/add-policy');
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
    } else if (product_key === 'LIFE_INSURANCE') {
        fullPath = 'life-insurance/entry';
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
          <img src={ require(`assets/${props.icon}_${this.state.type}.svg`)  } alt="" style={{ marginRight: '20px' }} />
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
        {/* <div className='health_insurance' style={{fontWeight: '700', color: '#160d2e', fontSize:'20px'}}>Insurance</div> */}
           <div  style={{ marginTop: '40px' }}>
           <div onClick={this.policymove}>
           <img style={{ margin: '-15px 5px 15px 0', minWidth: '100%' }} src={ require(`../../assets/${this.state.type}/icn_crousal_card_1.svg`)} alt="" />
           </div>
            <h1 style={{ fontWeight: '700', color: '#160d2e', fontSize: '20px' }}>What are you looking for ?</h1>
            <div>
              {this.state.insuranceProducts.map(this.renderPorducts)}
            </div>
        </div>
      </Container>
    );
  }
}

export default Landing;