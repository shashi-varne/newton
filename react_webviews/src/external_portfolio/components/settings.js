import React, { Component } from 'react';
import Container from '../common/Container';
import EmailExpand from '../mini-components/EmailExpand';
import toast from '../../common/ui/Toast';
import { fetchEmails, fetchStatements, deleteEmail } from '../common/ApiCalls';
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

  getData = async () => {
    this.setLoader(true);
    const emails = await fetchStatements();
    this.setState({ emails });
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
      await deleteEmail({ email_id: this.state.email_to_remove });
      // TODO: Instead of calling fetch API, do a remove from array manually, will be quicker
      await this.getData();
    } catch (err) {
      console.log(err);
      toast(err);
    }
  }

  render() {
    const { emails, show_loader } = this.state;
    return (
      <Container
        title="Investment email ids"
        handleClick={() => this.navigate('email_entry', {comingFrom: 'settings'})}
        subtitle="Resync to track the recent transactions in your portfolio"
        buttonTitle="Add new email"
        showLoader={show_loader}
        goBack={() => this.navigate('external_portfolio')}
        noHeader={show_loader}
      >
        {emails.map(email => (
          <EmailExpand
            key={email.email_id}
            parent={this}
            comingFrom="settings"
            clickRemoveEmail={() => this.openRemoveConfirm(email.email_id)}
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