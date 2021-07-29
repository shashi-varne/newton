import React, { Component } from 'react';
import Container from '../../../common/Container';
import '../../../common/Style.css';
import failed_fisdom from 'assets/error_illustration_fisdom.svg';
import failed_myway from 'assets/finity/error_illustration_myway.svg';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class EtliAuthFailedClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      failed_icon: getConfig().productName !== 'fisdom' ? failed_myway : failed_fisdom,
    };
  }

  componentWillMount() {
    nativeCallback({ action: 'take_control_reset' });
  }

  handleClick = () => {
    this.setState({
      show_loader: true
    })
    this.sendEvents('next');
    this.navigate('/group-insurance');
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'payment_failure',
        "type": ''
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
        buttonTitle='OK'
        onlyButton={true}
        showLoader={this.state.show_loader}
        handleClick={() => this.handleClick()}
        disableBack={true}
        forceBackState="/group-insurance"
        title="Authorisation Failed"
        classOverRideContainer="payment-failed"
      >
        <div>
          <div className="payment-failed-icon"><img src={this.state.failed_icon} alt="" /></div>
          <div className="payment-failed-title">Oops something went wrong!</div>
          <div className="payment-failed-subtitle">We are looking into this issue. In case you have made the payment, Edelweiss team will contact you shortly for further assistance.</div>
        </div>
      </Container>
    );
  }
}

const EtliAuthFailed = (props) => (
  <EtliAuthFailedClass
    {...props} />
);

export default EtliAuthFailed;