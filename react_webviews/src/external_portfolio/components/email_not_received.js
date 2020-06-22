import React, { Component } from 'react';
import EmailTemplate from './email_template';
import { Button } from 'material-ui';
import InfoIcon from '@material-ui/icons/Info';
import InfoBox from '../mini-components/InfoBox';
import { navigate } from '../common/commonFunctions';

class EmailNotReceived extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigate = navigate.bind(this);
  }

  goNext = () => {
    this.navigate('statement_request', { comingFrom: 'email_not_received' });
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {
    return (
      <EmailTemplate
        title="CAS email not received"
        subtitle="Please ensure that the correct email is forwarded to cas@fisdom.com"
        noFooter={true}
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