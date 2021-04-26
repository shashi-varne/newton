import React, { Component } from 'react';
import EmailTemplate from '../mini-components/email_template';
import { nativeCallback } from 'utils/native_callback';
import { navigate } from '../common/commonFunctions';
import { getConfig } from '../../utils/functions';
import { storageService } from '../../utils/validators';
const emailDomain = getConfig().emailDomain;

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
        performed_by: storageService().get('hni-platform') === 'rmapp' ? 'RM' : 'user',
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
    if (params.comingFrom === 'statement_request') {
      this.navigate(
        `statement_request/${params.email}`,
        Object.assign(params, { comingFrom: 'email_example_view'})
      );
    } else {
      this.props.history.goBack();
    }
  }

  render() {
    const subtitleText = (<span>Please ensure that the correct email is forwarded to <span id="cas-email-highlight">cas@{emailDomain}</span></span>);
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