import React, { Component } from 'react';
import PaymentSuccess from '../../ui_components/general_insurance/payment_success';

class AccidentPaymentSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product_key: 'PERSONAL_ACCIDENT',
      headerTitle: 'Personal accident insurance'
    }
  }

  render() {
    return (
      <div>
        <PaymentSuccess
          parent={this}
        />
      </div>
    );
  }
}

export default AccidentPaymentSuccess;