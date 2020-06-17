import React, { Component } from 'react';
import Container from '../common/Container.js';
import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import Input from '../../common/ui/Input';
import { validateEmail } from '../../utils/validators.js';
const product_type = getConfig().type;
class email_entry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      email_error: '',
    };
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
      // this.navigate();
      console.log('else');
    }
  }

  render() {
    const { email_error } = this.state;
    return (
      <Container
        hideInPageTitle={true}
        fullWidthButton={true}
        handleClick={this.goNext}
        buttonTitle="Generate Statement"
      >
        <div
          className="ext-pf-banner"
          style={{
            backgroundColor: '#f0f7ff',
          }}>
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