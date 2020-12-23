import React, { Component } from 'react';
import Container from  '../../common/Container';

import { getConfig } from '../../../utils/functions';
import { nativeCallback } from '../../../utils/native_callback'

import { getBhartiaxaStatusToState, insuranceStateMapper } from '../../constants'


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

    let insuranceProducts = [{
        key: 'SMART_WALLET',
        title: 'Smart Wallet(fraud protection)',
        subtitle: 'Starts from ₹250/year',
        icon: 'ic_wallet'
      }, 
      
      {
        key: 'PERSONAL_ACCIDENT',
        title: 'Personal Accident Insurance',
        subtitle: 'Starts from ₹200/year',
        icon: 'ic_personal_accident'
      },

      {
        key: 'HOME_INSURANCE',
        title: 'Home insurance',
        subtitle: 'Secure your home and interiors',
        icon: 'home_insurance_icon',
        disabled: false
      },
    ];
      this.setState({
        insuranceProducts: insuranceProducts
      })
  }


  navigate = (pathname, search) => {

    console.log(this.props , pathname )


    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams,
      params: {
        fromHome: false
      }
    });
  }

  handleClick = (product_key_info) => {
    let product_key = product_key_info.key
    console.log(product_key,'product_key')

    this.sendEvents('next', product_key)
    var BHARTIAXA_PRODUCTS = ['PERSONAL_ACCIDENT', 'HOSPICASH', 'SMART_WALLET', 'HEALTH', 'DENGUE', 'CORONA'];

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
    } else if (product_key === 'LIFE_INSURANCE') {           ///Other-Insurance/entry
        fullPath = 'life-insurance/entry';                                   
    }  else if (product_key === 'Other_Insurance') {      
      fullPath = 'other-insurance/entry';                                   
    }else if (product_key === 'HEALTH_INSURANCE') {
      fullPath = 'health/landing';
    }    
    else if (product_key === 'HOME_INSURANCE') {
        fullPath = 'home_insurance/general/plan';
    this.navigate('/group-insurance/' + fullPath);
    } else {
      // this.navigate(this.state.redirectTermPath);
      this.navigate('/group-insurance/term/intro');
      return;
    }
    // window.sessionStorage.setItem('group_insurance_lead_id_selected', lead_id || '');
    this.navigate('/group-insurance/' + fullPath);
  }




//   handleClick = (data) => {


//     console.log(data,'dataaaaaaaaaa')


//     let fullPath;
//     if(data.key === 'term'){
//       this.sendEvents('next', 'term insurance')
//     }else{
//       this.sendEvents('next', data.key)
//     }
    
//     if (data.key === 'savings plan') {
//       // if(!getConfig().Web && !isFeatureEnabled(getConfig(), 'open_inapp_tab')){
//         // this.navigate('/group-insurance/life-insurance/app-update')
//       // }else{
//         this.navigate('/group-insurance/life-insurance/savings-plan/landing');
//       // }
//     }  else if (data.key === 'HOME_INSURANCE') {             // /group-insurance/home_insurance/general/plan
//         //  fullPath = data.key 
//         fullPath = 'home_insurance/general/plan';

//         this.navigate('/group-insurance/' + fullPath);
//       }else {
//        fullPath = data.key + '/landing';
//       this.navigate('/group-insurance/life-insurance/' + fullPath);
//     }



//     // this.navigate('group-insurance/' + fullPath);
//   } ic_personal_accident.svg

  renderPorducts(props, index) {

    if(!props.disabled) {
      return (
        <div className='insurance_plans' key={index} onClick={() => this.handleClick(props)}
        style={{
           borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '', paddingTop: '15px',
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
        title="Other Insurance"
        styleHeader={{marginLeft: '10px'}}> 
        <div className="group-health-insurance-entry">
          <div className='products'>
            <div className='health_insurance'>Unique plans for specific needs</div>
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
