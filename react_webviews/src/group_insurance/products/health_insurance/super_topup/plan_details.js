import React, { Component } from 'react';
import PlanDetails from '../../../ui_components/general_insurance/plan_details';

import { getConfig } from 'utils/functions';


import ic_ci_b1_fisdom from 'assets/ic_ci_b1_fisdom.svg';
import ic_ci_b1_myway from 'assets/ic_ci_b1_myway.svg';

import ic_pa_b1_fisdom from 'assets/ic_pa_b1_fisdom.svg';
import ic_pa_b1_myway from 'assets/ic_pa_b1_myway.svg';


import ic_st_b3_fisdom from 'assets/ic_st_b3_fisdom.svg';
import ic_st_b3_myway from 'assets/ic_st_b3_myway.svg';

import ic_hospicash_b4_fisdom from 'assets/ic_hospicash_b4_fisdom.svg';
import ic_hospicash_b4_myway from 'assets/ic_hospicash_b4_myway.svg';

class HealthSuperTopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      checked: false,
      // show_loader:true,
      skelton: true,
      plan_data: {},
      recommendedIndex: 1,
      product_key: 'HEALTH_SUPER_TOPUP',
      provider: 'hdfcergo',
      integeration_type: 'redirection',
      type: getConfig().productName,
      ic_ci_b1: getConfig().productName !== 'fisdom' ? ic_ci_b1_myway : ic_ci_b1_fisdom,
      ic_pa_b1: getConfig().productName !== 'fisdom' ? ic_pa_b1_myway : ic_pa_b1_fisdom,
      ic_st_b3: getConfig().productName !== 'fisdom' ? ic_st_b3_myway : ic_st_b3_fisdom,
      ic_hospicash_b4: getConfig().productName !== 'fisdom' ? ic_hospicash_b4_myway : ic_hospicash_b4_fisdom,
    }
  }

  componentWillMount() {

    let { params } = this.props.location;
    this.setState({
      premium_details: params ? params.premium_details : {}
    })

    var product_benefits = [
      {
        'disc': 'Get additional coverage at an affordable premium',
        'key' : 'affordable',
        'icon': this.state.ic_ci_b1
      },
      {
        'disc': 'Option to cover individual and entire family',
        'key' : 'individual',
        'icon': this.state.ic_pa_b1
      },
      {
        'disc': 'Coverage for pre-exisitng diseases',
        'key' : 'pre_existing_diseases',
        'icon': this.state.ic_st_b3
      },
      {
        'disc': 'Cashless treatment at network hospitals',
        'key' : 'cashless',
        'icon': this.state.ic_hospicash_b4
      }
    ]

    var plan_data = {
      'product_name': 'Health super top-up',
      'product_tag_line': 'Boost your existing health cover',
      'key': 'HEALTH_SUPER_TOPUP',
      'logo': '',
      'premium_details': [
        {
          "sum_assured": 1600000,
          "product_benefits_included": ['affordable', 'individual', 'pre_existing_diseases', 'cashless'],
          "premium": "1930",
          "tax_amount": "",
          "plus_benefit": '',
          'product_plan': 'plan1'
        },
        {
          "sum_assured": 1100000,
          "product_benefits_included": ['affordable', 'individual', 'pre_existing_diseases', 'cashless'],
          "premium": "1540",
          "tax_amount": "",
          "plus_benefit": '',
          'product_plan': 'plan2'
        },
        {
          "sum_assured": 600000,
          "product_benefits_included": ['affordable', 'individual', 'pre_existing_diseases', 'cashless'],
          "premium": "990",
          "tax_amount": "",
          "plus_benefit": '',
          'product_plan': 'plan3'
        },
       
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

export default HealthSuperTopup;