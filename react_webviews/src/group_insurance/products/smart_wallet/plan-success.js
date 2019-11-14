import React, { Component } from 'react';
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
      <div>
        <PlanSuccess
          parent={this}
        />
      </div>
    );
  }
}

export default SmartwalletPlanSuccess;