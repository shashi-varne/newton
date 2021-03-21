import React, { Component } from 'react';
import { Fragment } from 'react';
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
      <Fragment>
        <PaymentSuccess
          parent= {this}
        />
      </Fragment>
    );
  }
}

export default SmartwalletPaymentSuccess;