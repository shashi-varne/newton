import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import failed from 'assets/error_illustration.svg';

class PaymentFailed extends Component {
  render() {
    return (
      <Container
        fullWidthButton={true}
        buttonTitle='Retry Payment'
        onlyButton={true}
        title="Paymnet Failed"
        classOverRideContainer="payment-failed"
      >
        <div>
          <div className="payment-failed-icon"><img src={failed} alt="" /></div>
          <div className="payment-failed-title">Payment Failed!</div>
          <div className="payment-failed-subtitle">Seems like an internal issue. Don’t worry we are on to it, please retry after sometime.</div>
        </div>
      </Container>
    );
  }
}

export default PaymentFailed;