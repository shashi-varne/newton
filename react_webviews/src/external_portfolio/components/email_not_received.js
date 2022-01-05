import React, { Component } from 'react';
import EmailTemplate from '../mini-components/email_template';
import { Button } from 'material-ui';
import InfoIcon from '@material-ui/icons/Info';
import InfoBox from '../mini-components/InfoBox';
import { navigate, setLoader } from '../common/commonFunctions';
import { requestStatement } from '../common/ApiCalls';
import toast from '../../common/ui/Toast';
import { storageService } from '../../utils/validators';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from '../../utils/functions';

const { emailDomain } = getConfig();

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
      this.setLoader(true);
      this.sendEvents('regenerate_stat');
      const email_detail = storageService().getObject('email_detail_hni');
      await requestStatement({ 
        email: email_detail.email,
        statement_id: email_detail.latest_statement.statement_id,
        retrigger: 'true',
      });
      this.navigate(`statement_request/${email_detail.email}`, {
        exitToApp: true,
        fromRegenerate: true,
      });
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
    const subtitleText = (<span>It usually takes 1 hour to get the statement in your email</span>);
    return (
      <EmailTemplate
        title="Did not recieve email"
        subtitle={subtitleText}
        showLoader={this.state.show_loader}
        noFooter={true}
        noHeader={this.state.show_loader}
        goBack={this.goBack}
      >
        <Button
          variant="outlined" color="secondary" fullWidth={true}
          classes={{
            root: 'gen-statement-btn',
            label: 'gen-statement-btn-label'
          }}
          onClick={this.goNext}
        >
          Regenerate Statement
        </Button>
      </EmailTemplate>
    );
  }
}

export default EmailNotReceived;