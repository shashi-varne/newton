import React, { Component } from 'react';
import PaymentSuccess from '../../ui_components/general_insurance/payment_success';

class DenguePaymentSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product_key: 'DENGUE',
      headerTitle: 'Dengue insurance'
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

export default DenguePaymentSuccess;