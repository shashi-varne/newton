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

    this.renderProducts = this.renderProducts.bind(this);
  }

  componentWillMount() {
    nativeCallback({ action: 'take_control_reset' });
    let insuranceProducts = [
      {
        key: 'CRITICAL_HEALTH_INSURANCE',
        title: 'Critical illness insurance',
        subtitle: 'Cover against life threatening diseases',
        icon: 'icn_critical_illness',
        Product_name : 'Critical illness'
      },
      {
        key: 'DENGUE',
        title: 'Dengue insurance',
        subtitle: 'Starts from ₹50/year',
        icon: 'icn_dengue',
        Product_name : 'dengue insurance',
        resume_flag : this.props.parent.state.resumeFlagAll  ? this.props.parent.state.resumeFlagAll['DENGUE'] : false
      },
      {
        key: 'CORONA',
        title: 'Coronavirus Insurance',
        subtitle: 'Keep your savings immune to covid',
        icon: 'icn_corona',
        Product_name : 'coronovirus insurance',
        resume_flag : this.props.parent.state.resumeFlagAll ? this.props.parent.state.resumeFlagAll['CORONA']  : false
      },
    ];

    if (this.state.partner_code === 'hbl') {
      let index = insuranceProducts.findIndex(obj => obj.key === "CORONA");
      insuranceProducts.splice(index, 1);
    }

    let { params } = this.props.location || {};
    let openModuleData = params ? params.openModuleData : {}

    // let redirect_url =  decodeURIComponent(getConfig().redirect_url);
    // if(!openModuleData.sub_module && redirect_url && redirect_url.includes("exit_web")) {
    //   window.location.href = redirect_url;
    // }

    this.setState({
      openModuleData: openModuleData || {},
      insuranceProducts: insuranceProducts,
      BHARTIAXA_APPS : this.props.parent.state.BHARTIAXA_APPS
    })
  }

  componentDidMount(){
    if (this.state.openModuleData.sub_module) {
      let navigateMapper = {
        // hospicash: 'HOSPICASH',
        // personal_accident: 'PERSONAL_ACCIDENT',
        // smart_wallet: 'SMART_WALLET',
        // term_insurance: 'TERM_INSURANCE',
        dengue: 'DENGUE',
        corona: 'CORONA'
      };

      let pathname = navigateMapper[this.state.openModuleData.sub_module] ||
        this.state.openModuleData.sub_module;
      this.handleClick(pathname);
    }
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

  sendEvents(value){
    this.props.onSelectEvent(value);
  }

  handleClick = (data) => {

    this.setState({
      show_loader : true
    })

    let product_key = data.key ? data.key : data;
    typeof data === 'object' ? data.insurance_type = 'Disease specific plans'  : data = {"insurance_type" : 'Disease specific plans'}
    this.sendEvents(data);
    var BHARTIAXA_PRODUCTS = ['HOSPICASH', 'DENGUE', 'CORONA'];

    var lead_id = '';
    var path = '';
    var fullPath = '';

    if (product_key === 'CRITICAL_HEALTH_INSURANCE') {
      fullPath = 'health/critical_illness/plan';
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
    }

    window.sessionStorage.setItem('group_insurance_lead_id_selected', lead_id || '');
    this.navigate('/group-insurance/' + fullPath);
  }

  renderProducts(props, index) {
    return (
      <div key={index} onClick={() => this.handleClick(props)} style={{
        display: 'flex', alignItems: 'center', width : '100%'
        
        // borderBottomWidth: '1px',
        // borderBottomColor: '#EFEDF2', borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '', paddingTop: '20px',
        // paddingBottom: '20px', justifyContent: 'space-between', cursor: 'pointer' ,
      }}>
        <div style={{ display: 'flex' , width : '100%'}}>
          <img src={ require(`assets/${props.icon}_${this.state.type}.svg`)  } alt="" style={{margin : '0px 26px 0px 8px'}}/>
          <div style={{ borderBottomWidth: '1px',
                  borderBottomColor: '#EFEDF2', borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '',   paddingTop: '20px', paddingBottom: '20px',
                  justifyContent: 'space-between', cursor: 'pointer' , width : '100%'}}>
            <div style={{ color: '#160D2E', fontSize: '13px', marginBottom: '5px', fontWeight: 400 }}>{props.title}
              {/* {props.key === 'CORONA' && !props.resume_flag &&
                <span style={{
                  padding: '3px 7px',
                  borderRadius: 10, fontSize: 10, background: getConfig().primary, margin: '0 0 0 10px', color: 'white'
                }}>New</span>} */}
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


  render() { return ( <div style={{width : '100%'}}> {this.state.insuranceProducts.map(this.renderProducts)} </div> ) }

}

export default DiseasesSpecificPlan;