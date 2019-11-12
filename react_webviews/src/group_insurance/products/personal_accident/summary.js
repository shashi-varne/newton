import React, { Component } from 'react';
import PlanSummary from '../../ui_components/general_insurance/plan_summary';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';

class AccidentSummary extends Component {

  constructor(props) {
    super(props);
    this.state = {
     
    }
  }

  componentWillMount() {

    let lead_id = window.localStorage.getItem('group_insurance_lead_id_selected');
    this.setState({
      lead_id: lead_id || ''
    })

  }

  async componentDidMount() {
    try {
      // const res = await Api.get('ins_service/api/insurance/bhartiaxa/get/quote?product_name=personal_accident')
      const res = '';
      this.setState({
        show_loader: false
      })
      if (res.pfwresponse.status_code === 200) {

        var resultData = res.pfwresponse.result;
        console.log(resultData);

      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message
          || 'Something went wrong');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }

    let lead =  {
      "dob": "05-09-1995",
      "cover_amount": 40000,
      "product_title": "Personl Accident",
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


    let summaryData = {
      "product_title" : lead.product_title || '',
      "cover_amount" : lead.cover_amount || '',
      "product_coverage" : lead.product_coverage || '',
      "dt_policy_start" : lead.dt_policy_start || '',
      "dt_policy_end" : lead.dt_policy_end || '',
      "base_premium" : lead.base_premium || '',
      "tax_amount" : lead.tax_amount || '',
      "premium" : lead.premium || ''
    }

    this.setState({
      summaryData: summaryData
    })
  }

  navigate = (pathname, search) => {
    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams
    });
  }

  handleClick = async (final_data) => {
    

    try {
      let res2;
      res2 = await Api.post('ins_service/bhartiaxa/start/payment?lead_id=' + this.state.lead_id)

      console.log(res2)
      if (res2.pfwresponse.status_code === 200) {

        let paymentRedirectUrl = encodeURIComponent(
          window.location.origin + '/group-insurance/accident/payment'
        );
    
        var payment_link;
        var pgLink = payment_link;

        
        let app = getConfig().app;
        var back_url = encodeURIComponent(this.state.current_url);
        // eslint-disable-next-line
        pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl +
          '&app=' + app + '&back_url=' + back_url;
        if (getConfig().generic_callback) {
          pgLink += '&generic_callback=' + getConfig().generic_callback;
        }
        window.location.href = pgLink;

      } else {
        toast(res2.pfwresponse.result.error || res2.pfwresponse.result.message
          || 'Something went wrong');
      }

    } catch(err) {
      toast('Something went wrong');
    }

   
  }


  render() {
    return (
      <div>
        <PlanSummary
          parent={this}
        />
      </div>
    );
  }
}

export default AccidentSummary;