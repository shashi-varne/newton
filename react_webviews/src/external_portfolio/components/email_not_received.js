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
const emailDomain = getConfig().emailDomain;

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
    const subtitleText = (<span>Please ensure that the correct email is forwarded to <span id="cas-email-highlight">cas@{emailDomain}</span></span>);
    return (
      <EmailTemplate
        title="CAS email not received"
        subtitle={subtitleText}
        showLoader={this.state.show_loader}
        noFooter={true}
        noHeader={this.state.show_loader}
        goBack={this.goBack}
      >
        <InfoBox classes={{root: 'm-t-40'}}>
          <div className="flex-info-container">
            <InfoIcon color="primary" id="info-container-icon"/>
            <span id="info-container-text">
              If you have not recieved an email from CAMS within 24hrs,
              try creating a fresh request again for the statement
              by clicking below
            </span>
          </div>
        </InfoBox>
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