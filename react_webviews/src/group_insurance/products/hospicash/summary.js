import React, { Component } from 'react';
import { Fragment } from 'react';
import PlanSummary from '../../ui_components/general_insurance/plan_summary';

class HospicashSummary extends Component {

  constructor(props) {
    super(props);
    this.state = {
     'product_key' : 'HOSPICASH'
    }
  }

  render() {
    return (
      <Fragment>
        <PlanSummary
          parent={this}
        />
      </Fragment>
    );
  }
}

export default HospicashSummary;