import React, { Component } from 'react';
import BasicDetails from '../../ui_components/general_insurance/basic_details';

class DengueForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      product_key: 'DENGUE'
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

export default DengueForm;