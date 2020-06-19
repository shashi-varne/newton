import React, { Component } from 'react';
import Container from '../common/Container';
import image from '../../assets/contact_details_icn.svg';
import EmailRegenerationStepper from '../mini-components/Stepper';
import { getConfig } from '../../utils/functions';
import RegenerateOptsPopup from '../mini-components/RegenerateOptsPopup';
import InfoBox from '../mini-components/InfoBox';

const productType = getConfig().productName;
class StatementRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupOpen: false,
    };
  }

  generateStatement = () => {
    this.setState({ popupOpen: true });
  }

  onPopupClose = () => {
    this.setState({ popupOpen: false });
  }

  render() {
    return (
      <Container
        title="Statement request sent"
        noFooter={true}
      >
        <InfoBox
          image={image}
          imageAltText="mail-icon"
          ctrlText="Change"
        >
          <div id="info-box-body-header">Email ID</div>
          <span id="info-box-body-subheader">anant@fisdom.com</span>
        </InfoBox>
        <div className="ext-pf-subheader">
          <h4>What's next?</h4>
        </div>
        <EmailRegenerationStepper
          generateBtnClick={this.generateStatement}
        />
        <RegenerateOptsPopup
          onPopupClose={this.onPopupClose}
          open={this.state.popupOpen}
        />
      </Container>
    );
  }
}

export default StatementRequest;