import React, { Component } from 'react';
import Container from '../common/Container';
import EmailRequestSteps from '../mini-components/EmailRequestSteps';
import { getConfig } from '../../utils/functions';
import InfoBox from '../mini-components/InfoBox';
import { navigate, emailForwardedHandler } from '../common/commonFunctions';
import { nativeCallback } from 'utils/native_callback';
import { storageService, getUrlParams } from '../../utils/validators';
import toast from '../../common/ui/Toast';
import { fetchEmails } from '../common/ApiCalls';
import { regenTimeLimit } from '../constants';

const productType = getConfig().productName;
class StatementRequest extends Component {
  constructor(props) {
    super(props);
    const params = this.props.location.params || {};
    this.state = {
      popupOpen: false,
      show_loader: false,
      loadingText: '',
      email_detail: '',
      selectedEmail: this.getEmailParam(),
      exitToApp: params.exitToApp || this.cameFromApp(),
    };
    this.navigate = navigate.bind(this);
    this.emailForwardedHandler = emailForwardedHandler.bind(this);
    this.setEntryPoint();
  }

  setEntryPoint() {
    const params = this.props.location.params || {};
    let entry_point = '';
    if (this.cameFromApp()) entry_point = 'app';
    else if (params.fromRegenerate) entry_point = 'regenerate_stat';
    else entry_point = 'email_entry';
    
    storageService().set('statement-req-entry-point', entry_point);
  }

  sendEvents(user_action) {
    const params = this.props.location.params || {};
    let eventObj = {
      "event_name": 'portfolio_tracker',
      "properties": {
        "user_action": user_action,
        "screen_name": 'statement request sent',
        email_look_clicked: params.comingFrom === 'email_example_view',
        entry_point: storageService().get('statement-req-entry-point') || null,
        status: this.state.showRegenerateBtn ? 'mail not recieved in 30 min' : 'before tracker setup',
      }
    };

    if (['just_set_events', 'back'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  cameFromApp = () => {
    const params = this.props.location.params || {};
    const urlParams = getUrlParams() || {};
    const trueVals = [true, 'true'];

    return trueVals.includes(params.fromApp) || trueVals.includes(urlParams.fromApp);
  }

  getEmailParam = () => {
    const matchParams = this.props.match.params || {};
    const queryParams = getUrlParams();
    const emailParam = matchParams.email || queryParams.email;
    return emailParam;
  }

  async componentDidMount() {
    const emailParam = this.getEmailParam();
    if (emailParam) {
      this.setState({ selectedEmail: emailParam });
      try {
        const [email] = await fetchEmails({ email_id: emailParam });
        if (email) {
          let showRegenerateBtn = false;
          if (email.latest_statement) {
            showRegenerateBtn =
              (new Date() - new Date(email.latest_statement.dt_updated)) / 60000 >= regenTimeLimit;
          }
          this.setState({
            email_detail: email || {},
            showRegenerateBtn,
          });
          // storageService().setObject('email_detail_hni', email);
        }
      } catch (err) {
        console.log(err);
        toast(err);
      }
    }
  }

  generateStatement = () => {
    this.sendEvents('regenerate_stat');
    this.setState({ popupOpen: true });
  }

  onPopupClose = () => {
    this.setState({ popupOpen: false });
  }

  onInfoCtrlClick = () => {
    this.sendEvents('email_change');
    const params = this.props.location.params || {};

    this.navigate('email_entry', {
      comingFrom: 'statement_request',
      fromRegenerate: params.fromRegenerate,
      navigateBackTo: params.navigateBackTo,
      exitToApp: this.state.exitToApp,
      fromApp: this.cameFromApp(),
      email: this.state.selectedEmail,
    });
  }

  goBack = (params) => {
    storageService().remove('email_detail_hni');
    if (!params || this.state.exitToApp) {
      nativeCallback({ action: 'exit', events: this.sendEvents('back') });
    } else if (params.navigateBackTo) { // available when coming from email_entry
      this.navigate(params.navigateBackTo);
    }
  }

  emailLinkClick = (params) => {
    this.setState({ emailLinkClicked: true });
    this.navigate('email_example_view', {
      /* Require these params to be sent back here, otherwise props
      will be lost when coming back from next page*/
      comingFrom: 'statement_request',
      fromRegenerate: params.fromRegenerate,
      exitToApp: this.state.exitToApp,
      navigateBackTo: this.state.exitToApp ? null : params.navigateBackTo,
      noEmailChange: params.noEmailChange,
      fromApp: this.cameFromApp(),
      email: this.state.selectedEmail,
    });
  }

  render() {
    const {
      email_detail,
      show_loader,
      loadingText,
      selectedEmail,
      showRegenerateBtn,
    } = this.state;
    const params = this.props.location.params || {};
    const showBack = this.cameFromApp() || params.comingFrom === 'settings';
    
    return (
      <Container
        title="Statement request sent"
        showLoader={show_loader}
        loaderData={{
          loadingText,
        }}
        headerData={{ icon: showBack ? 'back' : 'close' }}
        noFooter={true}
        noHeader={show_loader}
        goBack={this.goBack}
      >
        {selectedEmail &&
          <InfoBox
            image={require(`assets/${productType}/ic_mail.svg`)}
            imageAltText="mail-icon"
            onCtrlClick={this.onInfoCtrlClick}
            ctrlText={params.noEmailChange ? '' : 'Change'}
          >
            <div id="info-box-body-header">Email ID</div>
            <span id="info-box-body-subheader">{selectedEmail}</span>
          </InfoBox>
        }
        <div className="ext-pf-subheader">
          <h4>What's next?</h4>
        </div>
        <EmailRequestSteps
          emailForwardedHandler={() => this.emailForwardedHandler(email_detail.email)}
          showRegenerateBtn={showRegenerateBtn}
          emailLinkClick={() => this.emailLinkClick(params)}
          emailDetail={email_detail}
          parent={this}
        />
      </Container>
    );
  }
}

export default StatementRequest;