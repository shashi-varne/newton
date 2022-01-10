import React, { Component } from 'react';
import Container from '../common/Container.js';
import toast from '../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import Input from '../../common/ui/Input';
import { validateEmail, storageService } from '../../utils/validators.js';
import { navigate, setLoader, setPlatformAndUser } from '../common/commonFunctions.js';
import { requestStatement, fetchEmails } from '../common/ApiCalls.js';
import PopUp from '../common/PopUp.js';
import WVBottomSheet from '../../common/ui/BottomSheet/WVBottomSheet.js';

const { productName: productType, emailDomain } = getConfig();

class EmailEntry extends Component {
  constructor(props) {
    super(props);
    const params = props.location.params || {};
    this.state = {
      email: params.email || '',
      email_error: '',
      openDuplicateEmailPopup: false,
      openSuccessModal: false
    };
    this.navigate = navigate.bind(this);
    this.setLoader = setLoader.bind(this);
    setPlatformAndUser();
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'portfolio_tracker',
      "properties": {
        "user_action": user_action,
        "screen_name": 'email entry',
        performed_by: storageService().get('hni-platform') === 'rmapp' ? 'RM' : 'user',
      }
    };
    
    if (['just_set_events', 'back'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = key => event => {
    this.setState({
      [key]: event.target.value,
      [key + '_error']: '',
    });
  }

  handleClose = () => {
    this.setState({ openDuplicateEmailPopup: false });
  }

  goNext = async () => {
    this.sendEvents('next');
    const { email } = this.state;
    if (!validateEmail(email)) {
      this.setState({ email_error: 'Please enter a valid email' });
    } else {
      try {
        this.setLoader('button');
        const emails = await fetchEmails({ email_id: email });
        if (emails.length) {
          this.setLoader(false);
          this.setState({ openDuplicateEmailPopup: true });
        } else {
          await requestStatement({ email });
          this.setLoader(false);
          this.setState({ openSuccessModal: true });
        }
      } catch(err) {
        console.log(err);
        toast(err);
        this.setLoader(false);
      }
    }
  }

  redirectToStepsScreen = () => {
    const params = this.props.location.params || { exitToApp: true };
    const moveToParam = params.comingFrom === 'statement_request' ?
      params.navigateBackTo : params.comingFrom;
    this.navigate(
      `statement_request/${this.state.email}`,
      {
        exitToApp: params.exitToApp,
        navigateBackTo: params.exitToApp ? null : moveToParam,
      },
      true
    );
  }

  goBack = (params) => {
    if (params) {
      nativeCallback({ events: this.sendEvents('back') });
      if (params.comingFrom === 'statement_request') {
        this.navigate(
          `statement_request/${params.email}`,
          {
            fromApp: params.fromApp,
            exitToApp: params.exitToApp,
            navigateBackTo: params.exitToApp ? null : params.navigateBackTo,
          },
          true
        );
      } else {
        this.props.history.goBack();
      }
    } else {
      nativeCallback({ action: 'exit', events: this.sendEvents('back') });
    }
  }

  render() {
    const { email_error, show_loader } = this.state;
    return (
      <Container
        hideInPageTitle={true}
        events={this.sendEvents('just_set_events')}
        fullWidthButton={true}
        noHeader={show_loader}
        classHeader={'bg-highlight'}
        handleClick={this.goNext}
        buttonTitle="Continue"
        showLoader={show_loader}
        goBack={this.goBack}
      >
        <div
          className={`
            email-entry-banner
            ${productType === 'fisdom' ? 'fisdom-bg' : 'myway-bg' }
          `}
        >
          <div className="header-title-text-hni" id="hni-custom-title">
            Portfolio tracker
          </div>
          <span className="header-subtitle-text-hni">
            Get a consolidated view of all <br /> your external investments
          </span>
        </div>
        <div className="ext-pf-email-label">
          Enter your primary investment email
        </div>
        <div className="InputField">
          <Input
            shrink={this.state.email}
            error={!!email_error}
            helperText={email_error}
            type="email"
            width="40"
            label="Email"
            class="Email address"
            id="email"
            name="email"
            value={this.state.email}
            variant="filled"
            onChange={this.handleChange('email')} />
        </div>
        <PopUp
          openPopup={this.state.openDuplicateEmailPopup}
          handleNo={this.handleClose}
          onlyExit={true}
          handleClose={this.handleClose}
        >
          This email has already been added. Please resync from the settings page to update portfolio
        </PopUp>
        <WVBottomSheet
          disableBackdropClick
          disableEscapeKeyDown
          title="Portfolio statement generated"
          subtitle="You'll get an email with your portfolio statement in around 1 hour. Forward the email as received to"
          isOpen={this.state.openSuccessModal}
          image={require(`assets/${productType}/statements_briefcase.svg`)}
          button1Props={{
            title: 'Okay',
            contained: true,
            color: 'primary',
            onClick: this.redirectToStepsScreen
          }}
        >
          <span className='portfolio-generated-email'>cas@{emailDomain}</span>
        </WVBottomSheet>
      </Container>
    );
  }
}

export default EmailEntry;