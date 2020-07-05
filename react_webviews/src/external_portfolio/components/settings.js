import React, { Component } from 'react';
import Container from '../common/Container';
import EmailExpand from '../mini-components/EmailExpand';
import toast from '../../common/ui/Toast';
import { fetchEmails } from '../common/ApiCalls';
import { storageService } from '../../utils/validators';
import { setLoader, navigate } from '../common/commonFunctions';
import PopUp from '../common/PopUp';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      openPopup: false,
      emails: [],
    };
    this.setLoader = setLoader.bind(this);
    this.navigate = navigate.bind(this);
  }

  async componentWillMount() {
    try {
      this.setLoader(true);
      // const userId = storageService().getObject('user_id');
      const emails = await fetchEmails();
      this.setState({ emails });
    } catch(err) {
      this.setLoader(false);
      toast(err);
    }
  }

  openRemoveConfirm = () => {
    this.setState({ openPopup: true });
  }

  removeEmail = async () => {
    this.setState({ openPopup: false });
    // Call API to remove email here
  }

  render() {
    const { emails } = this.state;
    console.log(emails)
    return (
      <Container
        title="Investment email ids"
        handleClick={() => this.navigate('email_entry', {comingFrom: 'settings'})}
        subtitle="Resync to track the recent transactions in your portfolio"
        buttonTitle="Add new email"
      >
        {emails.map(email => (
          <EmailExpand
            key={email.email_id}
            parent={this}
            comingFrom="settings"
            clickRemoveEmail={this.openRemoveConfirm}
            email={email}
          />
        ))}
        <PopUp
          openPopup={this.state.openPopup}
          cancelText="Cancel"
          okText="Remove Email"
          handleNo={() => this.setState({ openPopup: false })}
          handleYes={this.removeEmail}
          handleClose={() => this.setState({ openPopup: false })}
        >
          Do you want to remove this email from the portfolio tracker?
        </PopUp>
      </Container>
    );
  }
}