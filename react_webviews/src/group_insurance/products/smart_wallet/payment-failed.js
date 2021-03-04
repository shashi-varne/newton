import React, { Component } from 'react';
import { Fragment } from 'react';
import PaymentFailed from '../../ui_components/general_insurance/payment_failed';

class SmartwalletFailed extends Component {

  constructor(props) {
    super(props);
    this.state = {
      product_key: 'SMART_WALLET'
    }
  }

  render() {
    return (
      <Fragment>
        <PaymentFailed
          parent={this}
        />
      </Fragment>
    );
  }
}

export default SmartwalletFailed;