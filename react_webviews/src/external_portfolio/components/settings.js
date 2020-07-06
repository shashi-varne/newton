import React, { Component } from 'react';
import Container from '../common/Container';
import EmailExpand from '../mini-components/EmailExpand';
import toast from '../../common/ui/Toast';
import { fetchEmails, deleteEmail } from '../common/ApiCalls';
import { storageService } from '../../utils/validators';
import { setLoader, navigate, emailForwardedHandler } from '../common/commonFunctions';
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
    this.emailForwardedHandler = emailForwardedHandler.bind(this);
  }

  getData = async () => {
    this.setLoader(true);
    const emails = await fetchEmails();
    this.setState({ emails });
    const keyedEmails = emails.reduce((emailMap, email) => {
      emailMap[email.email] = email;
      return emailMap;
    }, {});
    storageService().setObject('keyedEmails', keyedEmails);
    this.setLoader(false);
  }

  async componentDidMount() {
    try {
      await this.getData();
    } catch(err) {
      toast(err);
      this.setLoader(false);
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
      openPopup: true,
      email_to_remove: '',
    });
  }

  removeEmail = async () => {
    this.setState({ openPopup: false });
    try {
      this.setLoader(true);
      await deleteEmail({ email_id: this.state.email_to_remove });
      this.removeAndUpdateEmailList();
      this.setLoader(false);
    } catch (err) {
      console.log(err);
      toast(err);
    }
  }

  removeAndUpdateEmailList = () => {
    let { email_to_remove, emails } = this.state;
    emails = JSON.parse(JSON.stringify(emails));

    emails = emails.filter(email => email.email !== email_to_remove);
    this.setState({ emails });
  }

  checkForRemoveCtrl = (emails) => {
    /* Function to check if there are atleast 2 emails 
    with successfully updated portfolio statements */
    const activeEmails = emails.filter(email => !!email.latest_success_statement.statement_id);
    return activeEmails.length > 2;
  }

  render() {
    const { emails, show_loader, loadingText } = this.state;
    const allowRemove = this.checkForRemoveCtrl(emails);
    return (
      <Container
        title="Investment email ids"
        handleClick={() => this.navigate('email_entry', {comingFrom: 'settings'})}
        subtitle="Resync to track the recent transactions in your portfolio"
        buttonTitle="Add new email"
        showLoader={show_loader}
        loaderData={{
          loadingText,
        }}
        goBack={() => this.navigate('external_portfolio')}
        noHeader={show_loader}
      >
        {emails.map(email => (
          <EmailExpand
            key={email.email}
            allowRemove={allowRemove}
            parent={this}
            comingFrom="settings"
            emailForwardedHandler={() => this.emailForwardedHandler(email.email)}
            clickRemoveEmail={() => this.openRemoveConfirm(email.email)}
            email={email}
          />
        ))}
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