import React, { Component } from 'react';
import PaymentSuccess from '../../ui_components/general_insurance/payment_success';

class CoronaPaymentSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product_key: 'CORONA',
      headerTitle: 'Coronavirus insurance'
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

export default CoronaPaymentSuccess;