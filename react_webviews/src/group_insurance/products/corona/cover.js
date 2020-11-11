import React, { Component } from 'react';
import RenderDiseasesComponent from '../../ui_components/general_insurance/cover';

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


class Coverpage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      title : "What's covered",
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
      ic_c_e5: getConfig().productName !== 'fisdom' ? ic_c_e5_myway : ic_c_e5_fisdom
    }
  }

  componentWillMount() {

  let plan_data = [
      {
        icon : this.state.ic_c_b1,
        text : "inpatient Hospitalization"
      },
      {
      icon : this.state.ic_c_b2,
      text : "inpatient Hospitalization",
      },
      {
        icon : this.state.ic_c_b3,
        text : "inpatient Hospitalization"
      },
      {
        icon : this.state.ic_c_11,
        text : "inpatient Hospitalization"
      },
      {
      icon : this.state.ic_c_c2,
      text : "inpatient Hospitalization",
      },
      {
        icon : this.state.ic_c_c3,
        text : "inpatient Hospitalization"
      },
      {
        icon : this.state.ic_c_w1,
        text : "inpatient Hospitalization"
      },
      {
      icon : this.state.ic_c_d2,
      text : "inpatient Hospitalization",
      },
      {
        icon : this.state.ic_c_e1,
        text : "inpatient Hospitalization"
      },
      {
        icon : this.state.ic_c_e2,
        text : "inpatient Hospitalization"
      },
      {
      icon : this.state.ic_c_e3,
      text : "inpatient Hospitalization",
      },
      {
        icon : this.state.ic_c_e4,
        text : "inpatient Hospitalization"
      }
  ]
   
      


  this.setState({
    plan_data: plan_data
  })
}

  render() {
    return (
      <div>
        <RenderDiseasesComponent
          parent={this}
        />
      </div>
    );
  }
}

export default Coverpage;