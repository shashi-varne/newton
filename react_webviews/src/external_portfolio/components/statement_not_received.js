import React, { Component } from 'react';
import Container from '../common/Container';
import InfoIcon from '@material-ui/icons/Info';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from '../../utils/functions';
import { Button } from 'material-ui';
import InfoBox from '../mini-components/InfoBox';
import { navigate, setLoader } from '../common/commonFunctions';
import { requestStatement } from '../common/ApiCalls';
import toast from '../../common/ui/Toast';
import { storageService } from '../../utils/validators';
const productType = getConfig().productName;
const emailDomain = getConfig().emailDomain;

class StatementNotReceived extends Component {
  constructor(props) {
    super(props);
    const email_detail = storageService().getObject('email_detail_hni');
    this.state = {
      email_detail: email_detail,
    };
    this.navigate = navigate.bind(this);
    this.setLoader = setLoader.bind(this);
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'portfolio_tracker',
      "properties": {
        "user_action": user_action,
        "screen_name": 'sent mail not found',
        performed_by: storageService().get('hni-platform') === 'rmapp' ? 'RM' : 'user',
      }
    };
    
    if (['just_set_events', 'back'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  regenerateStatement = async () => {
    this.sendEvents('regenerate_stat');
    try {
      this.setLoader(true);
      const { email_detail } = this.state;
      await requestStatement({
        email: email_detail.email,
        statement_id: email_detail.latest_statement.statement_id,
        retrigger: 'true',
      });
      this.navigate(`statement_request/${email_detail.email}`, {
        exitToApp: true,
        noEmailChange: true,
        fromRegenerate: true,
      });
    } catch (err) {
      this.setLoader(false);
      console.log(err);
      toast(err);
    }
  }

  goBack = (params = {}) => {
    storageService().remove('email_detail_hni');
    nativeCallback({ action: 'exit', events: this.sendEvents('back') });
  }

  render() {
    const { show_loader, email_detail } = this.state;
    const status = (email_detail.latest_statement || {}).statement_status;
    
    return (
      <Container
        title={
          status === 'requested' ?
          "We haven't received any CAS email" : "Error while processing CAS email"
        }
        showLoader={show_loader}
        headerData={{ icon: 'close' }}
        noFooter={true}
        noHeader={show_loader}
        goBack={this.goBack}
      >
        <img
          src={require(`assets/${productType}/cas_not_received.svg`)}
          alt="cas-not-received"
          style={{ width: '100%'}}
          />
        {status === 'requested' &&
          <div className="ext-pf-subheader">
            <h4>Make sure your email id is correct</h4>
            <InfoBox
              image={require(`assets/${productType}/ic_mail.svg`)}
              imageAltText="mail-icon"
              ctrlText="Change"
              onCtrlClick={() => this.navigate('email_entry', {
                comingFrom: 'statement_not_received',
                email: email_detail.email,
              })}
            >
              <div id="info-box-body-header">Email ID</div>
              <span id="info-box-body-subheader">{email_detail.email}</span>
            </InfoBox>
          </div>
        }
        <div className="ext-pf-subheader">
          <h4>Please ensure that the correct email is forwarded to</h4>
          <InfoBox
            classes={{ root: 'info-box-cut-out' }}
            isCopiable={true}
            textToCopy={`cas@${emailDomain}`}
          >
            <span className="info-box-body-text">
              cas@{emailDomain}
            </span>
          </InfoBox>
        </div>
        <div className="ext-pf-subheader">
          <h4>Try creating a fresh request</h4>
          <InfoBox>
            <div className="flex-info-container">
              <InfoIcon color="primary" id="info-container-icon" />
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
            onClick={this.regenerateStatement}
          >
            Regenerate Statement
          </Button>
        </div>
      </Container>
    );
  }
}

export default StatementNotReceived;