import React, { Component } from 'react';
import Container from '../common/Container';
import mail_icn_f from '../../assets/fisdom/ic_mail.svg';
import mail_icn_m from '../../assets/myway/ic_mail.svg';
import EmailRequestSteps from '../mini-components/EmailRequestSteps';
import { getConfig } from '../../utils/functions';
import RegenerateOptsPopup from '../mini-components/RegenerateOptsPopup';
import InfoBox from '../mini-components/InfoBox';
import { navigate } from '../common/commonFunctions';
import { nativeCallback } from 'utils/native_callback';
import { storageService } from '../../utils/validators';

const productType = getConfig().productName;
class StatementRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupOpen: false,
      showLoader: false,
      loadingText: '',
      email: '',
    };
    this.navigate = navigate.bind(this);
  }

  componentDidMount() {
    const new_user_email = storageService().getObject('new_user_email');
    this.setState({ email: new_user_email});
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
    // TODO: check statement_status for email (call email listing API with specific email ID)
    const status = '';
    if (status === 'success') {
      this.navigate('external_portfolio');
    } else {
      this.navigate('statement_not_received', { exitToApp: true, status });
    }
  }

  goBack = (params = {}) => {
    if (params.exitToApp) {
      nativeCallback({ action: 'exit', events: this.getEvents('back') });
    } else {
      this.props.history.goBack();
    }
  }

  render() {
    const { pathname } = this.props.history.location;
    /* TODO: fetch email statement dt_updated and do
    (new Date() - new Date(dt_updated))/60000 to check if or not
    to show the regenrate btn */
    const showRegenerateBtn = false;
    return (
      <Container
        title="Statement request sent"
        showLoader={this.state.showLoader}
        loaderData={{
          loadingText: this.state.loadingText,
        }}
        headerData={{ icon: 'close' }}
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
          <span id="info-box-body-subheader">{this.state.email}</span>
        </InfoBox>
        <div className="ext-pf-subheader">
          <h4>What's next?</h4>
        </div>
        <EmailRequestSteps
          emailForwardedHandler={this.emailForwarded}
          showRegenerateBtn={showRegenerateBtn}
          parent={this}
        />
      </Container>
    );
  }
}

export default StatementRequest;