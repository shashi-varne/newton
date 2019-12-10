import React, { Component } from 'react';
import PlanDetails from '../../ui_components/general_insurance/plan_details';

import { getConfig } from 'utils/functions';

import ic_d_b1_fisdom from 'assets/ic_hospicash_b4_fisdom.svg';
import ic_d_b2_fisdom from 'assets/ic_claim_b2_fisdom.svg';

import ic_d_b1_myway from 'assets/ic_hospicash_b4_myway.svg';
import ic_d_b2_myway from 'assets/ic_claim_b2_myway.svg';

class DenguePlanDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      checked: false,
      plan_data: {},
      recommendedInedx: 0,
      product_key: 'DENGUE',
      type: getConfig().productName,
      ic_d_b1: getConfig().productName !== 'fisdom' ? ic_d_b1_myway : ic_d_b1_fisdom,
      ic_d_b2: getConfig().productName !== 'fisdom' ? ic_d_b2_myway : ic_d_b2_fisdom
    }
  }

  componentWillMount() {

    let lead_id = window.localStorage.getItem('group_insurance_lead_id_selected');
    let { params } = this.props.location;
    this.setState({
      premium_details: params ? params.premium_details : {},
      lead_id: lead_id || ''
    })

    this.setState({
      
    })

    var product_benefits = [
      {
        'disc': 'Reimburse you hospital expenses up to cover amount',
        'key': 'reimburse',
        'icon': this.state.ic_d_b1
      },
      {
        'disc': 'Easy claim process',
        'key': 'claim_process',
        'icon': this.state.ic_d_b2
      }
    ]

    var product_diseases = ['Dengue', 'Chikungunya', 'Kala-Azar', 'Japanese encephalitis', 'Filariasis', 'Malaria']

    var plan_data = {
      'product_name': 'Dengue insurance',
      'product_tag_line': 'Cover your hospital expenses for 6 vector borne disease under one plan.',
      'key': 'DENGUE',
      'logo': '',
      'premium_details': [
        {
          "sum_assured": 35000,
          "product_benefits_included": ['reimburse', 'claim_process'],
          "product_diseases_covered": product_diseases,
          "premium": "250",
          "tax_amount": "45"
        },
        {
          "sum_assured": 25000,
          "product_benefits_included": ['reimburse', 'claim_process'],
          "product_diseases_covered": product_diseases,
          "premium": "150",
          "tax_amount": "27"
        },
        {
          "sum_assured": 15000,
          "product_benefits_included": ['reimburse', 'claim_process'],
          "product_diseases_covered": product_diseases,
          "premium": "50",
          "tax_amount": "9"
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
      <div>
        <PlanDetails
          parent={this}
        />
      </div>
    );
  }

}

export default DenguePlanDetails;