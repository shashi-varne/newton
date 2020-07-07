import React, { Component } from 'react';
import Container from '../common/Container';
import image from 'assets/contact_details_icn.svg';
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

  regenerateStatement = async () => {
    try {
      this.setLoader(true);
      const { email_detail } = this.state;
      await requestStatement({
        email_id: email_detail.email,
        statement_id: email_detail.latest_statement.statement_id,
        retrigger: true,
      });
      this.navigate('statement_request', {
        exitToApp: true,
        email: email_detail.email,
        noEmailChange: true,
      });
    } catch (err) {
      console.log(err);
      toast(err);
    }
    this.setLoader(false);
  }

  goBack = (params = {}) => {
    storageService().remove('email_detail_hni');
    nativeCallback({ action: 'exit', events: this.getEvents('back') });
  }

  render() {
    const { show_loader, email_detail } = this.state;
    const status = email_detail.latest_statement.statement_status;
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
              image={image}
              imageAltText="mail-icon"
              ctrlText="Change"
              onCtrlClick={() => this.navigate('email_entry', {
                comingFrom: 'statement_not_received',
                exitToApp: true,
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
            textToCopy="cas@fisdom.com"
          >
            <span className="info-box-body-text">
              cas@fisdom.com
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