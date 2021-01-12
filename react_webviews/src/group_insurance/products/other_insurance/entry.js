import React, { Component } from 'react';
import Container from  '../../common/Container';
import qs from 'qs';

import { getConfig } from '../../../utils/functions';
import { capitalizeFirstLetter } from '../../../utils/validators'
import { nativeCallback } from '../../../utils/native_callback'
import Api from '../../../utils/api'
import toast from '../../../common/ui/Toast'

import { getBhartiaxaStatusToState, insuranceStateMapper } from '../../constants'
import { setTermInsData } from '../../common/commonFunction'


class LifeInsuranceEntry extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      type: getConfig().productName,
      insuranceProducts: [],
      params: qs.parse(props.history.location.search.slice(1)),
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

    let insuranceProducts = [{
        key: 'SMART_WALLET',
        title: 'Wallet Insurance',
        subtitle: 'Secure digital wallets against frauds',
        icon: 'ic_wallet',
      }, 
      
      {
        key: 'PERSONAL_ACCIDENT',
        title: 'Personal Accident Insurance',
        subtitle: 'Starts from ₹200/year',
        icon: 'ic_personal_accident',
      },

      {
        key: 'HOME_INSURANCE',
        title: 'Home insurance',
        subtitle: 'Secure your home and interiors',
        icon: 'home_insurance_icon',
        disabled: false
      },
    ];

    let { params } = this.props.location || {};
    let openModuleData = params ? params.openModuleData : {}

    this.setState({
      openModuleData: openModuleData || {},
      insuranceProducts: insuranceProducts,
    })
  }


  async componentDidMount() {

    this.setState({
      show_loader: true
    })

    try {
      const res = await Api.get('/api/ins_service/api/insurance/application/summary')

      if (!this.state.openModuleData.sub_module) {
        this.setState({
          show_loader: false
        })
      }

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
          'PERSONAL_ACCIDENT': BHARTIAXA['PERSONAL_ACCIDENT'],
          'SMART_WALLET': BHARTIAXA['SMART_WALLET']
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
          BHARTIAXA_APPS: BHARTIAXA_APPS,
          insuranceProducts: insuranceProducts,
          resumeFlagAll: resumeFlagAll
        })

        if (this.state.openModuleData.sub_module) {
          let navigateMapper = {
            personal_accident: 'PERSONAL_ACCIDENT',
            smart_wallet: 'SMART_WALLET',
            term_insurance: 'TERM_INSURANCE'
          };
        
          let pathname = navigateMapper[this.state.openModuleData.sub_module] ||
           this.state.openModuleData.sub_module;
          var product_key_info = {}
          product_key_info.title = pathname === 'PERSONAL_ACCIDENT' ? 'Personal Accident Insurance' :  pathname === 'SMART_WALLET' ? 'Wallet Insurance' : 'Term Insurance'
          this.handleClick(pathname , product_key_info);
        }

      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message
          || 'Something went wrong');
      }

      this.setState({
        show_loader: false
      })

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
        fromHome: false
      }
    });
  }

  handleClick = (product_key , product_key_info) => {
    this.sendEvents('next', product_key_info ? product_key_info.title : '')

    var BHARTIAXA_PRODUCTS = ['PERSONAL_ACCIDENT', 'SMART_WALLET', 'HEALTH'];

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
    }
      else if (product_key === 'HOME_INSURANCE') {
      fullPath = 'home_insurance/general/plan';
      this.navigate('/group-insurance/' + fullPath);
    } else {
      // this.navigate(this.state.redirectTermPath);
      this.navigate('/group-insurance/term/intro');
      return;
    }
    window.sessionStorage.setItem('group_insurance_lead_id_selected', lead_id || '');
    this.navigate('/group-insurance/' + fullPath);
  }

  renderPorducts(props, index) {

    if(!props.disabled) {
      return (
        <div className='insurance_plans' key={index} onClick={() => this.handleClick(props.key, props)}
              style={{ width : '100%'}}
             >   
          <div className='insurance_plans_types' style={{ width : '100%'}}>
                  <img src={require(`assets/${this.state.type}/${props.icon}.svg`)} alt='' className="insurance_plans_logos" style={{marginTop : 'auto' , marginBottom : 'auto'}} />
            <div  style={{  borderBottomWidth: '1px',  width : '100%',
                          borderBottomColor: '#EFEDF2', borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '', paddingTop: '22px' ,   paddingBottom: '22px'}}    >
              <div className='insurance_plans_logos_text'
              >{props.title} {' '}
               {props.resume_flag && <span style={{background: '#ff6868', letterSpacing: 0.1, fontSize : '8px', lineHeight : '10.06px', position : 'relative', top:'-3px',
                 borderRadius: 7 , padding: '2px 4px', marginTop : '-30px' , color : 'white', fontWeight : '700' , width :'40px' , left:'6px', height:'14px', 
             }}>Resume</span>}

              </div>
              <div className='insurance_plans_logos_subtext'>{props.subtitle}</div>
            </div>
          </div>
        </div>
      )
    }
    return null;
  }

  sendEvents(user_action, insurance_type) {


    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'other insurance',
      }
    };

    if(insurance_type){
      eventObj.properties['insurance_type'] = capitalizeFirstLetter(insurance_type.toLowerCase())
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
        title="Other Insurance"
        styleHeader={{marginLeft: '10px'}}> 
        <div className="group-health-insurance-entry">
          <div className='products'>
            <div className='health_insurance'>Insurance plans for specific needs</div>
            <div>
              {this.state.insuranceProducts.map(this.renderPorducts)}
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default LifeInsuranceEntry;
