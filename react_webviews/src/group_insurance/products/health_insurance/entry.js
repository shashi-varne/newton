import React, { Component } from 'react';
import Container from '../../common/Container';
import qs from 'qs';

import hdfc_logo from '../../../assets/ic_hdfc_logo.svg';
import religare_logo from '../../../assets/ic_religare_logo.png';
import star_logo from '../../../assets/ic_star_logo.png'

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class HealthInsuranceEntry extends Component {

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

    let insuranceProducts = [
      {
        key: 'HEALTH_SURAKSHA',
        title: 'HDFC ERGO',
        subtitle: 'My: health suraksha',
        icon: hdfc_logo
      },
      {
        key: 'RELIGARE',
        title: 'Religare',
        subtitle: 'Care',
        icon: religare_logo
      },
      {
        key: 'STAR',
        title: 'Star',
        subtitle: 'Family health optima',
        icon: star_logo
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
        'RELIGARE': 'religare_care',
        'STAR': 'star'
    };

    var fullPath = 'health/' + stateMapper[product_key] + '/plan';

    if(product_key === 'HEALTH_SURAKSHA' && !getConfig().iOS) {
      fullPath = 'group-health/landing';
    }
    this.navigate('/group-insurance/' + fullPath);
  }

  renderPorducts(props, index) {
    return (
      <div className='insurance_plans' key={index} onClick={() => this.handleClick(props.key)} 
      style={{
         borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '', paddingTop: '15px',
      }}
      >
        <div className='insurance_plans_types'>
          <img src={props.icon} alt="" className="insurance_plans_logos"/>
          <div>
            <div className='insurance_plans_logos_text'
            >{props.title}
            </div>
            <div className='insurance_plans_logos_subtext'>{props.subtitle}</div>
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
        title="Comprehensive health insurance">
        <div style={{ padding: '20px' }}>
          <div className='products'>
            <h1 className='health_insurance'>Health insurance plans</h1>
            <div>
              {this.state.insuranceProducts.map(this.renderPorducts)}
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default HealthInsuranceEntry;
