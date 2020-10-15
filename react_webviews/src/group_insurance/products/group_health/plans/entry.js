import React, { Component } from 'react';
import Container from '../../../common/Container';
import hdfc_logo from '../../../../assets/ic_hdfc_logo.svg';
import religare_logo from '../../../../assets/ic_religare_logo_card.svg';
import star_logo from '../../../../assets/ic_star_logo.svg'

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class HealthInsuranceEntry extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      type: getConfig().productName,
      insuranceProducts: [],
    }
    this.renderPorducts = this.renderPorducts.bind(this);
  }

  componentWillMount() {

    nativeCallback({ action: 'take_control_reset' });

    let insuranceProducts = [
      {
        key: 'HDFCERGO',
        title: 'HDFC ERGO',
        subtitle: 'my: health Suraksha',
        icon: hdfc_logo
      },
      {
        key: 'RELIGARE',
        title: 'Care Health',
        subtitle: 'Care',
        icon: religare_logo,
        disabled: true
      },
      {
        key: 'STAR',
        title: 'Star',
        subtitle: 'Family health optima',
        icon: star_logo,
        disabled: true
      }
    ];


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

 
  handleClick = (data) => {

    this.sendEvents('next', data.key)

    let fullPath = data.key + '/landing';
    this.navigate('/group-insurance/group-health/' + fullPath);
  }

  renderPorducts(props, index) {
    if(!props.disabled) {
      return (
        <div className='insurance_plans' key={index} onClick={() => this.handleClick(props)}
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
        "screen_name": 'comprehensive health insurance',
        "insurance_provider": insurance_type ? insurance_type : ''
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
        <div className="group-health-insurance-entry">
          <div className='products'>
            <div className='health_insurance'>Health insurance plans</div>
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
