import React, { Component } from 'react';
import PlanSummary from '../../ui_components/general_insurance/plan_summary';

class SmartwalletSummary extends Component {

  constructor(props) {
    super(props);
    this.state = {
     'product_key' : 'SMART_WALLET'
    }
  }

  render() {
    return (
      <div>
        <PlanSummary
          parent={this}
        />
      </div>
    );
  }
}

export default SmartwalletSummary;