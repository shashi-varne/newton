import React, { Component } from 'react';
import EmailTemplate from '../mini-components/email_template';
import { nativeCallback } from 'utils/native_callback';
import { navigate } from '../common/commonFunctions';
import { storageService } from '../../utils/validators';
import Container from '../common/Container';

class EmailExampleView extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.location.params || {};
    this.state = {};
    this.navigate = navigate.bind(this);
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'portfolio_tracker',
      "properties": {
        user_action: user_action,
        screen_name: 'cas email',
        source: this.params.statementSource,
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
    const params = this.params;

    this.sendEvents('back');
    if (params.comingFrom === 'statement_request') {
      this.navigate(
        `statement_request/${params.email}`,
        Object.assign(params, { comingFrom: 'email_example_view' })
      );
    } else {
      this.props.history.goBack();
    }
  }

  render() {
    return (
      <Container
        headerData={{
          goBack: this.props.goBack
        }}
        title="Email looks like this"
        handleClick={this.goBack}
        buttonTitle="Okay"
        events={this.sendEvents('just_set_events')}
        goBack={this.goBack}
      >
        <EmailTemplate
          statementSource={this.params.statementSource}
        />
      </Container>
    );
  }
}

export default EmailExampleView;