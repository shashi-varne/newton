import React, { Component } from 'react';
import RenderDiseasesComponent from '../../ui_components/general_insurance/cover';

import { getConfig } from 'utils/functions';

import icn_ongoingcovid_fisdom from '../../../assets/fisdom/icn_ongoingcovid_fisdom.svg';
import bed_corona_fisdom from '../../../assets/fisdom/bed_corona_fisdom.svg';
import people_sitting_fisdom from '../../../assets/fisdom/people_sitting_fisdom.svg';
import singlebed_fisdom from '../../../assets/fisdom/singlebed_fisdom.svg';


import singlebed_myway from '../../../assets/myway/singlebed_myway.svg'
import bed_corona_myway from '../../../assets/myway/bed_corona_myway.svg'
import people_sitting_myway  from '../../../assets/myway/people_sitting_myway.svg'
import icn_ongoingcovid_myway from '../../../assets/myway/icn_ongoingcovid_myway.svg'

class Coverpage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      title : "What's covered",
      checked: false,
      productName: getConfig().productName,
      plan_data: {},
      recommendedIndex: 0,
      product_key: 'CORONA',
      icn_ongoingcovid_fisdom: getConfig().productName !== 'fisdom' ? icn_ongoingcovid_myway : icn_ongoingcovid_fisdom,
      bed_corona_fisdom: getConfig().productName !== 'fisdom' ? bed_corona_myway : bed_corona_fisdom,
      singlebed: getConfig().productName !== 'fisdom' ? singlebed_myway : singlebed_fisdom,
      people_sitting: getConfig().productName !== 'fisdom' ? people_sitting_myway : people_sitting_fisdom,
    }
  }

  componentWillMount() {

  let plan_data = [
     {
        icon : this.state.singlebed,
        text : "inpatient Hospitalization"
      },
      {
      icon : this.state.bed_corona_fisdom,
      text : "Pre-Post Hospitalization (30/60 Days)",
      },
      {
        icon : this.state.icn_ongoingcovid_fisdom,
        text : "Daycare procedures Covers"
      },
      {
        icon : this.state.people_sitting,
        text : "Tele/virtual consultation till the first 90 days"
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