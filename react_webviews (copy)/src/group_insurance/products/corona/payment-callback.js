import React, { Component } from 'react';
import PaymentCallback from '../../ui_components/general_insurance/payment_callback';

class CoronaPaymentCallback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product_key: 'CORONA'
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

export default CoronaPaymentCallback;