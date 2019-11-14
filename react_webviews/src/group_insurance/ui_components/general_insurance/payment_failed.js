import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import failed from 'assets/error_illustration.svg';
import { getConfig } from 'utils/functions';

class PaymentFailedClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: false
    };
  }

  handleClick = () => {
    this.setState({
      show_loader: true
    })
    let pgLink = window.localStorage.getItem('group_insurance_payment_url');
    if (pgLink) {
      window.location.href = pgLink;
    } else {
      this.navigate('/group-insurance');
    }
  }

  navigate = (pathname) => {
    this.props.parent.props.history.push({
        pathname: pathname,
        search: getConfig().searchParams,
        params: {
            disableBack: true
        }
    });
}

  render() {
    return (
      <Container
        fullWidthButton={true}
        buttonTitle='Retry Payment'
        onlyButton={true}
        showLoader={this.state.show_loader}
        handleClick={() => this.handleClick()}
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

const PaymentFailed = (props) => (
  <PaymentFailedClass
    {...props} />
);

export default PaymentFailed;