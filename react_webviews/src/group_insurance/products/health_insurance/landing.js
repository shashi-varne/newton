import React, { Component } from 'react';
import Container from '../../common/Container';
import qs from 'qs';
import { insuranceStateMapper, getBhartiaxaStatusToState } from '../../constants';
import critical_illness_fisdom from 'assets/critical_illness_fisdom.svg';
import critical_illness_myway from 'assets/critical_illness_myway.svg';

import health_suraksha_fisdom from 'assets/health_suraksha_fisdom.svg';
import health_suraksha_myway from 'assets/health_suraksha_myway.svg';

import super_topup_fisdom from 'assets/super_topup_fisdom.svg';
import super_topup_myway from 'assets/super_topup_myway.svg';

import ic_hospicash_fisdom from '../../../assets/ic_hospicash_fisdom.svg'

import icn_diseases_insurance from '../../../assets/fisdom/icn_diseases_insurance.svg'

import HealthInsuranceEntry from '../group_health/plans/entry'
import DiseasesSpecificPlan from '../health_insurance/diseases_specific_plan'

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

import back_nav_bar_icon from '../../../assets/back_nav_bar_icon.png'
import back_nav_bar_icon_up from '../../../assets/back_nav_bar_icon_up.png'


import Api from '../../../utils/api'
import toast from '../../../common/ui/Toast'

class HealthInsuranceLanding extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      type: getConfig().productName,
      insuranceProducts: [],
      params: qs.parse(props.history.location.search.slice(1)),
      Comprehensive : false,
      DiseasesSpecificPlan : false
    }

    this.renderPorducts = this.renderPorducts.bind(this);
  }

  componentWillMount() {

    window.sessionStorage.setItem('group_insurance_payment_started', '');
    window.sessionStorage.setItem('group_insurance_payment_urlsafe', '');
    window.sessionStorage.setItem('group_insurance_plan_final_data', '');
    window.sessionStorage.setItem('group_insurance_payment_url', '');

    nativeCallback({ action: 'take_control_reset' });
    let critical_illness_icon = this.state.type !== 'fisdom' ? critical_illness_myway : critical_illness_fisdom;
    let health_suraksha_icon = this.state.type !== 'fisdom' ? health_suraksha_myway : health_suraksha_fisdom;
    let super_topup_icon = this.state.type !== 'fisdom' ? super_topup_myway : super_topup_fisdom;
    let ic_hospicash = this.state.type !== 'fisdom' ? ic_hospicash_fisdom : ic_hospicash_fisdom

    let insuranceProducts = [
      {
        key: 'HEALTH_SURAKSHA',
        title: 'Comprehensive',
        subtitle: 'Complete healthcare in one policy',
        icon: health_suraksha_icon,
        dropdown : back_nav_bar_icon,
        uparrow : back_nav_bar_icon_up
      },
      {
        key: 'DISEASE_SPECIFIC_PLANS',
        title: 'Disease specific plans',
        subtitle: 'Tailor-made plans for specific needs',
        icon: icn_diseases_insurance,
        dropdown : back_nav_bar_icon,
        uparrow : back_nav_bar_icon_up
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


    let { params } = this.props.location || {};
    let openModuleData =  params ? params.openModuleData : {}

    // let redirect_url =  decodeURIComponent(getConfig().redirect_url);
    // if(!openModuleData.sub_module && redirect_url && redirect_url.includes("exit_web")) {
    //   window.location.href = redirect_url;
    // }

    if(openModuleData && openModuleData.sub_module) {
      let pathname = openModuleData.sub_module;
      this.handleClick(pathname);
    } else {
      this.setState({
        show_loader: false
      })
    }

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


  async componentDidMount() {

    this.setState({ show_loader: true });
    
    try {
      const res = await Api.get('/api/ins_service/api/insurance/application/summary')

      if (!this.state.openModuleData.sub_module) {
        this.setState({
          show_loader: false
        })
      }

      if (res.pfwresponse.status_code === 200) {
        var resultData = res.pfwresponse.result.response;
        // var resultData = res.pfwresponse.response;
        let group_insurance = resultData.group_insurance;
        let BHARTIAXA = group_insurance && group_insurance.insurance_apps ? group_insurance.insurance_apps.BHARTIAXA : {};


        let resumeFlagAll = {}

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
        for (var i = 0; i < insuranceProducts.length; i++) {
          let key = insuranceProducts[i].key;
          insuranceProducts[i].resume_flag =   resumeFlagAll[key];
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

      this.setState({
        show_loader: false
      });

    } catch (err) {
      console.log(err)
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  handleClick2 = () => { this.setState({ show_loader : true})}

  handleClick = (product_key, title) => {

    let stateMapper = {
      'HEALTH_SUPER_TOPUP': 'super_topup',
      'HOSPICASH': 'hospicash'
    };

    var BHARTIAXA_PRODUCTS = ['HOSPICASH', 'HEALTH', 'DENGUE', 'CORONA'];
    var lead_id = '';
    var path = '';
    var fullPath = '';

    var fullPath = 'health/' + stateMapper[product_key] + '/plan';
    if (product_key === 'HOSPICASH') {
      fullPath = stateMapper[product_key] + '/plan';
    }
    if (product_key === 'HEALTH_SURAKSHA' && !getConfig().iOS) {
      this.HealthInsuranceEntry();
      return;
    }

    if (product_key === 'DISEASE_SPECIFIC_PLANS' && !getConfig().iOS) {
      this.DISEASE_SPECIFIC_PLANS();
      return;
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
    this.sendEvents('next', title)
    window.sessionStorage.setItem('group_insurance_lead_id_selected', lead_id || '');
    this.navigate('/group-insurance/' + fullPath);
  }

  HealthInsuranceEntry = () => {
    let Comprehensive = !this.state.Comprehensive
    this.setState({
      Comprehensive : Comprehensive,
      DiseasesSpecificPlan : this.state.DiseasesSpecificPlan
    })
  }

  DISEASE_SPECIFIC_PLANS = () => {
    let DiseasesSpecificPlan = !this.state.DiseasesSpecificPlan
    this.setState({
      DiseasesSpecificPlan : DiseasesSpecificPlan
    })
  }

  renderPorducts(props, index) {
    return (
      <div key={index}>     
      <div onClick={() => this.handleClick(props.key, props.title)} style={{
        display: 'flex', alignItems: 'center', borderBottomWidth: '1px',
        borderBottomColor: '#EFEDF2', borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '', paddingTop: '20px',
        paddingBottom: '20px', justifyContent: 'space-between', cursor: 'pointer' ,
      }}>
        <div style={{ display: 'flex' }}>
          <img src={props.icon} alt="" style={{ marginRight: '15px' }} />
          <div style={{width : '240px'}}>
            <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px',fontWeight:500 , flexGrow : 1}}>{props.title} 

                 {props.key === 'HEALTH_SURAKSHA'  && !this.state.Comprehensive && <span style={{ "float" : "right" , color : 'blue'}}>                  
                  <img src={props.dropdown} alt="" style={{ marginLeft: '15px' }} />
                  </span>}

                  {props.key === 'HEALTH_SURAKSHA'  &&  this.state.Comprehensive &&<span style={{ "float" : "right" , color : 'blue'}}>                  
                  <img src={props.uparrow} alt="" style={{ marginLeft : '15px' }} />  
                  </span>}

                   { props.key === 'DISEASE_SPECIFIC_PLANS' && !this.state.DiseasesSpecificPlan && <span style={{ "float" : "right" , color : 'blue'}}>                  
                  <img src={props.dropdown} alt="" style={{ marginLeft: '15px' }} />
                  </span>}

                  {props.key === 'DISEASE_SPECIFIC_PLANS' && this.state.DiseasesSpecificPlan &&<span style={{ "float" : "right" , color : 'blue'}}>                  
                  <img src={props.uparrow} alt="" style={{ marginLeft: '15px' }} />
                  </span>}

            </div>
            <div style={{ color: '#7e7e7e', fontSize: '13px' }}>{props.subtitle}</div>
          </div>
        </div>
        {props.resume_flag && <div style={{background: '#ff6868', color: '#fff', fontSize: 8, letterSpacing: 0.1, textTransform: 'uppercase', padding: '2px 5px', borderRadius: 3
          }}>RESUME</div>}
      </div>

    {props.key === 'HEALTH_SURAKSHA' && this.state.Comprehensive && 
       <div onClick={() => this.handleClick(props.key, props.title)} style={{
        display: 'flex', alignItems: 'center', borderBottomWidth: '1px',
        borderBottomColor: '#EFEDF2', borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '',
        justifyContent: 'space-between', cursor: 'pointer'
      }}>
     <div onClick={() => this.handleClick2()} style={{ display: 'flex'}}>{props.key === 'HEALTH_SURAKSHA' && <HealthInsuranceEntry onSelectEvent={this.handleEvent} parent={this}/> } </div>

      </div>}
      { props.key === 'DISEASE_SPECIFIC_PLANS' &&  this.state.DiseasesSpecificPlan && 
       <div onClick={() => this.handleClick(props.key, props.title)} style={{
        display: 'flex', alignItems: 'center', borderBottomWidth: '1px',
        borderBottomColor: '#EFEDF2', borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '',
        justifyContent: 'space-between', cursor: 'pointer'
      }}>
     <div onClick={() => this.handleClick2()} style={{ display: 'flex' }}>{props.key === 'DISEASE_SPECIFIC_PLANS' && <DiseasesSpecificPlan  onSelectEvent={this.handleEvent} parent={this}/> } </div>
      </div>}
      </div>
    )
  }

  handleEvent = (val) => {
    val.subtitle = val.insurance_type === 'Comprehensive health insurance' ? val.subtitle :  val.Product_name
    this.sendEvents('next',val.insurance_type,val.subtitle)
  }

  sendEvents(user_action, insurance_type, product_selected) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'health insurance',
        "insurance_type": insurance_type ? insurance_type : ''
      }
    };

    if(product_selected){
      eventObj.properties['product_selected'] = product_selected;
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
        showLoader={this.state.show_loader}
        title="Health insurance">
        <div>
          <div className='products'>
            <h1 style={{ fontWeight: '500', color: '#160d2e', fontSize: '17px', lineHeight : '20.15px', marginBottom : '15px'}}>Explore best plans for your health</h1>
            <div  style={{height : '100vh'}}>
              {this.state.insuranceProducts.map(this.renderPorducts)}
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default HealthInsuranceLanding;