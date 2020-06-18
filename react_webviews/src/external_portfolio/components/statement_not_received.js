import React, { Component } from 'react';
import Container from '../common/Container';
import image from '../../assets/contact_details_icn.svg';
import InfoIcon from '@material-ui/icons/Info';
import cas_not_received_f from '../../assets/fisdom/cas_not_received.svg';
import cas_not_received_m from '../../assets/myway/cas_not_received.svg';
import { getConfig } from '../../utils/functions';
import { Button } from 'material-ui';

const productType = getConfig().productName;
console.log(productType);
class StatementNotReceived extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container
        title="We haven't received any CAS email"
        noFooter={true}
      >
        <img
          src={productType === 'fisdom' ? cas_not_received_f : cas_not_received_m}
          alt="cas-not-received"
          style={{ width: '100%'}}
          />
        <div className="ext-pf-subheader">
          <h4>Make sure your email id is correct</h4>
          <div class="info-box">
            <div class="info-box-img">
              <img
                src={image}
                className=""
                alt=""
              />
            </div>
            <div class="info-box-body">
              <div id="info-box-body-header">Email ID</div>
              <span id="info-box-body-subheader">anant@fisdom.com</span>
            </div>
            <div class="info-box-ctrl">
              <span>CHANGE</span>
            </div>
          </div>
        </div>
        <div className="ext-pf-subheader">
          <h4>Please ensure that the correct email is forwarded to</h4>
          <div class="info-box info-box-extra">
            <div class="info-box-body">
              <span id="info-box-body-text">
                cas@fisdom.com
              </span>
            </div>
            <div class="info-box-ctrl">
              <span>COPY</span>
            </div>
          </div>
        </div>
        <div className="ext-pf-subheader">
          <h4>Try creating a fresh request</h4>
          <div class="info-box">
            <div class="info-box-img">
              <InfoIcon color="primary" />
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
        </div>
      </Container>
    );
  }
}

export default StatementNotReceived;