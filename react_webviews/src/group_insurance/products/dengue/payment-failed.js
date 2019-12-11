import React, { Component } from 'react';
import PaymentFailed from '../../ui_components/general_insurance/payment_failed';

class DengueFailed extends Component {

  constructor(props) {
    super(props);
    this.state = {
      product_key: 'DENGUE'
    }
  }

  render() {
    return (
      <div>
        <PaymentFailed
          parent={this}
        />
      </div>
    );
  }
}

export default DengueFailed;