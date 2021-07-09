import React, { Component } from 'react';
import Container from '../../common/Container';
import qs from 'qs';
import sip_resumed_fisdom from 'assets/sip_resumed_illustration_fisdom.svg';
import sip_resumed_myway from 'assets/finity/sip_resumed_illustration_myway.svg';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import ContactUs from '../../../common/components/contact_us';

class MandateSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1)),
      sip_resumed: getConfig().productName !== 'fisdom' ? sip_resumed_myway : sip_resumed_fisdom
    }
  }

  handleClick = () => {
    this.sendEvents('ok');
    nativeCallback({ action: 'exit' });
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'session_less_campaigns',
      "properties": {
        "user_action": user_action,
        "mandate_type": 'biller',
        "screen_name": 'auth_success'
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
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
        fullWidthButton={true}
        onlyButton={true}
        disableBack={true}
        buttonTitle="DONE"
      >
        <div>
            <div className="main-top-title-new">Authorisation successful!</div>
          <div className="success-img">
            <img alt="Mandate" src={this.state.sip_resumed} width="100%" />
          </div>
          <div className="success-text">
          Congrats! easySIP activated
          </div>
          <div className="success-text-info">
          Your next SIP payment will get auto debited from your account.
          </div>

          <ContactUs />
        </div>
      </Container >
    );
  }
}


export default MandateSuccess;
