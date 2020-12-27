import React, { Component } from 'react';
// import Container from '../common/Container';
import qs from 'qs';
import { insuranceStateMapper } from '../../constants';

// import Api from 'utils/api';
// import toast from '../../../common/ui/Toast'
import { getConfig } from 'utils/functions';
import { getBhartiaxaStatusToState } from '../../constants';
import { nativeCallback } from 'utils/native_callback';
import '../../common/Style.scss'

class DiseasesSpecificPlan extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      type: getConfig().productName,
      insuranceProducts: [],
      partner_code: getConfig().partner_code,
      params: qs.parse(props.parent.props.history.location.search.slice(1))
    }

    this.renderPorducts = this.renderPorducts.bind(this);
  }

  componentWillMount() {
    nativeCallback({ action: 'take_control_reset' });
    let insuranceProducts = [
      {
        key: 'CRITICAL_HEALTH_INSURANCE',
        title: 'Critical illness insurance',
        subtitle: 'Cover against life threatening diseases',
        icon: 'icn_critical_illness'
      },
      {
        key: 'DENGUE',
        title: 'Dengue insurance',
        subtitle: 'Starts from ₹50/year',
        icon: 'icn_dengue',
        resume_flag : this.props.parent.state.resumeFlagAll  ? this.props.parent.state.resumeFlagAll['DENGUE'] : false
      },
      {
        key: 'CORONA',
        title: 'Coronavirus Insurance',
        subtitle: 'Keep your savings immune to covid',
        icon: 'icn_corona',
        resume_flag : this.props.parent.state.resumeFlagAll ? this.props.parent.state.resumeFlagAll['CORONA']  : false
      },
    ];

    if (this.state.partner_code === 'hbl') {
      let index = insuranceProducts.findIndex(obj => obj.key === "CORONA");
      insuranceProducts.splice(index, 1);
    }

    let { params } = this.props.location || {};
    let openModuleData = params ? params.openModuleData : {}

    let redirect_url =  decodeURIComponent(getConfig().redirect_url);
    if(!openModuleData.sub_module && redirect_url && redirect_url.includes("exit_web")) {
      window.location.href = redirect_url;
    }

    this.setState({
      openModuleData: openModuleData || {},
      insuranceProducts: insuranceProducts,
      BHARTIAXA_APPS : this.props.parent.state.BHARTIAXA_APPS
    })
  }

  navigate = (pathname, search) => {

  this.props.parent.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams,
      params: {
        fromHome: true
      }
    });
  }

  handleClick = (product_key) => {

    // this.sendEvents('next', product_key)
    
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
    } 

    if (product_key === 'CORONA'){
      fullPath = 'corona/plan';
  }
  else if (product_key === 'CRITICAL_HEALTH_INSURANCE') {
      fullPath = 'health/critical_illness/plan';
    }
    else if(product_key === 'DENGUE'){
      fullPath = 'dengue/plan'
    }
  else {
    // this.navigate(this.state.redirectTermPath);   /group-insurance/dengue/plan
    // this.navigate('/group-insurance/term/intro');
    return;
  }


    window.sessionStorage.setItem('group_insurance_lead_id_selected', lead_id || '');
    this.navigate('/group-insurance/' + fullPath);
  }

  renderPorducts(props, index) {  

    console.log(props , props.resume_flag)

    return (
      <div key={index} onClick={() => this.handleClick(props.key)} style={{
        display: 'flex', alignItems: 'center', borderBottomWidth: '1px',
        borderBottomColor: '#EFEDF2', borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '', paddingTop: '20px',
        paddingBottom: '20px', justifyContent: 'space-between', cursor: 'pointer' , width : '320px'
      }}>
        <div style={{ display: 'flex' }}>
          <img src={ require(`assets/${props.icon}_${this.state.type}.svg`)  } alt="" style={{margin : '0px 26px 0px 8px'}}/>
          <div>
            <div style={{ color: '#160D2E', fontSize: '13px', marginBottom: '5px', fontWeight: 400 }}>{props.title}
              {props.key === 'CORONA' && !props.resume_flag &&
                <span style={{
                  padding: '3px 7px',
                  borderRadius: 10, fontSize: 10, background: getConfig().primary, margin: '0 0 0 10px', color: 'white'
                }}>New</span>}
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

  // sendEvents(user_action, insurance_type ) {
  //   let eventObj = {
  //     "event_name": 'Group Insurance',
  //     "properties": {
  //       "user_action": user_action,
  //       "screen_name": 'insurance',
  //       "insurance_type": insurance_type ? insurance_type : ''
  //     }
  //   };

  //   if (user_action === 'just_set_events') {
  //     return eventObj;
  //   } else {
  //     nativeCallback({ events: eventObj });
  //   }
  // }

  render() {


    return (
      <div>
              {this.state.insuranceProducts.map(this.renderPorducts)}
      </div>
    );
  }
}

export default DiseasesSpecificPlan;