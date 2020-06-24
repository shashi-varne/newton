import React, { Component } from 'react';
import Container from '../common/Container';
import mail_icn_f from '../../assets/fisdom/ic_mail.svg';
import mail_icn_m from '../../assets/myway/ic_mail.svg';
import EmailRegenerationStepper from '../mini-components/Stepper';
import { getConfig } from '../../utils/functions';
import RegenerateOptsPopup from '../mini-components/RegenerateOptsPopup';
import InfoBox from '../mini-components/InfoBox';
import { navigate } from '../common/commonFunctions';
import { nativeCallback } from 'utils/native_callback';

const productType = getConfig().productName;
class StatementRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupOpen: false,
      showLoader: false,
      loadingText: '',
    };
    this.navigate = navigate.bind(this);
  }

  generateStatement = () => {
    this.setState({ popupOpen: true });
  }

  onPopupClose = () => {
    this.setState({ popupOpen: false });
  }

  onInfoCtrlClick = () => {
    this.navigate('email_entry', { comingFrom: 'statement_request' });
  }

  emailForwarded = () => {
    this.setState({
      showLoader: true,
      popupOpen: false,
      loadingText: 'Checking if we have received any CAS email from you',
    });
  }

  goBack = (params = {}) => {
    if (!params.comingFrom ||
      [ 'email_entry',
        'email_not_received',
        'statement_not_received',
      ].includes(params.comingFrom)
    ) {
      nativeCallback({ action: 'exit', events: this.getEvents('back') });
    } else {
      this.props.history.goBack();
    }
  }

  render() {
    return (
      <Container
        title="Statement request sent"
        showLoader={this.state.showLoader}
        loaderData={{
          loadingText: this.state.loadingText,
        }}
        noFooter={true}
        noHeader={this.state.showLoader}
        goBack={this.goBack}
      >
        <InfoBox
          image={productType === 'fisdom' ? mail_icn_f : mail_icn_m}
          imageAltText="mail-icon"
          onCtrlClick={this.onInfoCtrlClick}
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
          emailLinkTrigger={() => this.navigate('email_example_view')}
        />
        <RegenerateOptsPopup
          forwardedClick={this.emailForwarded}
          notReceivedClick={() => this.navigate('email_not_received')}
          onPopupClose={this.onPopupClose}
          open={this.state.popupOpen}
        />
      </Container>
    );
  }
}

export default StatementRequest;