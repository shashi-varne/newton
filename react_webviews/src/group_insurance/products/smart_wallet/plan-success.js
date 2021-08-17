import React, { Component } from 'react';
import { Fragment } from 'react';
import PlanSuccess from '../../ui_components/general_insurance/plan_success';

class SmartwalletPlanSuccess extends Component {

  constructor(props) {
    super(props);
    this.state = {
      product_key : 'SMART_WALLET'
    };

  }

  render() {
    return (
      <Fragment>
        <PlanSuccess
          parent={this}
        />
      </Fragment>
    );
  }
}

export default SmartwalletPlanSuccess;