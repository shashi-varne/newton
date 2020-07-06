import React, { Component } from 'react';
import Container from '../common/Container';
import EmailRequestSteps from '../mini-components/EmailRequestSteps';
import { getConfig } from '../../utils/functions';
import InfoBox from '../mini-components/InfoBox';
import { navigate } from '../common/commonFunctions';
import { nativeCallback } from 'utils/native_callback';
import { storageService } from '../../utils/validators';
import toast from '../../common/ui/Toast';
import { fetchEmails } from '../common/ApiCalls';

const productType = getConfig().productName;
class StatementRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupOpen: false,
      showLoader: false,
      loadingText: '',
      email_detail: '',
      selectedEmail: '',
    };
    this.navigate = navigate.bind(this);
  }

  async componentDidMount() {
    try {
      const params = this.props.location.params || {};
      if (params.email) {
        const resObj = await fetchEmails({ email_id: params.email });
        const email_detail = resObj[params.email];
        this.setState({
          email_detail: email_detail || {},
          selectedEmail: params.email,
        });
      } else {
        // Todo: wait for Vikas to confirm
      }
    } catch (err) {
      toast(err);
    }
  }

  generateStatement = () => {
    this.setState({ popupOpen: true });
  }

  onPopupClose = () => {
    this.setState({ popupOpen: false });
  }

  onInfoCtrlClick = () => {
    const params = this.props.location.params || {};
    this.navigate('email_entry', {
      comingFrom: 'statement_request',
      navigateBackTo: params.navigateBackTo,
      email: this.state.selectedEmail
    });
  }

  emailForwarded = async () => {
    this.setState({
      showLoader: true,
      popupOpen: false,
      loadingText: 'Checking if we have received any CAS email from you',
    });
    const status = this.state.email_detail.statement_status;
    if (status === 'success') {
      this.navigate('external_portfolio');
    } else {
      this.navigate('statement_not_received', {
        exitToApp: true,
        email_detail: this.state.email_detail,
        status
      });
    }
  }

  goBack = (params) => {
    if (!params || params.exitToApp) {
      nativeCallback({ action: 'exit', events: this.getEvents('back') });
    } else if (params.navigateBackTo) { // available when coming from email_entry
      this.navigate(params.navigateBackTo);
    } else {
      this.props.history.goBack();
    }
  }

  render() {
    const { email_detail, showLoader, loadingText, selectedEmail } = this.state;
    const params = this.props.location.params || {};
    const emailToShow = email_detail.email_id || selectedEmail;
    const showRegenerateBtn = (new Date() - new Date(email_detail.dt_updated))/60000 >= 30;
    return (
      <Container
        title="Statement request sent"
        showLoader={showLoader}
        loaderData={{
          loadingText,
        }}
        headerData={{ icon: 'close' }}
        noFooter={true}
        noHeader={showLoader}
        goBack={this.goBack}
      >
        {emailToShow &&
          <InfoBox
            image={require(`assets/${productType}/ic_mail.svg`)}
            imageAltText="mail-icon"
            onCtrlClick={this.onInfoCtrlClick}
            ctrlText={params.allowEmailChange ? 'Change' : ''}
          >
            <div id="info-box-body-header">Email ID</div>
            <span id="info-box-body-subheader">{emailToShow}</span>
          </InfoBox>
        }
        <div className="ext-pf-subheader">
          <h4>What's next?</h4>
        </div>
        <EmailRequestSteps
          emailForwardedHandler={this.emailForwarded}
          showRegenerateBtn={showRegenerateBtn}
          emailDetail={email_detail}
          parent={this}
        />
      </Container>
    );
  }
}

export default StatementRequest;