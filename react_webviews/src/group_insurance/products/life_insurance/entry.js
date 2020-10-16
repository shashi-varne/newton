import React, { Component } from 'react';
import Container from  '../../common/Container';

import term_fisdom from 'assets/ic_term_insurance_fisdom.svg';
import term_myway from 'assets/ic_term_insurance_myway.svg';
import money_pig_fisdom from 'assets/fisdom/money_pig.svg'
import money_pig_myway from 'assets/myway/money_pig.svg'
import { getConfig } from '../../../utils/functions';
import { nativeCallback } from '../../../utils/native_callback'



class lifeinsurence extends Component {

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

    let termlogo = this.state.type !== 'fisdom' ? term_myway : term_fisdom
    let money_pig =  this.state.type !== 'fisdom' ? money_pig_myway : money_pig_fisdom

    let insuranceProducts = [
      {
        key: 'team',
        title: 'Team Insurence',
        subtitle: 'Get comprensive life coverage',
        icon: termlogo,
        disabled: false
      },
      {
        key: 'lifeinsurencesavings',
        title: 'Insurence Savings plan',
        subtitle: 'Life coverage with wealth creation',
        icon: money_pig,
        disabled: false
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
    if (data.key === 'lifeinsurencesavings') {
      this.navigate('/group-insurance/life-insurance/savings-plan/landing');
    } else {
      let fullPath = data.key + '/landing';
      this.navigate('/group-insurance/life-insurance/' + fullPath);
    }
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
              >{props.title}{props.key === 'team' && !props.resume_flag &&
              <span style={{
                padding: '3px 7px',
                borderRadius: 10, fontSize: 10, background: getConfig().primary, margin: '0 0 0 10px', color: 'white'
              }}>Recommended</span>}
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
        "screen_name": 'Life Insurance',
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
        title="Life Insurance"
        styleHeader={{marginLeft: '10px'}}> 
        <div className="group-health-insurance-entry">
          <div className='products'>
            <div className='health_insurance'>Must have plans for your Family</div>
            <div>
              {this.state.insuranceProducts.map(this.renderPorducts)}
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default lifeinsurence;
