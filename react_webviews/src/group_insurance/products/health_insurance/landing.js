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



import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class HealthInsuranceLanding extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      type: getConfig().productName,
      insuranceProducts: [],
      params: qs.parse(props.history.location.search.slice(1))
    }

    this.renderPorducts = this.renderPorducts.bind(this);
  }

  componentWillMount() {

    nativeCallback({ action: 'take_control_reset' });
    let critical_illness_icon = this.state.type !== 'fisdom' ? critical_illness_myway : critical_illness_fisdom;
    let health_suraksha_icon = this.state.type !== 'fisdom' ? health_suraksha_myway : health_suraksha_fisdom;
    let super_topup_icon = this.state.type !== 'fisdom' ? super_topup_myway : super_topup_fisdom;

    let insuranceProducts = [
      {
        key: 'HEALTH_SURAKSHA',
        title: 'Health suraksha',
        subtitle: 'Comprehensive health coverage',
        icon: health_suraksha_icon
      },
      {
        key: 'CRITICAL_HEALTH_INSURANCE',
        title: 'Critical illness insurance',
        subtitle: 'Cover against life threatening diseases',
        icon: critical_illness_icon
      },
      {
        key: 'HEALTH_SUPER_TOPUP',
        title: 'Health super top-up',
        subtitle: 'Boost your existing health insurance',
        icon: super_topup_icon
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
    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams,
      params: {
        fromHome: true
      }
    });
  }

 
  handleClick = (product_key) => {

    this.sendEvents('next', product_key)
    

    let stateMapper = {
        'HEALTH_SURAKSHA': 'health_suraksha',
        'CRITICAL_HEALTH_INSURANCE': 'critical_illness',
        'HEALTH_SUPER_TOPUP': 'super_topup'
    };

    var fullPath = 'health/' + stateMapper[product_key] + '/plan';
    this.navigate('/group-insurance/' + fullPath);
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
            <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px',fontWeight:500 }}>{props.title}
            {props.key === 'HEALTH_INSURANCE' && 
            <span style={{    padding: '3px 7px',
              borderRadius: 10,fontSize: 10,background: '#7f66bf',margin: '0 0 0 10px',color: 'white'
          }}>3 Plans</span>}
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
        <div style={{ padding: '20px' }}>
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