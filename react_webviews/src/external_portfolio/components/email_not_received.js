import React, { Component } from 'react';
import EmailTemplate from './email_template';
import { Button } from 'material-ui';
import InfoIcon from '@material-ui/icons/Info';
import InfoBox from '../mini-components/InfoBox';

class EmailNotReceived extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <EmailTemplate
        title="CAS email not received"
        subtitle="Please ensure that the correct email is forwarded to cas@fisdom.com"
        noFooter={true}
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
        >
          Regenerate Statement
        </Button>
      </EmailTemplate>
    );
  }
}

export default EmailNotReceived;