import React, { Component } from 'react';
import Container from '../common/Container';
import EmailExpand from '../mini-components/EmailExpand';
import toast from '../../common/ui/Toast';
import { fetchEmails, deleteEmail } from '../common/ApiCalls';
import { setLoader, navigate, emailForwardedHandler, resetLSKeys } from '../common/commonFunctions';
import PopUp from '../common/PopUp';
import { nativeCallback } from 'utils/native_callback';

let keyedEmails = {}; // Setting this outside of component/state since its unnecessary there
function setKeyedEmails (emails) {
  emails = JSON.parse(JSON.stringify(emails));
  keyedEmails = emails.reduce((emailMap, email) => {
    emailMap[email.email] = email;
    return emailMap;
  }, {});
}
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
    this.emailForwardedHandler = emailForwardedHandler.bind(this);
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'portfolio_tracker',
      "properties": {
        "user_action": user_action,
        "screen_name": 'settings',
        remove_email_clicked: this.state.removeClicked,
      }
    };
    
    if (['just_set_events'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  async componentDidMount() {
    try {
      this.setLoader(true);
      let emails = await fetchEmails();
      emails = this.setEmailRemove(emails);
      this.setState({
        emails,
        show_loader: false, // same as this.setLoader(false);
      });
    } catch(err) {
      this.setLoader(false);
      console.log(err);
      toast(err);
    }
  }

  openRemoveConfirm = (email) => {
    this.setState({
      openPopup: true,
      email_to_remove: email,
    });
  }

  cancelRemoveOp = () => {
    this.setState({
      openPopup: false,
      email_to_remove: '',
    });
  }

  setEmailRemove = (emails = []) => {
    /* Logic: 
      1. For emails that have never been successfully synced even once
      (email.latest_success_statement is empty), the ‘remove’ control will always show.

      2. For emails that have been successfully synced atleast once 
      (email.latest_success_statement exists), the remove option will show
      only when there are atleast 2 emails of this kind. If there is only 1 
      successfully synced email, ‘remove’ control will be hidden for that email.
    */
    emails = JSON.parse(JSON.stringify(emails));
    let last_success_email = '';
    emails.map(email => {
      if (email.latest_success_statement.statement_id) {
        if (last_success_email) {
          last_success_email.allowRemove = true;
          email.allowRemove = true;
        } else {
          last_success_email = email;
          last_success_email.allowRemove = false;
        }
      } else {
        email.allowRemove = true;
      }
      return email;
    });
    setKeyedEmails(emails); // Update map here
    return emails;
  }

  removeEmail = async () => {
    this.setState({ openPopup: false, removeClicked: true });
    try {
      this.setLoader(true);
      await deleteEmail({ email_id: this.state.email_to_remove.email });
      this.removeAndUpdateEmailList();
      this.setLoader(false);
    } catch (err) {
      this.setLoader(false);
      console.log(err);
      toast(err);
    }
  }

  removeAndUpdateEmailList = () => {
    let { email_to_remove } = this.state;

    delete keyedEmails[email_to_remove.email];
    let emails = Object.values(keyedEmails);
    if (email_to_remove.latest_success_statement.statement_id) {
      // Reset allowRemove flag for emails when a successfully linked email is removed
      emails = this.setEmailRemove(emails);

      /* Below code is required for when an email with a succesfully synced
      statement is removed and the PAN selected by the user was the PAN
      associated with the email being removed */
      resetLSKeys(['user_pan', 'hni-pans', 'hni-portfolio']);
    }
    this.setState({ emails });
  }

  addNewEmail = () => {
    this.sendEvents('next');
    this.navigate('email_entry', {
      comingFrom: 'settings',
    });
  }

  render() {
    const { emails, show_loader, loadingText } = this.state;
    return (
      <Container
        title="Investment email ids"
        handleClick={this.addNewEmail}
        subtitle="Resync to track the recent transactions in your portfolio"
        buttonTitle="Add new email"
        showLoader={show_loader}
        loaderData={{
          loadingText,
        }}
        goBack={() => { this.sendEvents('back'); this.navigate('external_portfolio');}}
        noHeader={show_loader}
      >
        <div style={{ marginBottom: '20px' }}>
          {emails.map(email => (
            <EmailExpand
              key={email.email}
              allowRemove={email.allowRemove}
              parent={this}
              comingFrom="settings"
              emailForwardedHandler={() => this.emailForwardedHandler(email.email)}
              clickRemoveEmail={() => this.openRemoveConfirm(email)}
              email={email}
            />
          ))}
        </div>
        <PopUp
          openPopup={this.state.openPopup}
          cancelText="Cancel"
          okText="Remove Email"
          handleNo={this.cancelRemoveOp}
          handleYes={this.removeEmail}
          handleClose={this.cancelRemoveOp}
        >
          Do you want to remove this email from the portfolio tracker?
        </PopUp>
      </Container>
    );
  }
}