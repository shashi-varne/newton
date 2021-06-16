import React, { Component } from 'react';
import Container from '../../common/Container';
import qs from 'qs';
import { insuranceStateMapper, getBhartiaxaStatusToState } from '../../constants';
import { capitalizeFirstLetter } from '../../../utils/validators'

import health_suraksha_fisdom from 'assets/health_suraksha_fisdom.svg';
import health_suraksha_myway from 'assets/health_suraksha_myway.svg';

import super_topup_fisdom from 'assets/super_topup_fisdom.svg';
import super_topup_myway from 'assets/super_topup_myway.svg';

import ic_hospicash_fisdom from '../../../assets/ic_hospicash_fisdom.svg'
import ic_hospicash_finity from '../../../assets/ic_hospicash_myway.svg'

import icn_diseases_insurance_fisdom from '../../../assets/fisdom/icn_diseases_insurance.svg'
import icn_diseases_insurance_finity from '../../../assets/finity/icn_diseases_insurance.svg'

import HealthInsuranceEntry from '../group_health/plans/entry'
import DiseasesSpecificPlan from '../health_insurance/diseases_specific_plan'

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

    this.renderPorducts = this.renderPorducts.bind(this);
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


    let insuranceProducts = [
      {
        key: 'HealthInsuranceEntry',
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
        icon: icn_diseases,
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
    if(type) {
      let mapper = {
        'onload':  {
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
    if (data) {
      this.setState({
        lastClickedItem: data
      })
    }
    else {
      data = this.state.lastClickedItem
    }
      this.setState({
        title:''
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
      if(res.pfwresponse.status_code === 200){
        data.insurance_type = 'Comprehensive health insurance'
        this.sendEvents('next', data.insurance_type, data.Product_name);
        let fullPath = data.key + '/landing';
        this.navigate('/group-insurance/group-health/' + fullPath);  
      }else {
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
    
    if(error)
    {
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
      error= true;
      errorType= "crash";
    }

    // set error data
    if(error) {
      this.setState({
        errorData: {
          ...this.state.errorData,
          title2: error,
          type:errorType
        },
        showError:'page'
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

  handleClick2 = () => {
    this.setState({
      skelton:true
    })
  }

  handleClick = (product_key, title) => {

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

    fullPath = 'health/' + stateMapper[product_key] + '/plan';

    if ( (product_key === 'HealthInsuranceEntry' || product_key === 'HEALTH_SURAKSHA')) {
      this.HealthInsuranceEntry();
      return;
    }

    if (product_key === 'DISEASE_SPECIFIC_PLANS' || product_key === 'disease-Specific-plan' ) {
      this.DISEASE_SPECIFIC_PLANS();
      return;
    }
    this.sendEvents('next', title ? title : '')

    if (product_key === 'HEALTH_SUPER_TOPUP') {
      this.navigate('/group-insurance/' + fullPath);
      return
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
    } else {
      // this.navigate(this.state.redirectTermPath);
      this.navigate('/group-insurance/term/intro');
      return;
    }

    window.sessionStorage.setItem('group_insurance_lead_id_selected', lead_id || '');
    this.navigate('/group-insurance/' + fullPath);
  }

  HealthInsuranceEntry = () => {
    this.setState({
      Comprehensive : !this.state.Comprehensive,
      DiseasesSpecificPlan : false
    })
  }

  DISEASE_SPECIFIC_PLANS = () => {
    this.setState({
      DiseasesSpecificPlan : !this.state.DiseasesSpecificPlan,
      Comprehensive : false
    })
  }

  renderPorducts(props, index) {
    return (
      <div key={index}>    
      <div onClick={() => this.handleClick(props.key, props.title)} style={{
        display: 'flex', alignItems: 'center'}}>
        <div style={{ display: 'flex' , width : '100%'}}>
          <img src={props.icon} alt="" style={{ marginRight: '15px' ,paddingTop: '20px', paddingBottom: '22px' }} />
          <div style={ (props.key === 'HealthInsuranceEntry') ? {width : '100%' ,borderBottomWidth: '1px', borderBottomColor: '#EFEDF2', borderBottomStyle: this.state.insuranceProducts.length - 1 !== index  && !this.state.Comprehensive ? 'solid' : '',   
                paddingTop: '20px', paddingBottom: '22px', justifyContent: 'space-between', cursor: 'pointer'} : (props.key === 'DISEASE_SPECIFIC_PLANS') ? {width : '100%' ,borderBottomWidth: '1px', 
                borderBottomColor: '#EFEDF2', borderBottomStyle: this.state.insuranceProducts.length - 1 !== index  && !this.state.DiseasesSpecificPlan ? 'solid' : '', paddingTop: '20px', paddingBottom: '22px', 
                justifyContent: 'space-between', cursor: 'pointer'}  : {width : '100%' ,borderBottomWidth: '1px', borderBottomColor: '#EFEDF2', borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '',   
                paddingTop: '20px', paddingBottom: '22px', justifyContent: 'space-between', cursor: 'pointer'} }>
            <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px',fontWeight:500 , flexGrow : 1}}>{props.title} {' '}
               {props.resume_flag && <span style={{background: '#ff6868', letterSpacing: 0.1, fontSize : '8px', lineHeight : '10.06px', position : 'relative', top:'-3px',
                 borderRadius: 7 , padding: '2px 4px', marginTop : '-30px' , color : 'white', fontWeight : '700' , width :'40px' , left:'6px', height:'14px', 
             }}>Resume</span>}
                 {props.key === 'HealthInsuranceEntry'  && !this.state.Comprehensive && <span style={{ "float" : "right" , color : 'blue'}}>                  
                  <img src={props.dropdown} alt="" style={{ marginLeft: '15px' }} />
                  </span>}

                  {props.key === 'HealthInsuranceEntry'  &&  this.state.Comprehensive &&<span style={{ "float" : "right" , color : 'blue'}}>                  
                  <img src={props.uparrow} alt="" style={{ marginLeft : '15px' }} />  
                  </span>}

                   { props.key === 'DISEASE_SPECIFIC_PLANS' && !this.state.DiseasesSpecificPlan && <span style={{ "float" : "right" , color : 'blue'}}>                  
                  <img src={props.dropdown} alt="" style={{ marginLeft: '15px' }} />
                  </span>}

                  {props.key === 'DISEASE_SPECIFIC_PLANS' && this.state.DiseasesSpecificPlan &&<span style={{ "float" : "right" , color : 'blue'}}>                  
                  <img src={props.uparrow} alt="" style={{ marginLeft: '15px' }} />
                  </span>}

            </div>
            <div style={{ color: '#7e7e7e', fontSize: '13px', fontWeight: '400', lineHeight: '15.41px' }}>{props.subtitle}</div>
          </div>
        </div>
      </div>

     <div style={{display : 'flex' , width : '100%'}}>  
    {props.key === 'HealthInsuranceEntry' && this.state.Comprehensive && 
       <div onClick={() => this.handleClick(props.key, props.title)} style={{  width : '100%'
      }}>
     <div onClick={() => this.handleClick2()} style={{ display: 'flex' , width : '100%' }}>{props.key === 'HealthInsuranceEntry' && <HealthInsuranceEntry onSelectEvent={this.handleEvent} parent={this}/> } </div>

      </div>}
      { props.key === 'DISEASE_SPECIFIC_PLANS' &&  this.state.DiseasesSpecificPlan && 
       <div onClick={() => this.handleClick(props.key, props.title)} style={{  width : '100%'
      }}>
     <div onClick={() => this.handleClick2()} style={{ display: 'flex' , width : '100%' }}>{props.key === 'DISEASE_SPECIFIC_PLANS' && <DiseasesSpecificPlan  onSelectEvent={this.handleEvent} parent={this}/> } </div>
      </div>}
      </div>
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
        'insurance_type': insurance_type,
        'product_selected': product_selected
      }
    };

    if(insurance_type){
      eventObj.properties['insurance_type'] =  capitalizeFirstLetter(insurance_type.toLowerCase())
    }

    if(product_selected){
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
          <p style={{fontSize: '20px', marginBottom: '24px', fontWeight: '700'}}>Health Insurance</p>
        </div>
          <div className='products' style={{marginTop : '10px'}}>
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