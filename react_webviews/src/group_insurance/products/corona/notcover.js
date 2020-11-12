import React, { Component } from 'react';
import RenderDiseasesComponent from '../../ui_components/general_insurance/notcover';

import { getConfig } from 'utils/functions';

import bacteria_fisdom from '../../../assets/fisdom/bacteria_fisdom.svg';
import ic_c_e1_fisdom from 'assets/icn_icmr_covid_fisdom.svg';
import ic_c_e2_fisdom from 'assets/icn_old_age_covid_fisdom.svg';
import ic_c_e3_fisdom from 'assets/icn_infection_covid_fisdom.svg'; 
import icn_quarantine_fisdom from '../../../assets/fisdom/icn_quarantine_fisdom.svg';
import inc_outside_india_fisdom from '../../../assets/fisdom/inc_outside_india_fisdom.svg'
import icn_travel_covid_fisdom from  '../../../assets/fisdom/icn_travel_covid_fisdom.svg'
import inc_infected_fisdom from '../../../assets/fisdom/inc_infected_fisdom.svg';


import ic_c_e1_myway from 'assets/icn_icmr_covid_myway.svg';
import ic_c_e2_myway from 'assets/icn_old_age_covid_myway.svg';
import ic_c_e3_myway from 'assets/icn_infection_covid_myway.svg';
import bacteria_myway from '../../../assets/myway/bacteria_myway.svg'
import inc_outside_india_myway from '../../../assets/myway/inc_outside_india_myway.svg'
import icn_travel_covid_myway from '../../../assets/myway/inc_travel_covid.svg'
import inc_infected_myway from '../../../assets/myway/inc_infected_myway.svg'
import icn_quarantine_myway from '../../../assets/myway/inc_quarantine_myway.svg';

class NotCoverpage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      checked: false,
      title : "What's not covered",
      plan_data: {},
      recommendedIndex: 0,
      product_key: 'CORONA',
      type: getConfig().productName,
      inc_outside_india: getConfig().productName !== 'fisdom' ? inc_outside_india_myway : inc_outside_india_fisdom,
      inc_infected : getConfig().productName !== 'fisdom' ? inc_infected_myway : inc_infected_fisdom,
      icn_travel_covid: getConfig().productName !== 'fisdom' ? icn_travel_covid_myway : icn_travel_covid_fisdom,
      bacteria: getConfig().productName !== 'fisdom' ? bacteria_myway : bacteria_fisdom,
      ic_c_e1: getConfig().productName !== 'fisdom' ? ic_c_e1_myway : ic_c_e1_fisdom,
      ic_c_e2: getConfig().productName !== 'fisdom' ? ic_c_e2_myway : ic_c_e2_fisdom,
      ic_c_e3: getConfig().productName !== 'fisdom' ? ic_c_e3_myway : ic_c_e3_fisdom,
      icn_quarantine: getConfig().productName !== 'fisdom' ? icn_quarantine_myway : icn_quarantine_fisdom,
    }
  }

  componentWillMount() {
    const countries = (
      <div>
      <p>If the insured has traveled to or from the following places since 31st December 2019</p>
      <ul  style={{  padding: "15px", fontWeight: "normal"}} >
        <li>China</li>
        <li>Japan</li>
        <li>Singapore</li>
        <li>Hong Kong</li>
        <li>South Korea</li>
        <li>Thailand</li>
        <li>Malaysia</li>
        <li>Macau</li>
        <li>Taiwan</li>
        <li>Italy</li>
        <li>Iran</li> </ul>
      </div>
    );

  let plan_data = [
    {
      icon : this.state.ic_c_e3,
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
        icon : this.state.icn_quarantine,
        text : "Any signs or symptoms of the infection present at the time of purchasing the policy"
      },
      {
        icon : this.state.inc_infected,
        text : "The person suffering from the infection or taking treatment or recommended for quarantine at the time of purchasing the policy"
      },
      {
        icon : this.state.bacteria,
        text : "Manifestation of the Coronavirus Infection taken place while the Insured is outside India"
      }, 
      {
        icon : this.state.inc_outside_india,
        text : "Treatment taken outside India"
      },
      {
        icon : this.state.icn_travel_covid,
        text :  countries
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

export default NotCoverpage;