import React, { Component } from 'react';
import Container from '../../common/Container';
import qs from 'qs';
import { insuranceStateMapper, getBhartiaxaStatusToState } from '../../constants';
import { capitalizeFirstLetter } from '../../../utils/validators'
import MenuListDropDown from '../../../common/ui/MenuListDropDown'

import health_suraksha_fisdom from 'assets/health_suraksha_fisdom.svg';
import health_suraksha_myway from 'assets/health_suraksha_myway.svg';

import super_topup_fisdom from 'assets/super_topup_fisdom.svg';
import super_topup_myway from 'assets/super_topup_myway.svg';

import ic_hospicash_fisdom from '../../../assets/ic_hospicash_fisdom.svg'
import ic_hospicash_finity from '../../../assets/ic_hospicash_myway.svg'

import icn_diseases_insurance_fisdom from '../../../assets/fisdom/icn_diseases_insurance.svg'
import icn_diseases_insurance_finity from '../../../assets/finity/icn_diseases_insurance.svg'

import icn_dengue_fisdom from '../../../assets/icn_dengue_fisdom.svg'
import icn_dengue_finity from '../../../assets/icn_dengue_finity.svg'

import icn_critical_illness_fisdom from '../../../assets/icn_critical_illness_fisdom.svg'
import icn_critical_illness_finity from '../../../assets/icn_critical_illness_finity.svg'

import hdfc_logo from '../../../../src/assets/ic_hdfc_logo.svg';
import religare_logo from '../../../../src/assets/ic_care.svg';
import star_logo from '../../../../src/assets/ic_star_health.svg';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

import back_nav_bar_icon from '../../../assets/back_nav_bar_icon.png'
import back_nav_bar_icon_up from '../../../assets/back_nav_bar_icon_up.png'


import Api from '../../../utils/api'
import { setTermInsData } from '../../common/commonFunction'

class HealthInsuranceLanding extends Component {

  constructor(props) {
    super(props);
    this.state = {
      skelton: true,
      type: getConfig().productName,
      insuranceProducts: [],
      params: qs.parse(props.history.location.search.slice(1)),
      Comprehensive : false,
      DiseasesSpecificPlan : false,
      lastClickedItem:"",
      title:"Health insurance"
    }

    this.setTermInsData = setTermInsData.bind(this);
  }


  componentWillMount() {

    window.sessionStorage.setItem('group_insurance_payment_started', '');
    window.sessionStorage.setItem('group_insurance_payment_urlsafe', '');
    window.sessionStorage.setItem('group_insurance_plan_final_data', '');
    window.sessionStorage.setItem('group_insurance_payment_url', '');

    nativeCallback({ action: 'take_control_reset' });

    let health_suraksha_icon = this.state.type !== 'fisdom' ? health_suraksha_myway : health_suraksha_fisdom;
    let super_topup_icon = this.state.type !== 'fisdom' ? super_topup_myway : super_topup_fisdom;
    let ic_hospicash = this.state.type !== 'fisdom' ? ic_hospicash_finity : ic_hospicash_fisdom;
    let icn_diseases = this.state.type !== 'fisdom' ? icn_diseases_insurance_finity : icn_diseases_insurance_fisdom

    let icn_dengue = this.state.type !== 'fisdom' ? icn_dengue_finity : icn_dengue_fisdom;
    let icn_critical_illness = this.state.type !== 'fisdom' ? icn_critical_illness_finity : icn_critical_illness_fisdom;

    let insuranceProducts = [
      {
        key: 'HealthInsuranceEntry',
        title: 'Comprehensive',
        subtitle: 'Complete healthcare in one policy',
        icon: health_suraksha_icon,
        dropdown : back_nav_bar_icon,
        uparrow : back_nav_bar_icon_up,
        component: [{
          key: 'GMC',
          title: 'Care Health',
          subtitle: 'fisdom HealthProtect',
          Product_name: 'care_plus',
          icon: religare_logo,
          tag: 'Recommended'
        },
        {
          key: 'HDFCERGO',
          title: 'HDFC ERGO',
          subtitle: 'my: health Suraksha',
          Product_name: 'Health_Suraksha',
          icon: hdfc_logo
        },
        {
          key: 'RELIGARE',
          title: 'Care Health',
          subtitle: 'Care',
          Product_name: 'Care',
          icon: religare_logo
        },
        {
          key: 'STAR',
          title: 'Star',
          subtitle: 'Family health optima',
          Product_name: 'Star',
          icon: star_logo
        }],
        type: 'drop-down',
        formate: 'object'
      },
      {
        key: 'DISEASE_SPECIFIC_PLANS',
        title: 'Disease specific plans',
        subtitle: 'Tailor-made plans for specific needs',
        icon: icn_diseases,
        dropdown : back_nav_bar_icon,
        uparrow : back_nav_bar_icon_up,
        component: [
          {
            key: 'CRITICAL_HEALTH_INSURANCE',
            title: 'Critical illness insurance',
            subtitle: 'Cover against life threatening diseases',
            icon: icn_critical_illness,
            Product_name: 'Critical illness'
          },
          {
            key: 'DENGUE',
            title: 'Dengue insurance',
            subtitle: 'Starts from ₹50/year',
            icon: icn_dengue,
            Product_name: 'dengue insurance',
            resume_flag: this.state.resumeFlagAll ? this.state.resumeFlagAll['DENGUE'] : false,
          },
        ],
        type: 'drop-down',
        formate: 'object'
      },
      {
        key: 'HEALTH_SUPER_TOPUP',
        title: 'Super Top Up',
        subtitle: 'Boost your existing health insurance',
        icon: super_topup_icon
      },
      {
        key: 'HOSPICASH',
        title: 'Hospital Daily Cash',
        subtitle: 'Get guaranteed cash on hospitalisation',
        icon: ic_hospicash
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

    // if(openModuleData && openModuleData.sub_module) {
    //   let pathname = openModuleData.sub_module;
    //   if(pathname !== 'HEALTH_SURAKSHA'){
    //     this.handleClick(pathname);
    //   }
    // } else {
    //   this.setState({
    //     skelton: false
    //   })
    // }


    this.setState({
      openModuleData: openModuleData || {},
      insuranceProducts: insuranceProducts
    })
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

  setErrorData = (type) => {

    this.setState({
      showError: false
    });
    if (type) {
      let mapper = {
        'onload': {
          handleClick1: this.onload,
          button_text1: 'Retry',
          title1: ''
        },
        submit: {
          handleClick1: this.handleClickEntry,
          button_text1: "Retry",
          handleClick2: () => {
            this.setState({
              showError: false,
            });
          },
          button_text2: "Dismiss",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }

  }

  handleClickEntry = async (data) => {
  let specificPlans = [ 'CRITICAL_HEALTH_INSURANCE' , 'DENGUE' , 'CORONA'  ]
   if(specificPlans.includes(data.key))  {
     this.handleClick(data)
     return;
   }
    if (data) {
      this.setState({
        lastClickedItem: data
      })
    }
    else {
      data = this.state.lastClickedItem
    }
    this.setState({
      title: ''
    })
    this.setErrorData("submit");
    this.setState({
      skelton: true
    });
    let error = "";
    let errorType = "";
    try {
      const res = await Api.get(`/api/ins_service/api/insurance/health/journey/started?product_name=${data.Product_name}`);

      let resultData = res.pfwresponse
      if (res.pfwresponse.status_code === 200) {
        data.insurance_type = 'Comprehensive health insurance'
        this.sendEvents('next', data.insurance_type, data.Product_name);
        let fullPath = data.key + '/landing';
        this.navigate('/group-insurance/group-health/' + fullPath);
      } else {
        error = resultData.error || resultData.message || true;
      }
    } catch (err) {
      console.log(err)
      this.setState({
        skelton: false,
      });
      error = true;
      errorType = "crash";
    }

    if (error) {
      this.setState({
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType
        },
        showError: "page",
      });
    }

  }


  onload = async () => {
    this.setErrorData('onload');


    this.setState({ skelton: true });

    let error = '';
    let errorType = '';
    try {
      const res = await Api.get('/api/ins_service/api/insurance/application/summary')

      if (res.pfwresponse.status_code === 200) {
        var resultData = res.pfwresponse.result.response;
        let term_insurance = resultData.term_insurance;
        let group_insurance = resultData.group_insurance;
        let BHARTIAXA = group_insurance && group_insurance.insurance_apps ? group_insurance.insurance_apps.BHARTIAXA : {};
        let resumeFlagTerm = this.setTermInsData(term_insurance, BHARTIAXA);


        let resumeFlagAll = {
          'TERM_INSURANCE': resumeFlagTerm
        }

        if (!BHARTIAXA) {
          BHARTIAXA = {};
        }
        let BHARTIAXA_APPS = {
          'HOSPICASH': BHARTIAXA['HOSPICASH'],
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

        for (const ele of insuranceProducts) {
          ele.resume_flag = resumeFlagAll[ele.key];
          if (ele.component) {
            for (const item of ele.component) {
              item.resume_flag = resumeFlagAll[item.key];
            }
          };
        }

        this.setState({
          group_insurance: group_insurance,
          BHARTIAXA_APPS: BHARTIAXA_APPS,
          insuranceProducts: insuranceProducts,
          resumeFlagAll: resumeFlagAll
        })

        if (this.state.openModuleData.sub_module) {
          let navigateMapper = {
            hospicash: 'HOSPICASH',
            dengue: 'DENGUE',
            corona: 'CORONA',
            term_insurance: 'TERM_INSURANCE',
          };

          let pathname = navigateMapper[this.state.openModuleData.sub_module] ||
            this.state.openModuleData.sub_module;
          this.handleClick(pathname);
        }
        this.setState({
          skelton: false
        });

      } else {
        error = res.pfwresponse.result.error || res.pfwresponse.result.message
          || true;
      }



    } catch (err) {
      console.log(err)
      this.setState({
        skelton: false,
      });
      error = true;
      errorType = "crash";
    }

    // set error data
    if (error) {
      this.setState({
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType
        },
        showError: 'page'
      })
    }
  }


  async componentDidMount() {
    this.onload();
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

  handleClick = (data, index) => {

    let stateMapper = {
      'HEALTH_SUPER_TOPUP': 'super_topup',
      'HOSPICASH': 'hospicash',
      'HEALTH_SURAKSHA': 'health_suraksha',
      'CRITICAL_HEALTH_INSURANCE': 'critical_illness',
    };

    var BHARTIAXA_PRODUCTS = ['HOSPICASH', 'HEALTH', 'DENGUE', 'CORONA'];
    var lead_id = '';
    var path = '';
    var fullPath = '';
    let type = data.type
    let product_key = data.key ? data.key : data;

    fullPath = 'health/' + stateMapper[product_key] + '/plan';

    if (type === 'drop-down') {
      this.setState({ value: this.state.value === index ? null : index }) 
      return
    }

    if ( (product_key === 'HealthInsuranceEntry' || product_key === 'HEALTH_SURAKSHA')) {
      this.setState({ value: 0 })
      return;
    }

    if (product_key === 'DISEASE_SPECIFIC_PLANS' || product_key === 'disease-Specific-plan') {
      this.setState({ value: 1 })
      return;
    }

  this.setState({
    show_loader : true
  })

  this.sendEvents('next', data ? data.title : '')


  if (product_key === 'CRITICAL_HEALTH_INSURANCE') {
    fullPath = 'health/critical_illness/plan';
  }

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
  }

  window.sessionStorage.setItem('group_insurance_lead_id_selected', lead_id || '');
  this.navigate('/group-insurance/' + fullPath);
}

  handleEvent = (val) => {
    val.subtitle = val.insurance_type === 'Comprehensive health insurance' ? val.subtitle : val.Product_name
    this.sendEvents('next', val.insurance_type, val.subtitle)
  }

  sendEvents(user_action, insurance_type, product_selected) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'health insurance',
        'insurance_type': insurance_type,
        'product_selected': product_selected
      }
    };

    if (insurance_type) {
      eventObj.properties['insurance_type'] = capitalizeFirstLetter(insurance_type.toLowerCase())
    }

    if (product_selected) {
      eventObj.properties['product_selected'] = product_selected.toLowerCase();
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
        events={this.sendEvents('just_set_events')}
        noFooter={true}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
        title={this.state.title}
        force_hide_inpage_title={true}
      >
        <div>
          <div>
            <p style={{ fontSize: '20px', marginBottom: '24px', fontWeight: '700' }}>Health Insurance</p>
          </div>
          <MenuListDropDown menulistProducts={this.state.insuranceProducts} value={this.state.value} handleClick={this.handleClick}
            handleClickEntry={this.handleClickEntry} parent={this} />
        </div>
      </Container>
    );
  }
}

export default HealthInsuranceLanding;