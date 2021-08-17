import React, { Component } from 'react';
import BasicDetails from '../../ui_components/general_insurance/basic_details';

class CoronaForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      product_key: 'CORONA'
    }
  }

  render() { 
    return (
      <div>
        <BasicDetails
          parent={this}
        />
      </div>
    );
  }
}

export default CoronaForm;