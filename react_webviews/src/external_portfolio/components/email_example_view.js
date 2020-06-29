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
    return (
      <EmailTemplate
        title="What does the CAS email look like?"
        subtitle="Please ensure that the correct email is forwarded to cas@fisdom.com"
        handleClick={this.goBack}
        buttonTitle="Okay"
        goBack={this.goBack}
      >
      </EmailTemplate>
    );
  }
}

export default EmailExampleView;