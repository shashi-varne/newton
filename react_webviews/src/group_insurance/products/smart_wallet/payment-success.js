import React, { Component } from 'react';
import PaymentSuccess from '../../ui_components/general_insurance/payment_success';

class SmartwalletPaymentSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
        product_key: 'SMART_WALLET',
        headerTitle: 'Smart wallet insurance'
    }
  }
  
  render() {
    return (
      <div>
        <PaymentSuccess
          parent= {this}
        />
      </div>
    );
  }
}

export default SmartwalletPaymentSuccess;