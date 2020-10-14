import React, { Component } from 'react';
import PaymentCallback from '../../ui_components/general_insurance/payment_callback';

class AccidentPaymentCallback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product_key: 'DENGUE'
    }
  }

  render() {
    return (
      <div>
        <PaymentCallback
          parent={this}
        />
      </div>
    );
  }
}

export default AccidentPaymentCallback;