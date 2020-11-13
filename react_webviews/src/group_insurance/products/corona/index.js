import React, { Component } from 'react';
import PlanDetails from '../../ui_components/general_insurance/plan_details';

import { getConfig } from 'utils/functions';

import ic_c_b1_fisdom from 'assets/ic_covid_b_1_fisdom.svg';
import ic_c_b2_fisdom from 'assets/ic_covid_b_2_fisdom.svg';
import ic_c_b3_fisdom from 'assets/ic_covid_b_3_fisdom.svg';
import ic_c_c1_fisdom from 'assets/ic_whats_covered_fisdom.svg';
import ic_c_c2_fisdom from 'assets/ic_whats_not_covered_fisdom.svg';
import ic_c_c3_fisdom from 'assets/ic_how_to_claim_fisdom.svg';
import ic_c_w1_fisdom from 'assets/ic_covid_waiting_period_fisdom.svg';
import ic_c_d1_fisdom from 'assets/icn_quarantined_covid_fisdom.svg';
import ic_c_d2_fisdom from 'assets/icn_all_expenses_covid_fisdom.svg';
import ic_c_e1_fisdom from 'assets/icn_icmr_covid_fisdom.svg';
import ic_c_e2_fisdom from 'assets/icn_old_age_covid_fisdom.svg';
import ic_c_e3_fisdom from 'assets/icn_infection_covid_fisdom.svg';
import ic_c_e4_fisdom from 'assets/icn_outside_india_fisdom.svg';
import ic_c_e5_fisdom from 'assets/icn_travel_covid_fisdom.svg';
import icn_ongoingcovid_fisdom from '../../../assets/fisdom/icn_ongoingcovid_fisdom.svg';
import bed_corona_fisdom from '../../../assets/fisdom/bed_corona_fisdom.svg';
import people_sitting_fisdom from '../../../assets/fisdom/people_sitting_fisdom.svg';
import singlebed_fisdom from '../../../assets/fisdom/singlebed_fisdom.svg';
import inc_outside_india_fisdom from '../../../assets/fisdom/inc_outside_india_fisdom.svg';
import bacteria_fisdom from '../../../assets/fisdom/bacteria_fisdom.svg';
import inc_infected_fisdom from '../../../assets/fisdom/inc_infected_fisdom.svg';


import singlebed_myway from '../../../assets/myway/singlebed_myway.svg'
import bed_corona_myway from '../../../assets/myway/bed_corona_myway.svg'
import people_sitting_myway  from '../../../assets/myway/people_sitting_myway.svg'
import icn_ongoingcovid_myway from '../../../assets/myway/icn_ongoingcovid_myway.svg'
import ic_c_b1_myway from 'assets/ic_covid_b_1_myway.svg';
import ic_c_b2_myway from 'assets/ic_covid_b_2_myway.svg';
import ic_c_b3_myway from 'assets/ic_covid_b_3_myway.svg';
import ic_c_c1_myway from 'assets/ic_whats_covered_myway.svg';
import ic_c_c2_myway from 'assets/ic_whats_not_covered_myway.svg';
import ic_c_c3_myway from 'assets/ic_how_to_claim_myway.svg';
import ic_c_w1_myway from 'assets/ic_covid_waiting_period_myway.svg';
import ic_c_d1_myway from 'assets/icn_quarantined_covid_myway.svg';
import ic_c_d2_myway from 'assets/icn_all_expenses_covid_myway.svg';
import ic_c_e1_myway from 'assets/icn_icmr_covid_myway.svg';
import ic_c_e2_myway from 'assets/icn_old_age_covid_myway.svg';
import ic_c_e3_myway from 'assets/icn_infection_covid_myway.svg';
import ic_c_e4_myway from 'assets/icn_outside_india_myway.svg';
import ic_c_e5_myway from 'assets/icn_travel_covid_myway.svg';
import inc_outside_india_myway from '../../../assets/myway/inc_outside_india_myway.svg';
import bacteria_myway from '../../../assets/myway/bacteria_myway.svg'
import inc_infected_myway from '../../../assets/myway/inc_infected_myway.svg'


class CoronaPlanDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      checked: false,
      plan_data: {},
      recommendedIndex: 0,
      product_key: 'CORONA',
      type: getConfig().productName,
      ic_c_b1: getConfig().productName !== 'fisdom' ? ic_c_b1_myway : ic_c_b1_fisdom,
      ic_c_b2: getConfig().productName !== 'fisdom' ? ic_c_b2_myway : ic_c_b2_fisdom,
      ic_c_b3: getConfig().productName !== 'fisdom' ? ic_c_b3_myway : ic_c_b3_fisdom,
      ic_c_c1: getConfig().productName !== 'fisdom' ? ic_c_c1_myway : ic_c_c1_fisdom,
      ic_c_c2: getConfig().productName !== 'fisdom' ? ic_c_c2_myway : ic_c_c2_fisdom,
      ic_c_c3: getConfig().productName !== 'fisdom' ? ic_c_c3_myway : ic_c_c3_fisdom,
      ic_c_w1: getConfig().productName !== 'fisdom' ? ic_c_w1_myway : ic_c_w1_fisdom,
      ic_c_d1: getConfig().productName !== 'fisdom' ? ic_c_d1_myway : ic_c_d1_fisdom,
      ic_c_d2: getConfig().productName !== 'fisdom' ? ic_c_d2_myway : ic_c_d2_fisdom,
      ic_c_e1: getConfig().productName !== 'fisdom' ? ic_c_e1_myway : ic_c_e1_fisdom,
      ic_c_e2: getConfig().productName !== 'fisdom' ? ic_c_e2_myway : ic_c_e2_fisdom,
      ic_c_e3: getConfig().productName !== 'fisdom' ? ic_c_e3_myway : ic_c_e3_fisdom,
      ic_c_e4: getConfig().productName !== 'fisdom' ? ic_c_e4_myway : ic_c_e4_fisdom,
      ic_c_e5: getConfig().productName !== 'fisdom' ? ic_c_e5_myway : ic_c_e5_fisdom,
      icn_ongoingcovid_fisdom: getConfig().productName !== 'fisdom' ? icn_ongoingcovid_myway : icn_ongoingcovid_fisdom,
      bed_corona_fisdom: getConfig().productName !== 'fisdom' ? bed_corona_myway : bed_corona_fisdom,
      singlebed: getConfig().productName !== 'fisdom' ? singlebed_myway : singlebed_fisdom,
      people_sitting: getConfig().productName !== 'fisdom' ? people_sitting_myway : people_sitting_fisdom,
      inc_outside_india: getConfig().productName !== 'fisdom' ? inc_outside_india_myway : inc_outside_india_fisdom,
      bacteria: getConfig().productName !== 'fisdom' ? bacteria_myway : bacteria_fisdom,
      inc_infected : getConfig().productName !== 'fisdom' ? inc_infected_myway : inc_infected_fisdom,

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
        'disc': "Assured lump sum payment of ₹ sum_assured_amount if tested positive for COVID-19",
        'key': 'positive',
        'icon': this.state.ic_c_b1
      },
      {
        'disc': "Get ₹ quarantined_amount if quarantined in a government /military facility for at least 14 days",
        'key': 'quarantined',
        'icon': this.state.ic_c_b2
      },
      {
        'disc': "No exclusions for existing diseases. Insured will get sum assured for COVID-19 infection",
        'key': 'exclusions',
        'icon': this.state.ic_c_b3
      }
    ]

    var waiting_period = [
      {
        'disc': "Policy will be effective after 15 days from date of purchase",
        'key': 'waiting',
        'icon': this.state.ic_c_w1
      }
    ]

    var product_diseases_covered = [
      {
        "icon" : this.state.singlebed,
        "text" : "inpatient Hospitalization"
      },
      {
      "icon" : this.state.bed_corona_fisdom,
      "text" : "Pre-Post Hospitalization (30/60 Days)",
      },
      {
        "icon" : this.state.icn_ongoingcovid_fisdom,
        "text" : "Daycare procedures Covers"
      },
      {
        "icon" : this.state.people_sitting,
        "text" : "Tele/virtual consultation till the first 90 days"
      }
    ]

    var product_diseases_not_covered = [
      {
        icon :  this.state.ic_c_e3,
        text : "Individual having any underlying health conditions/Pre-existing disease",
        },
        {
          icon : this.state.ic_c_e2,
          text : "Age group more than 65 years"
        },
        {
          icon : this.state.ic_c_e1,
          text : "Testing done in centers other than the authorized Indian Council of Medical Research centers"
        },
        {
          icon : this.state.ic_c_d1,
          text : "Any signs or symptoms of the infection present at the time of purchasing the policy"
        },
        {
          icon : this.state.inc_infected,
          text : "The person suffering from the infection or taking treatment or recommended for quarantine at the time of purchasing the policy"
        },
        {
          icon :  this.state.bacteria,
          text : "Manifestation of the Coronavirus Infection taken place while the Insured is outside India"
        }, 
        {
          icon : this.state.inc_outside_india,
          text : "Treatment taken outside India"
        },
         {
        'icon': this.state.ic_c_e5,
        'text': 'If the insured has travelled to or from the following places since 31st December 2019',
        'list': ['China', 'Japan', 'Singapore', 'Hong Kong', 'South Korea', 'Thailand', 'Malaysia', 'Macau', 'Taiwan', 'Italy', 'Iran']
      }
    ]


    var things_to_know = [
      {
        'disc': "What's covered",
        'key': 'is_covered',
        'icon': this.state.ic_c_c1,
        'data': product_diseases_covered
      },
      {
        'disc': "What's not covered",
        'key': 'not_covered',
        'icon': this.state.ic_c_c2,
        'data': product_diseases_not_covered
      },
      {
        'disc': "How to claim",
        'key': 'claim',
        'icon': this.state.ic_c_c3,
        'data': ''
      }
    ];

    var plan_data = {
      'product_name': 'Corona insurance',
      'product_tag_line': '',
      'key': 'CORONA',
      'logo': '',
      'premium_details': [
        // {
        //   "sum_assured": 100000,
        //   "sum_assured_text": '1 lac',
        //   "quarantined_text": '50,000',
        //   'product_tag_line': 'Guaranteed 1 lac sum assured in just ₹1799 to fight with coronavirus',
        //   "product_benefits_included": ['positive', 'quarantined', 'exclusions'],
        //   "things_to_know": things_to_know,
        //   "waiting_period": waiting_period,
        //   "premium": "1799",
        //   "tax_amount": "274"
        // },
        {
          "cover_amount": 50000,
          "sum_assured_text": '50,000',
          "quarantined_text": '25,000',
          'product_tag_line': 'Guaranteed ₹50,000 sum assured in just ₹1500 to fight with coronavirus',
          "product_benefits_included": ['positive', 'quarantined', 'exclusions'],
          "things_to_know": things_to_know,
          "waiting_period": waiting_period,
          "premium": "1271",
          "tax_amount": "229"
        },
        {
          "cover_amount": 25000,
          "sum_assured_text": '25,000',
          "quarantined_text": '12,500',
          'product_tag_line': 'Guaranteed ₹25,000 sum assured in just ₹750 to fight with coronavirus',
          "product_benefits_included": ['positive', 'quarantined', 'exclusions'],
          "things_to_know": things_to_know,
          "waiting_period": waiting_period,
          "premium": "636",
          "tax_amount": "114"
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
        benefit_data.disc = benefit_data.disc.replace('sum_assured_amount', plan_data.premium_details[index].sum_assured_text);
        benefit_data.disc = benefit_data.disc.replace('quarantined_amount', plan_data.premium_details[index].quarantined_text);

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

export default CoronaPlanDetails;