import React, { Component } from 'react';
import PlanDetails from '../../../ui_components/general_insurance/plan_details';

import { getConfig } from 'utils/functions';

import ic_health_b1_fisdom from 'assets/ic_health_b1_fisdom.svg';
import ic_health_b1_myway from 'assets/ic_health_b1_myway.svg';

import ic_hospicash_b2_fisdom from 'assets/ic_hospicash_b2_fisdom.svg';
import ic_hospicash_b2_myway from 'assets/ic_hospicash_b2_myway.svg';

import ic_ci_b3_fisdom from 'assets/ic_ci_b3_fisdom.svg';
import ic_ci_b3_myway from 'assets/ic_ci_b3_myway.svg';
import { Fragment } from 'react';


class HealthCriticalIllness extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      checked: false,
      show_loader:true,
      plan_data: {},
      recommendedIndex: 0,
      product_key: 'CRITICAL_HEALTH_INSURANCE',
      provider: 'hdfcergo',
      integeration_type: 'redirection',
      type: getConfig().productName,
      ic_health_b1: getConfig().productName !== 'fisdom' ? ic_health_b1_myway : ic_health_b1_fisdom,
      ic_hospicash_b2: getConfig().productName !== 'fisdom' ? ic_hospicash_b2_myway : ic_hospicash_b2_fisdom,
      ic_ci_b3: getConfig().productName !== 'fisdom' ? ic_ci_b3_myway : ic_ci_b3_fisdom
    }
  }

  componentWillMount() {

    let { params } = this.props.location;
    this.setState({
      premium_details: params ? params.premium_details : {}
    })

    var product_diseases = ['Heart attack', 'Multiple sclerosi', 'Major organ transplantation', 
   'Cancer', 'Kidney failure', 'Stroke', 'Coronary artery bypass surgery', 'Paralysis',
    'Heart valve replacement', 'Primary pulmonary arterial hypertension',
     'Benign brain tumour', 'End stage liver disease', 
     "Parkinson's disease", 'Aorta graft surgery', "Alzheimer's disease"];

     var product_diseases2 = ['Heart attack', 'Multiple sclerosi', ' Major organ transplantation',
      'Cancer', 'Kidney failure', 'Stroke', 'Coronary artery bypass surgery', 'Paralysis'];

    var product_benefits = [
      {
        'disc': 'Lumpsum payout up to 10 lacs on the first diagnosis of illness',
        'key' : 'first_diagnosis',
        'icon': this.state.ic_health_b1
      },
      {
        'disc': 'No hospitalisation required to get the claim',
        'key' : 'hospitalisation_cliam',
        'icon': this.state.ic_hospicash_b2
      },
      {
        'disc': 'Save tax up to ₹50,000 under section 80 (D)',
        'key' : 'save_tax',
        'icon': this.state.ic_ci_b3
      }
    ]

    var plan_data = {
      'product_name': 'Health suraksha',
      'product_tag_line': 'Cover against life-threatening diseases like cancer, heart attack, paralysis and more',
      'key': 'CRITICAL_HEALTH_INSURANCE',
      'logo': '',
      'premium_details': [
        {
          "sum_assured": '',
          "product_plan_title": "Platinum",
          "product_benefits_included": ['first_diagnosis', 'hospitalisation_cliam', 'save_tax'],
          "premium": "1150",
          "tax_amount": "",
          "plus_benefit": '15 diseases',
          "product_diseases_covered": product_diseases,
          'product_plan': 'platinum'
        },
        {
          "sum_assured": '',
          "product_plan_title": "Silver",
          "product_benefits_included": ['first_diagnosis', 'hospitalisation_cliam', 'save_tax'],
          "premium": "1000",
          "tax_amount": "",
          "plus_benefit": '8 diseases',
          "product_diseases_covered": product_diseases2,
          'product_plan': 'silver'
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

export default HealthCriticalIllness;