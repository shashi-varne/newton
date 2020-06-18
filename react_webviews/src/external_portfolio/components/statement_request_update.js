import React, { Component } from 'react';
import Container from '../common/Container';
import image from '../../assets/contact_details_icn.svg';
import EmailRegenerationStepper from '../common/Stepper';

class StatementRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container
        title="Statement request sent"
        noFooter={true}
      >
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
        <div className="ext-pf-subheader">
          <h4>What's next?</h4>
        </div>
        <EmailRegenerationStepper/>
        {/* </EmailRegenerationStepper> */}
      </Container>
    );
  }
}

export default StatementRequest;