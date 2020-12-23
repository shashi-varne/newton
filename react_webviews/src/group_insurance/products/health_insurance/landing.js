import React, { Component } from 'react';
import Container from '../../common/Container';
import qs from 'qs';
// import { insuranceStateMapper, getBhartiaxaStatusToState } from '../../constants';
import critical_illness_fisdom from 'assets/critical_illness_fisdom.svg';
import critical_illness_myway from 'assets/critical_illness_myway.svg';

import health_suraksha_fisdom from 'assets/health_suraksha_fisdom.svg';
import health_suraksha_myway from 'assets/health_suraksha_myway.svg';

import super_topup_fisdom from 'assets/super_topup_fisdom.svg';
import super_topup_myway from 'assets/super_topup_myway.svg';

import ic_hospicash_fisdom from '../../../assets/ic_hospicash_fisdom.svg'

import HealthInsuranceEntry from '../group_health/plans/entry'

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

import back_nav_bar_icon from '../../../assets/back_nav_bar_icon.png'
import back_nav_bar_icon_up from '../../../assets/back_nav_bar_icon_up.png'

class HealthInsuranceLanding extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      type: getConfig().productName,
      insuranceProducts: [],
      params: qs.parse(props.history.location.search.slice(1)),
      Comprehensive : false,
    }

    this.renderPorducts = this.renderPorducts.bind(this);
  }

  componentWillMount() {

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
        icon: health_suraksha_icon,
      },
      {
        key: 'CRITICAL_HEALTH_INSURANCE',
        title: 'Critical illness insurance',
        subtitle: 'Cover against life threatening diseases',
        icon: critical_illness_icon
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

    if(openModuleData && openModuleData.sub_module) {
      let pathname = openModuleData.sub_module;
      this.handleClick(pathname);
    } else {
      this.setState({
        show_loader: false
      })
    }

    this.setState({
      insuranceProducts: insuranceProducts
    })
  }


  navigate = (pathname, search) => {

    console.log(this.props)

    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams,
      params: {
        fromHome: true
      }
    });
  }

 
  handleClick = (product_key, title) => {
    this.sendEvents('next', title)
    let stateMapper = {
      'HEALTH_SURAKSHA': 'health_suraksha',
      'CRITICAL_HEALTH_INSURANCE': 'critical_illness',
      'HEALTH_SUPER_TOPUP': 'super_topup',
      'HOSPICASH': 'hospicash'
    };

    var fullPath = 'health/' + stateMapper[product_key] + '/plan';
    if (product_key === 'HOSPICASH') {
      fullPath = stateMapper[product_key] + '/plan';
    }
    if (product_key === 'HEALTH_SURAKSHA' && !getConfig().iOS) {
      this.HealthInsuranceEntry();
      return;
      fullPath = 'group-health/entry';
    }
    this.navigate('/group-insurance/' + fullPath);
  }

  HealthInsuranceEntry = () => {
    let Comprehensive = !this.state.Comprehensive
    this.setState({
      Comprehensive : Comprehensive
    })
  }

  renderPorducts(props, index) {
    return (

      <div>     


      <div key={index} onClick={() => this.handleClick(props.key, props.title)} style={{
        display: 'flex', alignItems: 'center', borderBottomWidth: '1px',
        borderBottomColor: '#EFEDF2', borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '', paddingTop: '15px',
        paddingBottom: '15px', justifyContent: 'space-between', cursor: 'pointer'
      }}>
        <div style={{ display: 'flex' }}>
          <img src={props.icon} alt="" style={{ marginRight: '15px' }} />
          <div>
            <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px',fontWeight:500 ,  flexGrow : 1 , width : '130%'}}>{props.title} 
             {props.dropdown && !this.state.Comprehensive && <span style={{ "float" : "right" , color : 'blue'}}>                  
                  <img src={props.dropdown} alt="" style={{ marginRight: '15px' }} />
                  </span>}

                  {props.dropdown &&  this.state.Comprehensive &&<span style={{ "float" : "right" , color : 'blue'}}>                  
                  <img src={props.uparrow} alt="" style={{ marginRight: '15px' }} />
                  </span>}
            {/* {props.key === 'HEALTH_INSURANCE' && 
            <span style={{    padding: '3px 7px',
              borderRadius: 10,fontSize: 10,background: '#7f66bf',margin: '0 0 0 10px',color: 'white'
          }}>3 Plans</span>} */}
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
     {/* <div style={{ display: 'flex' }}>{ props.key === 'HEALTH_SURAKSHA' && <HealthInsuranceEntry  parent={this} /> } </div> */}
      </div>

    { props.dropdown && this.state.Comprehensive && 
       <div key={index} onClick={() => this.handleClick(props.key, props.title)} style={{
        display: 'flex', alignItems: 'center', borderBottomWidth: '1px',
        borderBottomColor: '#EFEDF2', borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '', paddingTop: '15px',
        paddingBottom: '15px', justifyContent: 'space-between', cursor: 'pointer'
      }}>
     <div style={{ display: 'flex' }}>{props.key === 'HEALTH_SURAKSHA' && <HealthInsuranceEntry  parent={this} /> } </div>
      </div>
      
      }
      </div>
    )
  }

  sendEvents(user_action, insurance_type) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'health insurance',
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
        title="Health insurance">
        <div>
          <div className='products'>
            <h1 style={{ fontWeight: '700', color: '#160d2e', fontSize: '20px' }}>Insure your health</h1>
            <div>
              {this.state.insuranceProducts.map(this.renderPorducts)}
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default HealthInsuranceLanding;