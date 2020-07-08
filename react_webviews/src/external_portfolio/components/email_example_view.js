import React, { Component } from 'react';
import EmailTemplate from '../mini-components/email_template';
import { nativeCallback } from 'utils/native_callback';

class EmailExampleView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    this.sendEvents('back');
    this.props.history.goBack();
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