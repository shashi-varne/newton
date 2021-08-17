import React, { Component } from 'react';
import BasicDetails from '../../ui_components/general_insurance/basic_details';

class AccidentForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      product_key: 'PERSONAL_ACCIDENT'
    }
  }

  render() {
    return (
      <BasicDetails
        parent={this}
      />
    );
  }
}

export default AccidentForm;