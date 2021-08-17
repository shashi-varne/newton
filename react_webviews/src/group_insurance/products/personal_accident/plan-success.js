import React, { Component } from 'react';
import { Fragment } from 'react';
import PlanSuccess from '../../ui_components/general_insurance/plan_success';

class AccidentPlanSuccess extends Component {

  constructor(props) {
    super(props);
    this.state = {
      product_key: 'PERSONAL_ACCIDENT'
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

export default AccidentPlanSuccess;