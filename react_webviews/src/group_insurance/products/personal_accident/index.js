import React, { Component } from 'react';
import PlanDetails from '../../ui_components/general_insurance/plan_details';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';

class AccidentPlanDetails extends Component {
  state = {
    selectedPlan: 1,
    checked: false
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
    try {
      const res = await Api.get('ins_service/api/insurance/bhartiaxa/get/quote?product_name=personal_accident')

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

    var product_benefits = [
      {
        'disc': 'Lumpsum payout to your family in case of Accidental Death',
        'key' : 'lumpsum_payout',
        'icon': ''
      },
      {
        'disc': 'Coverage against Permanent Total or Partial Disablement',
        'key' : 'disablement_coverage',
        'icon': ''
      },
      {
        'disc': 'Protection against accidental burns',
        'key' : 'accidental_burns_protection',
        'icon': ''
      },
      {
        'disc': 'Allowances for ambulance and last rites (for plan 2 & 3 only)',
        'key' : 'last_rites',
        'icon': ''
      },
      {
        'disc': 'Allowances for purchase of blood (for plan 2 & 3 only)',
        'key' : 'blood_allowence',
        'icon': ''
      }
    ]

    var plan_data = {
      'name': 'Personal Accident',
      'key': 'personal_accident',
      'logo': '',
      'premium_details': [
        {
          "sum_assured": 200000,
          "product_benefits_included": ['lumpsum_payout', 'disablement_coverage', 
          'accidental_burns_protection'],
          "premium": "250",
          "tax_amount": "",
          "plus_benefit": ''
        },
        {
          "sum_assured": 500000,
          "product_benefits_included": ['lumpsum_payout', 'disablement_coverage', 
          'accidental_burns_protection', 'last_rites', 'blood_allowence'],
          "premium": "500",
          "plus_benefit": ''
        },
        {
          "sum_assured": 1000000,
          "product_benefits_included": ['lumpsum_payout', 'disablement_coverage', 
          'accidental_burns_protection', 'last_rites', 'blood_allowence'],
          "premium": "990",
          "plus_benefit": ''
        }
      ]
    }

    plan_data.premium_details.forEach(function (premium, index) {
      
      plan_data.premium_details[index].product_benefits = []
      product_benefits.forEach(function (benefit, index2) {
        if(premium.product_benefits_included.indexOf(benefit.key) === -1) {
          benefit.isDisabled = true;
        }

        plan_data.premium_details[index].product_benefits.push(benefit)
      });
    });

    console.log(plan_data)

    this.setState({
      plan_data: plan_data
    })
  }

  navigate = (pathname, search,premium_details) => {
    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams,
      params: {
        premium_details: premium_details || {}
      }
    });
  }

  selectPlan = (index) => {
    this.setState({ selectedPlan: index });
  
  }

  handleClick = async () => {
    var premium_details = {
      "premium": this.state.plan_data.premium_details[this.state.selectedPlan].premium,
      "cover_amount": this.state.plan_data.premium_details[this.state.selectedPlan].cover_amount,
      "tax_amount": this.state.plan_data.premium_details[this.state.selectedPlan].tax_amount
    }

    let res2 = {};
      if (this.state.lead_id) {
        premium_details.lead_id = this.state.lead_id;
        res2 = await Api.post('api/insurance/bhartiaxa/lead/update', premium_details)
      } else {
        res2 = await Api.post('api/insurance/bhartiaxa/lead/create', premium_details)
      }
      

      if (res2.pfwresponse.status_code === 200) {

        if(!this.state.lead_id) {
          var id = res2.pfwresponse.result.lead.id;
          window.localStorage.setItem('group_insurance_lead_id_selected', id || '');
        }
        this.navigate('form','', premium_details);
      } else {
        toast(res2.pfwresponse.result.error || res2.pfwresponse.result.message
          || 'Something went wrong');
      }

   
  }

  render() {
    return (
      <div>
        <PlanDetails
          
        />
      </div>
    );
  }

}

export default AccidentPlanDetails;