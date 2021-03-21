import React, { Component } from 'react';
import PlanDetails from '../../ui_components/general_insurance/plan_details';

import { getConfig } from 'utils/functions';

import ic_wallet_b1_fisdom from 'assets/ic_wallet_b1_fisdom.svg';
import ic_wallet_b2_fisdom from 'assets/ic_wallet_b2_fisdom.svg';
import ic_wallet_b3_fisdom from 'assets/ic_wallet_b3_fisdom.svg';
import ic_wallet_b4_fisdom from 'assets/ic_wallet_b4_fisdom.svg';

import ic_wallet_b1_myway from 'assets/ic_wallet_b1_myway.svg';
import ic_wallet_b2_myway from 'assets/ic_wallet_b2_myway.svg';
import ic_wallet_b3_myway from 'assets/ic_wallet_b3_myway.svg';

import ic_wallet_b4_myway from 'assets/ic_wallet_b4_myway.svg';
import { Fragment } from 'react';
class SmartwalletPlanDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      checked: false,
      show_loader:true,
      plan_data: {},
      recommendedIndex: 0,
      product_key: 'SMART_WALLET',
      type: getConfig().productName,
      ic_wallet_b1: getConfig().productName !== 'fisdom' ? ic_wallet_b1_myway : ic_wallet_b1_fisdom,
      ic_wallet_b2: getConfig().productName !== 'fisdom' ? ic_wallet_b2_myway : ic_wallet_b2_fisdom,
      ic_wallet_b3: getConfig().productName !== 'fisdom' ? ic_wallet_b3_myway : ic_wallet_b3_fisdom,
      ic_wallet_b4: getConfig().productName !== 'fisdom' ? ic_wallet_b4_myway : ic_wallet_b4_fisdom
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
        'disc': 'Protection against unauthorized use (transaction) of any lost or stolen Card(s)',
        'key' : 'unauthorized_protection',
        'icon': this.state.ic_wallet_b1
      },
      {
        'disc': '24x7 one call assistance to block your cards',
        'key' : 'lost_card',
        'icon': this.state.ic_wallet_b2
      },
      {
        'disc': 'Insure mobile wallets from unauthorized transactions, skimming or phishing',
        'key' : 'mobile_wallet',
        'icon': this.state.ic_wallet_b3
      },
      {
        'disc': 'Assistant services for PAN Card replacement. ',
        'key' : 'pan_replacement',
        'icon': this.state.ic_wallet_b4
      }
    ]

    var plan_data = {
      'product_name': 'Smart wallet',
      'product_tag_line': 'Protect all your bank cards and mobile wallets against fraud and misuse',
      'key': 'SMART_WALLET',
      'logo': '',
      'premium_details': [
        {
          "sum_assured": 150000,
          "product_benefits_included": ['unauthorized_protection', 'lost_card', 
          'mobile_wallet', 'pan_replacement'],
          "premium": "999",
          "tax_amount": "179.82",
          "plus_benefit": ''
        },
        {
          "sum_assured": 100000,
          "product_benefits_included": ['unauthorized_protection', 'lost_card', 
          'mobile_wallet', 'pan_replacement'],
          "premium": "500",
          "tax_amount": "90",
          "plus_benefit": ''
        },
        {
          "sum_assured": 50000,
          "product_benefits_included": ['unauthorized_protection', 'lost_card', 
          'mobile_wallet', 'pan_replacement'],
          "premium": "250",
          "tax_amount": "45",
          "plus_benefit": ''
        }
      ]
    }

    plan_data.premium_details.forEach(function (premium, index) {

      plan_data.premium_details[index].product_benefits = []
      product_benefits.forEach(function (benefit, index2) {
        let benefit_data = Object.create(benefit);
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

export default SmartwalletPlanDetails;