import React, { Component } from 'react';
import PlanDetails from '../../../ui_components/general_insurance/plan_details';

import { getConfig } from 'utils/functions';

import ic_hs_b1_fisdom from 'assets/ic_hs_b1_fisdom.svg';
import ic_hs_b1_myway from 'assets/ic_hs_b1_myway.svg';

import ic_hs_b2_fisdom from 'assets/ic_hs_b2_fisdom.svg';
import ic_hs_b2_myway from 'assets/ic_hs_b2_myway.svg';

import ic_hs_b3_fisdom from 'assets/ic_hs_b3_fisdom.svg';
import ic_hs_b3_myway from 'assets/ic_hs_b3_myway.svg';

import ic_hs_b4_fisdom from 'assets/ic_hs_b4_fisdom.svg';
import ic_hs_b4_myway from 'assets/ic_hs_b4_myway.svg';

import ic_hs_b5_fisdom from 'assets/ic_hs_b5_fisdom.svg';
import ic_hs_b5_myway from 'assets/ic_hs_b5_myway.svg';

import ic_pa_b1_fisdom from 'assets/ic_pa_b1_fisdom.svg';
import ic_pa_b1_myway from 'assets/ic_pa_b1_myway.svg';
import { Fragment } from 'react';

class HealthSuraksha extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      checked: false,
      show_loader:true,
      plan_data: {},
      recommendedIndex: 1,
      product_key: 'HEALTH_SURAKSHA',
      provider: 'hdfcergo',
      integeration_type: 'redirection',
      type: getConfig().productName,
      ic_hs_b1: getConfig().productName !== 'fisdom' ? ic_hs_b1_myway : ic_hs_b1_fisdom,
      ic_hs_b2: getConfig().productName !== 'fisdom' ? ic_hs_b2_myway : ic_hs_b2_fisdom,
      ic_hs_b3: getConfig().productName !== 'fisdom' ? ic_hs_b3_myway : ic_hs_b3_fisdom,
      ic_hs_b4: getConfig().productName !== 'fisdom' ? ic_hs_b4_myway : ic_hs_b4_fisdom,
      ic_hs_b5: getConfig().productName !== 'fisdom' ? ic_hs_b5_myway : ic_hs_b5_fisdom,
      ic_pa_b1: getConfig().productName !== 'fisdom' ? ic_pa_b1_myway : ic_pa_b1_fisdom
    }
  }

  componentWillMount() {

    let { params } = this.props.location;
    this.setState({
      premium_details: params ? params.premium_details : {}
    })

    var product_benefits = [
      {
        'disc': 'No limit on hospital room rent, physician charges',
        'key' : 'room_rent',
        'icon': this.state.ic_hs_b1
      },
      {
        'disc': '60 days pre  & 180 days post hospitalisation cover',
        'key' : 'hospitalisation_cover',
        'icon': this.state.ic_hs_b2
      },
      {
        'disc': 'Road as well as air ambulance allowances',
        'key' : 'ambulance_allowances',
        'icon': this.state.ic_hs_b3
      },
      {
        'disc': '10% sum insured bonus every claim-free year',
        'key' : 'sum_insured',
        'icon': this.state.ic_hs_b4
      },
      {
        'disc': '586 day care procedures and treatments covered',
        'key' : 'daycare',
        'icon': this.state.ic_hs_b5
      },
      {
        'disc': 'Option to cover individual and entire family',
        'key' : 'enitre_family',
        'icon': this.state.ic_pa_b1
      }
    ]

    var plan_data = {
      'product_name': 'Health suraksha',
      'product_tag_line': 'Covers medical expenses and ensures quality medical treatment at the time of need',
      'key': 'HEALTH_SURAKSHA',
      'logo': '',
      'premium_details': [
        {
          "sum_assured": 7500000,
          "product_benefits_included": ['room_rent', 'hospitalisation_cover', 'ambulance_allowances', 'sum_insured', 'daycare', 'enitre_family'],
          "premium": "1061",
          "tax_amount": "",
          "plus_benefit": 'Cover amount upto ₹75,00,000',
          'product_plan': 'platinum',
          'plan_frequency': 'month',
          "product_plan_title": "Platinum"
        },
        {
          "sum_assured": 1500000,
          "product_benefits_included": ['room_rent', 'hospitalisation_cover', 'ambulance_allowances', 'sum_insured', 'daycare', 'enitre_family'],
          "premium": "669",
          "tax_amount": "",
          "plus_benefit": 'Cover amount upto ₹15,00,000',
          'product_plan': 'gold',
          'plan_frequency': 'month',
          "product_plan_title": "Gold"
        },
        {
          "sum_assured": 500000,
          "product_benefits_included": ['room_rent', 'hospitalisation_cover', 'ambulance_allowances', 'sum_insured', 'daycare', 'enitre_family'],
          "premium": "446",
          "tax_amount": "",
          "plus_benefit": 'Cover amount upto ₹5,00,000',
          'product_plan': 'silver',
          'plan_frequency': 'month',
          "product_plan_title": "Silver",
        }
      ]
    }

    plan_data.premium_details.forEach(function (premium, index) {

      plan_data.premium_details[index].product_benefits = []
      product_benefits.forEach(function (benefit, index2) {
       
        let benefit_data = {};
        benefit_data = Object.assign(benefit_data, benefit);

        if(index === 2 && benefit_data.key === 'ambulance_allowances') {
          benefit_data.disc = 'Road ambulance allowances';
        }

        if(index === 0 && benefit_data.key === 'sum_insured') {
          benefit_data.disc = '25% sum insured bonus every claim-free year';
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

export default HealthSuraksha;