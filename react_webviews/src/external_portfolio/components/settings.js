import React, { Component } from 'react';
import Container from '../common/Container';
import EmailExpand from '../mini-components/EmailExpand';
import toast from '../../common/ui/Toast';
import { fetchEmails } from '../common/ApiCalls';
import { storageService } from '../../utils/validators';
import { setLoader } from '../common/commonFunctions';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      emails: [],
    };
    this.setLoader = setLoader.bind(this);
  }

  async componentWillMount() {
    try {
      this.setLoader(true);
      const userId = storageService().getObject('user_id');
      const { emails } = await fetchEmails({ userId });
      this.setState({ emails });
    } catch(err) {
      this.setLoader(false);
      toast(err);
    }
  }

  render() {
    const { emails } = this.state;
    return (
      <Container
        title="Investment email ids"
        subtitle="Resync to track the recent transactions in your portfolio"
        buttonTitle="Add new email"
      >
        {emails.forEach(email => (
          <EmailExpand
            key={email.email_id}
            parent={this}
            comingFrom="settings"
            email={email}
          />
        ))}
      </Container>
    );
  }
}