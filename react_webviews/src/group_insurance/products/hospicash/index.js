import React, { Component } from 'react';
import PlanDetails from '../../ui_components/general_insurance/plan_details';

import { getConfig } from 'utils/functions';

import ic_hospicash_b1_fisdom from 'assets/ic_hospicash_b1_fisdom.svg';
import ic_hospicash_b2_fisdom from 'assets/ic_hospicash_b2_fisdom.svg';
import ic_hospicash_b4_fisdom from 'assets/ic_hospicash_b4_fisdom.svg';

import ic_hospicash_b1_myway from 'assets/ic_hospicash_b1_myway.svg';
import ic_hospicash_b2_myway from 'assets/ic_hospicash_b2_myway.svg';
import ic_hospicash_b4_myway from 'assets/ic_hospicash_b4_myway.svg';
import { Fragment } from 'react';

class HospicashPlanDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      checked: false,
      show_loader:true,
      plan_data: {},
      recommendedIndex: 0,
      product_key: 'HOSPICASH',
      type: getConfig().productName,
      ic_hospicash_b1: getConfig().productName !== 'fisdom' ? ic_hospicash_b1_myway : ic_hospicash_b1_fisdom,
      ic_hospicash_b2: getConfig().productName !== 'fisdom' ? ic_hospicash_b2_myway : ic_hospicash_b2_fisdom,
      ic_hospicash_b4: getConfig().productName !== 'fisdom' ? ic_hospicash_b4_myway : ic_hospicash_b4_fisdom
    }
  }

  componentWillMount() {

    let lead_id = window.sessionStorage.getItem('group_insurance_lead_id_selected');
    let { params } = this.props.location;
    this.setState({
      premium_details: params ? params.premium_details : {},
      lead_id: lead_id || ''
    })

    var product_benefits = [
      {
        'disc': 'Daily cash benefits on hospitalisation for 30 days.',
        'key' : 'daily_cash',
        'icon': this.state.ic_hospicash_b1
      },
      {
        'disc': 'Claim against discharge summary, no questions asked.',
        'key' : 'no_medical_examination',
        'icon': this.state.ic_hospicash_b2
      }
    ]

    var plan_data = {
      'product_name': 'Hospicash',
      'product_tag_line': 'Cover your expenses for any type of hospitalisation.',
      'key': 'HOSPICASH',
      'logo': '',
      'premium_details': [
        {
          "sum_assured": 10000,
          "product_benefits_included": ['daily_cash','no_medical_examination'],
          "premium": "7500",
          "tax_amount": "1350",
          "plus_benefit": ''
        },
        {
          "sum_assured": 7500,
          "product_benefits_included": ['daily_cash','no_medical_examination'],
          "premium": "5000",
          "tax_amount": "900",
          "plus_benefit": ''
        },
        {
          "sum_assured": 5000,
          "product_benefits_included": ['daily_cash','no_medical_examination'],
          "premium": "2500",
          "tax_amount": "450",
          "plus_benefit": ''
        },
        {
          "sum_assured": 1500,
          "product_benefits_included": ['daily_cash','no_medical_examination'],
          "premium": "750",
          "tax_amount": "135",
          "plus_benefit": ''
        },
        // {
        //   "sum_assured": 500,
        //   "product_benefits_included": ['daily_cash','no_medical_examination'],
        //   "premium": "133",
        //   "tax_amount": "23.94",
        //   "plus_benefit": ''
        // }
      ]
    }

    plan_data.premium_details.forEach(function (premium, index) {

      plan_data.premium_details[index].product_benefits = []
      product_benefits.forEach(function (benefit, index2) {
       
        let benefit_data = {};
        benefit_data = Object.assign(benefit_data, benefit);
        if(index === 0 && benefit_data.key === 'daily_cash') {
          benefit_data.disc = 'Daily cash benefits on hospitalisation for 90 days.';
        }

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
      <Fragment>
        <PlanDetails
          parent={this}
        />
      </Fragment>
    );
  }

}

export default HospicashPlanDetails;