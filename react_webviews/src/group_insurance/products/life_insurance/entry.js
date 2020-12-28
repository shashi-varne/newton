import React, { Component } from 'react';
import Container from  '../../common/Container';

import { getConfig } from '../../../utils/functions';
import { nativeCallback } from '../../../utils/native_callback'



class LifeInsuranceEntry extends Component {

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
        key: 'term',
        title: 'Term Insurance',
        subtitle: 'Get comprehensive life coverage',
        icon: 'ic_term_insurance',
        disabled: false
      },
      {
        key: 'savings plan',
        title: 'Insurance Savings plan',
        subtitle: 'Enjoy wealth creation cum life coverage',
        icon: 'money_pig',
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
  
    this.sendEvents('next', data.title)
    
    if (data.key === 'savings plan') {
      // if(!getConfig().Web && !isFeatureEnabled(getConfig(), 'open_inapp_tab')){
        // this.navigate('/group-insurance/life-insurance/app-update')
      // }else{
        this.navigate('/group-insurance/life-insurance/savings-plan/landing');
      // }
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
           borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '', paddingTop: '24px', paddingBottom : '20px'
        }}
        >   
          <div className='insurance_plans_types'>
       <img src={require(`assets/${this.state.type}/${props.icon}.svg`)} alt='' className="insurance_plans_logos" />
            <div>
              <div className='insurance_plans_logos_text'
              >{props.title}{props.key === 'term' && !props.resume_flag &&
              <span style={{
                padding: '3px 7px',
                borderRadius: 10, fontSize: 10, background: getConfig().primary, margin: '0 0 0 10px', color: 'white'
              }}>Recommended</span>}
              </div>
              <div className='insurance_plans_logos_subtext' style={{ paddingBottom :'8px' }}>{props.subtitle}</div>
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
      }
    };

    if(insurance_type){
      eventObj.properties['insurance_type'] = insurance_type;
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
        title="Life Insurance"
        styleHeader={{marginLeft: '10px'}}> 
        <div className="group-health-insurance-entry">
          <div className='products'>
            <div className='health_insurance'>Must have plans for your family</div>
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
