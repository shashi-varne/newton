import React, { Component } from 'react';
import { Fragment } from 'react';
import BasicDetails from '../../ui_components/general_insurance/basic_details';

class HospicashForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
        product_key: 'HOSPICASH'
    }
  }

  render() {
    return (
      <Fragment>
        <BasicDetails
          parent={this}
        />
      </Fragment>
    );
  }
}

export default HospicashForm;