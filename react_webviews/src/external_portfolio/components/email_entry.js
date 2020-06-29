import React, { Component } from 'react';
import Container from '../common/Container.js';
// import Api from 'utils/api';
// import toast from '../../common/ui/Toast';
// import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import Input from '../../common/ui/Input';
import { validateEmail } from '../../utils/validators.js';
import { navigate } from '../common/commonFunctions.js';

// const product_type = getConfig().type;
class email_entry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      email_error: '',
    };
    this.navigate = navigate.bind(this);
  }

  handleChange = key => event => {
    this.setState({
      [key]: event.target.value,
      [key + '_error']: '',
    });
  }

  goNext = () => {
    if (!validateEmail(this.state.email)) {
      this.setState({ email_error: 'Please enter a valid email' });
    } else {
      const { params } = this.props.location;
      this.navigate(
        'statement_request',
        { exitToApp: !!(params || {}).comingFrom },
        true
      );
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
    const { email_error } = this.state;
    return (
      <Container
        hideInPageTitle={true}
        fullWidthButton={true}
        classHeader="bg-highlight"
        handleClick={this.goNext}
        buttonTitle="Generate Statement"
        goBack={this.goBack}
      >
        <div
          className="email-entry-banner">
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
      </Container>
    );
  }
}

export default email_entry;