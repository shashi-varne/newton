import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import failed_fisdom from 'assets/ils_covid_failed_fisdom.svg';
import failed_myway from 'assets/ils_covid_failed_myway.svg';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class PaymentFailedClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      failed_icon: getConfig().productName !== 'fisdom' ? failed_myway : failed_fisdom,
    };
  }

  handleClick = () => {
    this.setState({
      show_loader: true
    })
    let pgLink = window.sessionStorage.getItem('group_insurance_payment_url');
    if (pgLink) {
      this.sendEvents('next');
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

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'payment_failure',
        "type": this.props.parent.state.product_key
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        fullWidthButton={true}
        product_key={this.props.parent ? this.props.parent.state.product_key : ''}
        buttonTitle='Retry Payment'
        onlyButton={true}
        showLoader={this.state.show_loader}
        showError={this.state.showError}
        errorData={this.state.errorData}
        handleClick={() => this.handleClick()}
        title="Payment Failed"
        classOverRideContainer="payment-failed"
      >
        <div>
          <div className="payment-failed-icon"><img src={this.state.failed_icon} alt="" /></div>
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