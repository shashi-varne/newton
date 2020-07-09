import React, { Component } from 'react';
import EmailTemplate from '../mini-components/email_template';
import { nativeCallback } from 'utils/native_callback';
import { navigate } from '../common/commonFunctions';

class EmailExampleView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigate = navigate.bind(this);
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'portfolio_tracker',
      "properties": {
        "user_action": user_action,
        "screen_name": 'cas email ',
      }
    };

    if (['just_set_events'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  goBack = () => {
    const params = this.props.location.params || {};

    this.sendEvents('back');
    this.navigate(`statement_request/${params.email}`, params);
  }

  render() {
    const subtitleText = (<span>Please ensure that the correct email is forwarded to <span id="cas-email-highlight">cas@fisdom.com</span></span>);
    return (
      <EmailTemplate
        title="How to find the CAS email?"
        subtitle={subtitleText}
        handleClick={this.goBack}
        buttonTitle="Okay"
        events={this.sendEvents('just_set_events')}
        goBack={this.goBack}
      >
      </EmailTemplate>
    );
  }
}

export default EmailExampleView;