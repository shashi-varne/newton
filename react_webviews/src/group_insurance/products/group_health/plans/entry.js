import React, { Component } from 'react';
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


  sendEvents(value){
    this.props.onSelectEvent(value);
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
          data.insurance_type = 'Comprehensive health insurance'
          this.sendEvents(data)
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
        <div className='insurance_plans' style={{width : '100%'}} key={index} onClick={() => this.handleClick(props)}>
          <div className='insurance_plans_types' style={{width : '100%', padding : '0px'}}>
            <img src={props.icon} alt="" className="insurance_plans_logos_small"/>
            <div style={{ borderBottomWidth: '1px', width: this.state.insuranceProducts.length - 1 !== index ? `calc(100% - 85px)` : '100%',
                  borderBottomColor: '#EFEDF2', borderBottomStyle:'solid',   paddingTop: '20px', paddingBottom: this.state.insuranceProducts.length - 1 !== index ? '20px' : '40px',
                  justifyContent: 'space-between', cursor: 'pointer' }}>
              <div className='insurance_plans_logos_text' style={{fontWeight : '400', fontSize : '13px', marginBottom :'5px' , lineHeight : '15.41px', width : '100%'}}>{props.title}</div>
              <div className='insurance_plans_logos_subtext'>{props.subtitle}</div>
            </div>
          </div>
        </div>
      )
    }

    return null;
   
  }

  render() {
    return ( 
        <div className="group-health-insurance-entry" style={{width : '100%'}}>
          <div className='products' style={{width : '100%' , marginTop : '-8px'}}>
              {this.state.insuranceProducts.map(this.renderPorducts)}
            </div>
        </div>
    );
  }
}

export default HealthInsuranceEntry;
