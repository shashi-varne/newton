import React, { Component } from 'react';
import EmailTemplate from './email_template';
import { Button } from 'material-ui';
import InfoIcon from '@material-ui/icons/Info';

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
        <div class="info-box">
          <div class="info-box-img">
            <InfoIcon color="primary"/>
          </div>
          <div class="info-box-body">
            <span id="info-box-body-text-1">
              If you have not recieved an email from CAMS within 24hrs,
              try creating a fresh request again for the statement 
              by clicking below
            </span>
          </div>
        </div>
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