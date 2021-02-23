import React, { Component } from 'react';
// import Container from '../common/Container';
import '../common/Style.css';
import failed_fisdom from 'assets/error_illustration_fisdom.svg';
import failed_myway from 'assets/error_illustration_myway.svg';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import ils_error from 'assets/finity/ils_error.svg'
import {Imgc} from '../../common/ui/Imgc';


class PaymentFailedClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      failed_icon: getConfig().productName !== 'fisdom' ? failed_myway : failed_fisdom,
      iframe: true,
      iframeIcon: ils_error
    };
  } 

  handleClick = () => {
    this.sendEvents('retry');
    this.navigate('/e-mandate');
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'e-mandate',
      "properties": {
        "user_action": user_action,
        "screen_name": 'auth_failed'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  loadComponent() {
    if (this.state.iframe) {
      return require(`../commoniFrame/Container`).default;
    } else {
      return require(`../common/Container`).default;
    }
  }

  render() {
    const Container = this.loadComponent();
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        fullWidthButton={true}
        buttonTitle='RETRY'
        onlyButton={true}
        showLoader={this.state.show_loader}
        handleClick={() => this.handleClick()}
        title="Authorisation failed"
        disableBack={true}
        classOverRideContainer="payment-failed"
        img={this.state.iframeIcon}
      >
        <div>
          {!this.state.iframe && <div className="payment-failed-icon">
            <Imgc src={this.state.failed_icon} alt="" 
              style={{minHeight:160, width:"100%"}} 
            />
          </div>}
          <div className="payment-failed-title">e-mandate authorization failed</div>
          <div className="payment-failed-subtitle">Something went wrong, please retry with correct details</div>
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