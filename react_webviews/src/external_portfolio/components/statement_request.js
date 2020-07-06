import React, { Component } from 'react';
import Container from '../common/Container';
import EmailRequestSteps from '../mini-components/EmailRequestSteps';
import { getConfig } from '../../utils/functions';
import InfoBox from '../mini-components/InfoBox';
import { navigate, emailForwardedHandler } from '../common/commonFunctions';
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
      show_loader: false,
      loadingText: '',
      email_detail: '',
      selectedEmail: '',
    };
    this.navigate = navigate.bind(this);
    this.emailForwardedHandler = emailForwardedHandler.bind(this);
  }

  async componentDidMount() {
    try {
      const params = this.props.location.params || {};
      if (params.email) {
        this.setState({ selectedEmail: params.email });
        const [email] = await fetchEmails({ email_id: params.email });
        if (email) {
          this.setState({email_detail: email || {}});
          let keyedEmails = storageService().getObject('keyedEmails');
          if (keyedEmails) keyedEmails[params.email] = email;
          else keyedEmails = { [params.email]: email };
          storageService().setObject('keyedEmails', keyedEmails);
        } else {
          throw 'Error fetching email details';
        }
      } else {
        // Todo: wait for Vikas to confirm
      }
    } catch (err) {
      console.log(err);
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
      email: this.state.selectedEmail,
    });
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
    const { email_detail, show_loader, loadingText, selectedEmail } = this.state;
    const params = this.props.location.params || {};
    let emailToShow = selectedEmail, showRegenerateBtn = false;
    if (email_detail && email_detail.latest_statement) {
      emailToShow = email_detail.email || selectedEmail;
      showRegenerateBtn = (new Date() - new Date(email_detail.latest_statement.dt_updated))/60000 >= 30;
    }
    return (
      <Container
        title="Statement request sent"
        showLoader={show_loader}
        loaderData={{
          loadingText,
        }}
        headerData={{ icon: 'close' }}
        noFooter={true}
        noHeader={show_loader}
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
          emailForwardedHandler={() => this.emailForwardedHandler(email_detail.email)}
          showRegenerateBtn={showRegenerateBtn}
          emailDetail={email_detail}
          parent={this}
        />
      </Container>
    );
  }
}

export default StatementRequest;