import React, { Component } from 'react';
import EmailTemplate from '../mini-components/email_template';


class EmailExampleView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {
    const subtitleText = (<span>Please ensure that the correct email is forwarded to <span id="cas-email-highlight">cas@fisdom.com</span></span>);
    return (
      <EmailTemplate
        title="How to find the CAS email?"
        subtitle={subtitleText}
        handleClick={this.goBack}
        buttonTitle="Okay"
        goBack={this.goBack}
      >
      </EmailTemplate>
    );
  }
}

export default EmailExampleView;