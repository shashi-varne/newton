import React, { Component } from 'react';
import PlanDetails from '../../ui_components/general_insurance/plan_details';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';

import ic_pa_b1 from 'assets/ic_pa_b1.svg';
import ic_pa_b2 from 'assets/ic_pa_b2.svg';
import ic_pa_b3 from 'assets/ic_pa_b3.svg';
import ic_pa_b4 from 'assets/ic_pa_b4.svg';
import ic_pa_b5 from 'assets/ic_pa_b5.svg';

class AccidentPlanDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 1,
      checked: false,
      show_loader:true,
      plan_data: {},
      recommendedInedx: 1,
      product_key: 'PERSONAL_ACCIDENT'
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
        'icon': ic_pa_b1
      },
      {
        'disc': 'Coverage against Permanent Total or Partial Disablement',
        'key' : 'disablement_coverage',
        'icon': ic_pa_b2
      },
      {
        'disc': 'Protection against accidental burns',
        'key' : 'accidental_burns_protection',
        'icon': ic_pa_b3
      },
      {
        'disc': 'Allowances for ambulance and last rites (for plan 2 & 3 only)',
        'key' : 'last_rites',
        'icon': ic_pa_b4
      },
      {
        'disc': 'Allowances for purchase of blood (for plan 2 & 3 only)',
        'key' : 'blood_allowence',
        'icon': ic_pa_b5
      }
    ]

    var plan_data = {
      'product_name': 'Personal Accident',
      'product_tag_line': 'Cover your financial losses  against accidental death and disability',
      'key': 'PERSONAL_ACCIDENT',
      'logo': '',
      'premium_details': [
        {
          "sum_assured": 200000,
          "product_benefits_included": ['lumpsum_payout', 'disablement_coverage', 
          'accidental_burns_protection'],
          "premium": "250",
          "tax_amount": "36",
          "plus_benefit": ''
        },
        {
          "sum_assured": 500000,
          "product_benefits_included": ['lumpsum_payout', 'disablement_coverage', 
          'accidental_burns_protection', 'last_rites', 'blood_allowence'],
          "premium": "500",
          "tax_amount": "126",
          "plus_benefit": '2'
        },
        {
          "sum_assured": 1000000,
          "product_benefits_included": ['lumpsum_payout', 'disablement_coverage', 
          'accidental_burns_protection', 'last_rites', 'blood_allowence'],
          "premium": "990",
          "tax_amount": "216",
          "plus_benefit": '2'
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

  handleClick = async (final_data) => {
    
    this.navigate('form','', final_data);
   
  }

  render() {
    return (
      <div>
        <PlanDetails
          parent={this}
        />
      </div>
    );
  }

}

export default AccidentPlanDetails;