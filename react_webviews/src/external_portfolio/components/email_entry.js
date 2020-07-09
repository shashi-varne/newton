import React, { Component } from 'react';
import Container from '../common/Container.js';
import toast from '../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import Input from '../../common/ui/Input';
import { validateEmail } from '../../utils/validators.js';
import { navigate, setLoader } from '../common/commonFunctions.js';
import { requestStatement, fetchEmails } from '../common/ApiCalls.js';
import PopUp from '../common/PopUp.js';

const productType = getConfig().productName;

class email_entry extends Component {
  constructor(props) {
    super(props);
    const params = props.location.params || {};
    this.state = {
      email: params.email || '',
      email_error: '',
      openPopup: false,
    };
    this.navigate = navigate.bind(this);
    this.setLoader = setLoader.bind(this);
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'portfolio_tracker',
      "properties": {
        "user_action": user_action,
        "screen_name": 'email entry',
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
    this.setState({ openPopup: false });
  }

  goNext = async () => {
    this.sendEvents('next');
    const { email } = this.state;
    if (!validateEmail(email)) {
      this.setState({ email_error: 'Please enter a valid email' });
    } else {
      try {
        this.setLoader(true);
        const emails = await fetchEmails({ email_id: email });
        if (emails.length) {
          this.setLoader(false);
          this.setState({ openPopup: true });
        } else {
          await requestStatement({ email });
          const params = this.props.location.params || { exitToApp: true };
          const moveToParam = params.comingFrom === 'statement_request' ?
            params.navigateBackTo : params.comingFrom;
          this.navigate(
            `statement_request/${email}`,
            {
              exitToApp: params.exitToApp,
              navigateBackTo: params.exitToApp ? null : moveToParam,
            },
            true
          );
        }
      } catch(err) {
        console.log(err);
        toast(err);
        this.setLoader(false);
      }
    }
  }

  goBack = (params) => {
    if (params) {
      if (params.comingFrom === 'statement_request') {
        this.navigate(
          `statement_request/${this.state.email}`,
          {
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
        buttonTitle="Generate Statement"
        showLoader={show_loader}
        goBack={this.goBack}
      >
        <div
          className={`
            email-entry-banner
            ${productType === 'fisdom' ? 'fisdom-bg' : 'myway-bg' }
          `}
        >
          <span className="header-title-text-hni">
            Portfolio Tracker
          </span>
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
            class="Email"
            id="email"
            name="email"
            value={this.state.email}
            variant="filled"
            onChange={this.handleChange('email')} />
        </div>
        <PopUp
          openPopup={this.state.openPopup}
          handleNo={this.handleClose}
          onlyExit={true}
          handleClose={this.handleClose}
        >
          This email has already been added. Please resync from the settings page to update portfolio
        </PopUp>
      </Container>
    );
  }
}

export default email_entry;