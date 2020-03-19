import React, { Component } from 'react';
import PlanSuccess from '../../ui_components/general_insurance/plan_success';

class CoronaPlanSuccess extends Component {

  constructor(props) {
    super(props);
    this.state = {
      product_key: 'CORONA'
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

export default CoronaPlanSuccess;