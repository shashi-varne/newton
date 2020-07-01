import React, { Component } from 'react';
import Container from '../common/Container.js';
// import Api from 'utils/api';
// import toast from '../../common/ui/Toast';
// import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import Input from '../../common/ui/Input';
import { validateEmail, storageService } from '../../utils/validators.js';
import { navigate, setLoader } from '../common/commonFunctions.js';
import { requestStatement, fetchEmails } from '../common/ApiCalls.js';
import PopUp from '../common/PopUp.js';

// const product_type = getConfig().type;
class email_entry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      email_error: '',
      openPopup: false,
    };
    this.navigate = navigate.bind(this);
    this.setLoader = setLoader.bind(this);
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
    const { email } = this.state;
    if (!validateEmail(email)) {
      this.setState({ email_error: 'Please enter a valid email' });
    } else {
      storageService().setObject('new_user_email', email);
      try {
        this.setLoader(true);
        const { emails } = await fetchEmails({ email_id: email });
        if (emails.length) {
          this.setState({ openPopup: true });
        } else {
          await requestStatement({ email });
          const { params } = this.props.location;
          this.navigate(
            'statement_request',
            { exitToApp: !!(params || {}).comingFrom },
            true
          );
        }
      } catch(e) {
        this.setLoader(false);
      }
    }
  }

  goBack = (params) => {
    if (params.comingFrom) {
      this.props.history.goBack();
    } else {
      nativeCallback({ action: 'exit', events: this.getEvents('back') });
    }
  }

  render() {
    const { email_error, show_loader } = this.state;
    return (
      <Container
        hideInPageTitle={true}
        fullWidthButton={true}
        classHeader="bg-highlight"
        handleClick={this.goNext}
        buttonTitle="Generate Statement"
        showLoader={show_loader}
        goBack={this.goBack}
      >
        <div className="email-entry-banner">
          <span className="header-title-text">
            Portfolio Tracker
          </span>
          <span className="header-subtitle-text">
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