import React, { Component } from 'react';
import PlanSuccess from '../../ui_components/general_insurance/plan_success';

class AccidentPlanSuccess extends Component {

  constructor(props) {
    super(props);
    this.state = {
      product_key : 'PERSONAL_ACCIDENT'
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

export default AccidentPlanSuccess;