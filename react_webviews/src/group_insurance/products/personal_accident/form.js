import React, { Component } from 'react';
import BasicDetails from '../../ui_components/general_insurance/basic_details';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';


class AccidentForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      basic_details_data: {}
    }
  }

  componentWillMount() {

    let lead_id = window.localStorage.getItem('group_insurance_lead_id_selected');
    let { params } = this.props.location;
    this.setState({
      premium_details: params ? params.premium_details : {},
      lead_id: lead_id || ''
    })

  }

  async componentDidMount() {
    let basic_details_data = {
      "product_name": "smart_wallet",
      "name": "",
      "gender": "",
      "marital_status": "",
      "mobile_no": "",
      "email": "",
      "premium": '',
      "dob": "",
      "tax_amount": '',
      "cover_amount": '',
      "nominee": {
        "name": "", 
        "relation": ""
      },
      "nominee_checked" : false
    }
    try {

      if(this.state.lead_id) {
        // const res = await Api.get('api/insurance/bhartiaxa/lead/get/' + this.state.lead_id)
        const res = {
          "pfwtime": "2019-11-11 12:01:01.917960",
          "pfwmessage": "Success",
          "pfwutime": "",
          "pfwstatus_code": 200,
          "pfwuser_id": 0,
          "pfwresponse": {
              "requestapi": "",
              "result": {
                  "lead": {
                      "dob": "05-09-1995",
                      "cover_amount": 40000,
                      "product_title": "Smart Wallet",
                      "product_coverage": 1,
                      "tax_amount": 56,
                      "gender": "FEMALE",
                      "dt_updated": "11-11-2019",
                      "product_benefit": null,
                      "insurance_payment_id": 5930525202055168,
                      "dt_policy_end": "11 November 2020",
                      "dt_created": "11-11-2019",
                      "permanent_address": {},
                      "bhariaxa_policy_id": "",
                      "status": "incomplete",
                      "base_premium": 194,
                      "name": "monica",
                      "email": "monica@gmail.com",
                      "marital_status": "UNMARRIED",
                      "product_name": "SMART_WALLET",
                      "premium": 250,
                      "payment_status": "payment_ready",
                      "correspondence_address": {},
                      "id": 6212000178765824,
                      "mobile_no": "9944978331",
                      "account_id": "d5275456790069248",
                      "provider": "BHARTIAXA",
                      "dt_policy_start": "12 November 2019",
                      "policy": {},
                      "logo": ""
                  }
              },
              "status_code": 200
          }
      }
        this.setState({
          show_loader: false
        })
        if (res.pfwresponse.status_code === 200) {

          var leadData = res.pfwresponse.result.lead;

          Object.keys(basic_details_data).forEach((key) => {
            basic_details_data[key] = leadData[key]
          })

          basic_details_data['dob'] = basic_details_data['dob'] ? basic_details_data['dob'].replace(/\\-/g, '/').split('-').join('/') : ''
        } else {
          toast(res.pfwresponse.result.error || res.pfwresponse.result.message
            || 'Something went wrong');
        }
      }
      
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }

    this.setState({
      basic_details_data: basic_details_data
    })

  }

  handleClick = async (data) => {
    console.log("handle click parenttt")
    console.log(data)
    if (data) {
      data.product_name = 'personal_accident';

      let res2 = {};
      if(this.state.lead_id) {
        data.lead_id = this.state.lead_id;
        res2 = await Api.post('api/insurance/bhartiaxa/lead/update', data)
      }else {
        res2 = await Api.post('api/insurance/bhartiaxa/lead/create', data)
      }
      

      if (res2.pfwresponse.status_code === 200) {

      } else {
        toast(res2.pfwresponse.result.error || res2.pfwresponse.result.message
          || 'Something went wrong');
      }
    }

  }
 

  render() {
    return (
      <div>
        <BasicDetails
          parent={this}
        />
      </div>
    );
  }
}

export default AccidentForm;