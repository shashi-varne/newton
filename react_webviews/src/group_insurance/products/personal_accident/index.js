import React, { Component } from 'react';
import PlanDetails from '../../ui_components/general_insurance/plan_details';

import { getConfig } from 'utils/functions';

import ic_pa_b1_fisdom from 'assets/ic_pa_b1_fisdom.svg';
import ic_pa_b2_fisdom from 'assets/ic_pa_b2_fisdom.svg';
import ic_pa_b3_fisdom from 'assets/ic_pa_b3_fisdom.svg';
import ic_pa_b4_fisdom from 'assets/ic_pa_b4_fisdom.svg';
import ic_pa_b5_fisdom from 'assets/ic_pa_b5_fisdom.svg';
import ic_pa_b6_fisdom from 'assets/ic_pa_b6_fisdom.svg';
import ic_pa_b7_fisdom from 'assets/ic_pa_b7_fisdom.svg';

import ic_pa_b1_myway from 'assets/ic_pa_b1_myway.svg';
import ic_pa_b2_myway from 'assets/ic_pa_b2_myway.svg';
import ic_pa_b3_myway from 'assets/ic_pa_b3_myway.svg';
import ic_pa_b4_myway from 'assets/ic_pa_b4_myway.svg';
import ic_pa_b5_myway from 'assets/ic_pa_b5_myway.svg';
import ic_pa_b6_myway from 'assets/ic_pa_b6_myway.svg';
import ic_pa_b7_myway from 'assets/ic_pa_b7_myway.svg';

class AccidentPlanDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      checked: false,
      plan_data: {},
      recommendedIndex: 0,
      product_key: 'PERSONAL_ACCIDENT',
      type: getConfig().productName,
      ic_pa_b1: getConfig().productName !== 'fisdom' ? ic_pa_b1_myway : ic_pa_b1_fisdom,
      ic_pa_b2: getConfig().productName !== 'fisdom' ? ic_pa_b2_myway : ic_pa_b2_fisdom,
      ic_pa_b3: getConfig().productName !== 'fisdom' ? ic_pa_b3_myway : ic_pa_b3_fisdom,
      ic_pa_b4: getConfig().productName !== 'fisdom' ? ic_pa_b4_myway : ic_pa_b4_fisdom,
      ic_pa_b5: getConfig().productName !== 'fisdom' ? ic_pa_b5_myway : ic_pa_b5_fisdom,
      ic_pa_b6: getConfig().productName !== 'fisdom' ? ic_pa_b6_myway : ic_pa_b6_fisdom,
      ic_pa_b7: getConfig().productName !== 'fisdom' ? ic_pa_b7_myway : ic_pa_b7_fisdom,
    }
  }

  componentWillMount() {

    let lead_id = window.sessionStorage.getItem('group_insurance_lead_id_selected');
    let { params } = this.props.location;
    this.setState({
      premium_details: params ? params.premium_details : {},
      lead_id: lead_id || ''
    })

    this.setState({
      
    })

    var product_benefits = [
      {
        'disc': 'Lumpsum payout to your family in case of accidental death',
        'key': 'lumpsum_payout',
        'icon': this.state.ic_pa_b1
      },
      {
        'disc': 'Lumpsum payout for partial & total disability',
        'key': 'disablement_coverage',
        'icon': this.state.ic_pa_b2
      },
      {
        'disc': 'Dependent child education benefit',
        'disc2': '(Select higher plans to get this benefit)',
        'key': 'child_education',
        'icon': this.state.ic_pa_b6
      },
      // {
      //   'disc': 'Protection against accidental burns',
      //   'key': 'accidental_burns_protection',
      //   'icon': this.state.ic_pa_b3
      // },
      {
        'disc': 'Allowances for ambulance & legal expenses',
        'disc2': '(Select higher plans to get this benefit)',
        'key': 'last_rites',
        'icon': this.state.ic_pa_b4
      },
      {
        'disc': 'Allowances for purchase of blood',
        'disc2': '(Select higher plans to get this benefit)',
        'key': 'blood_allowence',
        'icon': this.state.ic_pa_b5
      },
      {
        'disc': 'Transportation of imported medicine',
        'disc2': '(Select higher plans to get this benefit)',
        'key': 'imported_medicine',
        'icon': this.state.ic_pa_b7
      }
    ]

    var plan_data = {
      'product_name': 'Personal Accident',
      'product_tag_line': 'Cover your financial losses  against accidental death and disability',
      'key': 'PERSONAL_ACCIDENT',
      'logo': '',
      'premium_details': [
        {
          "sum_assured": 1000000,
          "product_benefits_included": ['lumpsum_payout', 'disablement_coverage', 
          'last_rites', 'blood_allowence', 'child_education', 'imported_medicine'],
          "premium": "1200",
          "tax_amount": "216",
          "plus_benefit": '+4 Benefits'
        },
        {
          "sum_assured": 500000,
          "product_benefits_included": ['lumpsum_payout', 'disablement_coverage', 
          'last_rites', 'blood_allowence', 'child_education', 'imported_medicine'],
          "premium": "700",
          "tax_amount": "126",
          "plus_benefit": '+4 Benefits'
        },
        {
          "sum_assured": 200000,
          "product_benefits_included": ['lumpsum_payout', 'disablement_coverage'],
          "premium": "200",
          "tax_amount": "36",
          "plus_benefit": ''
        }
      ]
    }

    plan_data.premium_details.forEach(function (premium, index) {

      plan_data.premium_details[index].product_benefits = []
      product_benefits.forEach(function (benefit, index2) {
        let benefit_data = {};
        benefit_data = Object.assign(benefit_data, benefit);
        if (premium.product_benefits_included.indexOf(benefit_data.key) === -1) {
          benefit_data.isDisabled = true;
        }

        plan_data.premium_details[index].product_benefits.push(benefit_data)
      });
    });


    this.setState({
      plan_data: plan_data
    })
  }

  navigate = (pathname, search, premium_details) => {
    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams,
      params: {
        premium_details: premium_details || {}
      }
    });
  }

  handleClick = async (final_data) => {

    this.navigate('form', '', final_data);

  }

  render() {
    return (
      // <div>
        <PlanDetails
          parent={this}
        />
      // </div>
    );
  }

}

export default AccidentPlanDetails;