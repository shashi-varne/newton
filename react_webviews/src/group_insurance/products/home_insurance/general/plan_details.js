import React, { Component } from 'react';
import PlanDetails from '../../../ui_components/general_insurance/plan_details';

import { getConfig } from 'utils/functions';

import ic_hi_b1_fisdom from 'assets/ic_hi_b1_fisdom.svg';
import ic_hi_b1_myway from 'assets/ic_hi_b1_myway.svg';

import ic_hi_b2_fisdom from 'assets/ic_hi_b2_fisdom.svg';
import ic_hi_b2_myway from 'assets/ic_hi_b2_myway.svg';

import ic_hi_b3_fisdom from 'assets/ic_hi_b3_fisdom.svg';
import ic_hi_b3_myway from 'assets/ic_hi_b3_myway.svg';

import ic_hi_b4_fisdom from 'assets/ic_hi_b4_fisdom.svg';
import ic_hi_b4_myway from 'assets/ic_hi_b4_myway.svg';

import ic_hi_b5_fisdom from 'assets/ic_hi_b5_fisdom.svg';
import ic_hi_b5_myway from 'assets/ic_hi_b5_myway.svg';

import ic_hi_b6_fisdom from 'assets/ic_hi_b6_fisdom.svg';
import ic_hi_b6_myway from 'assets/ic_hi_b6_myway.svg';

class HomeInsurance extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      checked: false,
      // show_loader:true,
      skelton: true,
      plan_data: {},
      recommendedIndex: 0,
      product_key: 'HOME_INSURANCE',
      provider: 'hdfcergo',
      integeration_type: 'redirection',
      type: getConfig().productName,
      ic_hi_b1: getConfig().productName !== 'fisdom' ? ic_hi_b1_myway : ic_hi_b1_fisdom,
      ic_hi_b2: getConfig().productName !== 'fisdom' ? ic_hi_b2_myway : ic_hi_b2_fisdom,
      ic_hi_b3: getConfig().productName !== 'fisdom' ? ic_hi_b3_myway : ic_hi_b3_fisdom,
      ic_hi_b4: getConfig().productName !== 'fisdom' ? ic_hi_b4_myway : ic_hi_b4_fisdom,
      ic_hi_b5: getConfig().productName !== 'fisdom' ? ic_hi_b5_myway : ic_hi_b5_fisdom,
      ic_hi_b6: getConfig().productName !== 'fisdom' ? ic_hi_b6_myway : ic_hi_b6_fisdom
    }
  }

  componentWillMount() {

    let { params } = this.props.location;
    this.setState({
      premium_details: params ? params.premium_details : {}
    })

    var product_benefits = [
      {
        'disc': 'Coverage for structural damage against natural, man-made events',
        'key' : 'structural_damage',
        'icon': this.state.ic_hi_b1
      },
      {
        'disc': 'Long tenure options upto 5 years ',
        'key' : 'long_tenure',
        'icon': this.state.ic_hi_b2
      },
      {
        'disc': 'Emergency shifting expenses and brokerage covered',
        'key' : 'shifting_expenses',
        'icon': this.state.ic_hi_b3
      }
    ]

    var product_benefits2 = [
      {
        'disc': 'Coverage against theft and burglary',
        'key' : 'theft_burglary',
        'icon': this.state.ic_hi_b4
      },
      {
        'disc': 'Cover for silverware, jewellery, art, antiques',
        'key' : 'cover_jewellery',
        'icon': this.state.ic_hi_b5
      },
      {
        'disc': 'Break down of electonics and home appliances included',
        'key' : 'electonics_homeappliances',
        'icon': this.state.ic_hi_b6
      }
    ]

    var plan_data = {
      'product_name': 'Home insurance',
      'product_tag_line': 'Unique umbrella policy for your home and valuable contents',
      'key': 'HOME_INSURANCE',
      'logo': '',
      'premium_details': [
        {
          "sum_assured": '',
          "product_benefits_title": 'Benefits under structure',
          "product_benefits_included": ['structural_damage', 'long_tenure', 'shifting_expenses'],
          "product_benefits_title2": 'Benefits under content',
          "product_benefits2": product_benefits2,
          "product_benefits": product_benefits,
          "premium": "328",
          "tax_amount": "",
          "plus_benefit": 'Structure & content',
          'card_top_info' : 'up to 45% discount',
          'cover_text': 'Cover for',
          'plan_title': 'Owner',
          'product_plan': 'plan1'
        },
        {
          "sum_assured": '',
          "product_benefits_title": 'Benefits under content',
          "product_benefits_included": ['structural_damage', 'long_tenure', 'shifting_expenses'],
          "premium": "182",
          "product_benefits": product_benefits2,
          "tax_amount": "",
          "plus_benefit": 'Content',
          'card_top_info' : 'up to 45% discount',
          'cover_text': 'Cover for',
          'plan_title': 'Tenant',
          'product_plan': 'plan2'
        }
      ]
    }

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

export default HomeInsurance;