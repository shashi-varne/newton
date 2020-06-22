import React, { Component } from 'react';
import Container from '../common/Container';
import image from '../../assets/contact_details_icn.svg';
import InfoIcon from '@material-ui/icons/Info';
import cas_not_received_f from '../../assets/fisdom/cas_not_received.svg';
import cas_not_received_m from '../../assets/myway/cas_not_received.svg';
import { getConfig } from '../../utils/functions';
import { Button } from 'material-ui';
import InfoBox from '../mini-components/InfoBox';
import { navigate } from '../common/commonFunctions';

const productType = getConfig().productName;
class StatementNotReceived extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigate = navigate.bind(this);
  }

  goNext = (path) => {
    this.navigate(path, { comingFrom: 'statement_not_received' });
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {
    return (
      <Container
        title="We haven't received any CAS email"
        noFooter={true}
        goBack={this.goBack}
      >
        <img
          src={productType === 'fisdom' ? cas_not_received_f : cas_not_received_m}
          alt="cas-not-received"
          style={{ width: '100%'}}
          />
        <div className="ext-pf-subheader">
          <h4>Make sure your email id is correct</h4>
          <InfoBox
            image={image}
            imageAltText="mail-icon"
            ctrlText="Change"
            onCtrlClick={() => this.goNext('email_entry')}
          >
            <div id="info-box-body-header">Email ID</div>
            <span id="info-box-body-subheader">anant@fisdom.com</span>
          </InfoBox>
        </div>
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
            onClick={() => this.goNext('statement_request')}
          >
            Regenerate Statement
          </Button>
        </div>
      </Container>
    );
  }
}

export default StatementNotReceived;