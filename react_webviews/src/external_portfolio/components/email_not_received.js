import React, { Component } from 'react';
import EmailTemplate from '../mini-components/email_template';
import { navigate, setLoader } from '../common/commonFunctions';
import toast from '../../common/ui/Toast';
import { storageService } from '../../utils/validators';
import { nativeCallback } from 'utils/native_callback';
import Container from '../common/Container';
import { requestStatement } from '../common/ApiCalls';
import isEmpty from 'lodash/isEmpty';

class EmailNotReceived extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigate = navigate.bind(this);
    this.setLoader = setLoader.bind(this);
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'portfolio_tracker',
      "properties": {
        "user_action": user_action,
        "screen_name": 'cas email not received',
        performed_by: storageService().get('hni-platform') === 'rmapp' ? 'RM' : 'user',
      }
    };

    if (['just_set_events'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  goNext = async () => {
    try {
      this.setLoader('button');
      this.sendEvents('regenerate_stat');
      const email_detail = storageService().getObject('email_detail_hni');
      if (!isEmpty(email_detail)) {
        await requestStatement({ 
          email: email_detail.email,
          statement_id: email_detail.latest_statement.statement_id,
          retrigger: 'true',
        });
        this.navigate(`statement_request/${email_detail.email}`, {
          exitToApp: true,
          fromRegenerate: true,
        });
      }
    } catch (err) {
      this.setLoader(false);
      console.log(err);
      toast(err);
    }
  }

  goBack = () => {
    this.sendEvents('back');
    storageService().remove('email_detail_hni');
    this.props.history.goBack();
  }

  render() {
    const subtitleText = "It usually takes 1 hour to get the statement in your email";
    return (
      <Container
        headerData={{
          goBack: this.props.goBack
        }}
        title="Did not recieve email"
        smallTitle={subtitleText}
        imageTitle="The email looks like this"
        showLoader={this.state.show_loader}
        twoButtonVertical
        button1Props={{
          title: 'wait',
          outlined: true,
          onClick: this.goBack
        }}
        button2Props={{
          title: 'Regenerate statement',
          showLoader: this.state.show_loader,
          contained: true,
          onClick: this.goNext
        }}
      >
        <EmailTemplate containerStyle={{ paddingBottom: '100px' }}/>
      </Container>
    );
  }
}

export default EmailNotReceived;