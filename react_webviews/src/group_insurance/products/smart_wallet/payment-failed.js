import React, { Component } from 'react';
import PaymentFailed from '../../ui_components/general_insurance/payment_failed';

class SmartwalletFailed extends Component {
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

export default SmartwalletFailed;