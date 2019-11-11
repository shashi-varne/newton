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
        <div style={{  }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}><img src={failed} alt="" /></div>
          <div style={{ color: '#160d2e', fontSize: '14px', fontWeight: '700', marginBottom: '20px', textAlign: 'center' }}>Payment Failed!</div>
          <div style={{ color: '#878787', fontSize: '14px', lineHeight: '22px' }}>Seems like an internal issue. Don’t worry we are on to it, please retry after sometime.</div>
        </div>
      </Container>
    );
  }
}

export default PaymentFailed;