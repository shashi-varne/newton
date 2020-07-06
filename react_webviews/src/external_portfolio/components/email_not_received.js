import React, { Component } from 'react';
import EmailTemplate from '../mini-components/email_template';
import { Button } from 'material-ui';
import InfoIcon from '@material-ui/icons/Info';
import InfoBox from '../mini-components/InfoBox';
import { navigate, setLoader } from '../common/commonFunctions';
import { requestStatement } from '../common/ApiCalls';
import toast from '../../common/ui/Toast';

class EmailNotReceived extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigate = navigate.bind(this);
    this.setLoader = setLoader.bind(this);
  }

  goNext = async () => {
    try {
      this.setLoader(true);
      const { email_detail } = this.props.location.params;
      await requestStatement({ 
        email_id: email_detail.email,
        statement_id: email_detail.latest_statement.statement_id,
        retrigger: true,
      });
      this.navigate('statement_request', {
        exitToApp: true,
        email: email_detail.email,
      });
    } catch (err) {
      console.log(err);
      toast(err);
    }
    this.setLoader(false);
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {
    return (
      <EmailTemplate
        title="CAS email not received"
        subtitle="Please ensure that the correct email is forwarded to cas@fisdom.com"
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