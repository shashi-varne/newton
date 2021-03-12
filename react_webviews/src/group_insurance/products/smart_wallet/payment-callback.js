import React, { Component } from 'react';
import { Fragment } from 'react';
import PaymentCallback from '../../ui_components/general_insurance/payment_callback';

class AccidentPaymentCallback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product_key: 'SMART_WALLET'
    }
  }

  render() {
    return (
      <Fragment>
        <PaymentCallback
          parent={this}
        />
      </Fragment>
    );
  }
}

export default AccidentPaymentCallback;