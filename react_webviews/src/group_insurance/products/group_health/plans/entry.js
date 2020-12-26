import React, { Component } from 'react';
// import Container from '../../../common/Container';
import hdfc_logo from '../../../../assets/ic_hdfc.svg';
import religare_logo from '../../../../assets/ic_care.svg';
import star_logo from '../../../../assets/ic_star_health.svg'
import toast from '../../../../common/ui/Toast'
import Api from 'utils/api'

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
        Product_name : 'Health_Suraksha',
        icon: hdfc_logo
      },
      {
        key: 'RELIGARE',
        title: 'Care Health',
        subtitle: 'Care',
        Product_name : 'Care',
        icon: religare_logo
      },
      {
        key: 'STAR',
        title: 'Star',
        subtitle: 'Family health optima',
        Product_name : 'Star',
        icon: star_logo
      }
    ];


      this.setState({
        insuranceProducts: insuranceProducts
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

 
    handleClick = async (data) => {

      this.setState({
        show_loader: true
      });

      try {
        const res = await Api.get(`/api/ins_service/api/insurance/health/journey/started?product_name=${data.Product_name}`);

        let resultData = res.pfwresponse
        if(res.pfwresponse.status_code === 200){
          this.sendEvents('next', data.key)
          let fullPath = data.key + '/landing';
          this.navigate('/group-insurance/group-health/' + fullPath);
        }else {
          toast(resultData.error || resultData.message || "Something went wrong");
        }
      } catch (err) {
        console.log(err)
        this.setState({
          show_loader: false,
        });
        toast("Something went wrong");
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
      <div
        events={this.sendEvents('just_set_events')}
        noFooter={true}
        showLoader={this.state.show_loader}
        title=""> 
        <div className="group-health-insurance-entry">
          <div className='products'>
          {/* <div className='health_insurance'> </div> */}
            <div>
              {this.state.insuranceProducts.map(this.renderPorducts)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HealthInsuranceEntry;
