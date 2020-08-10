import React, { Component } from "react";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Dialog from "common/ui/Dialog";
import FormControl from "@material-ui/core/FormControl";
import WrButton from "../common/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { isMobileDevice } from 'utils/functions';

class EmailListMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: ["Abishmathew21@yahoo.co.in", "Abishmathew21@yahoo.co.in"],
      addEmail: false,
      open: true,
      emailAdded: false,
      mailInput: "",
    };
  }

  handleClick = () => {
    this.setState({
      addEmail: true,
    });
    this.props.onClick();
  };

  renderEmailList = () => (
    <div className="wr-accounts" style={{ width: "300px" }}>
      <WrButton
        fullWidth={true}
        classes={{ root: "wr-add-email-btn" }}
        onClick={this.handleClick}
      >
        <AddCircleOutlineIcon
          style={{ fontSize: "18px", marginRight: "10px" }}
        />
        Add new Email
      </WrButton>
      <div style={{ margin: "28px 10px 0 10px" }}>
        <div className="wr-email-list-title">All emails</div>
        {this.state.accounts.map((account, index) => (
          <div className="wr-mails" key={index}>
            <div>
              <div className="wr-eli-email">Abishmathew21@yahoo.co.in</div>
              <div className="wr-eli-sync">Synced on Jun 23, 09:45am</div>
            </div>
            <img src={require(`assets/fisdom/ic-email-sync.svg`)} alt="" />
          </div>
        ))}
      </div>
    </div>
  );

  addMail = (e) => {
    this.setState({
      emailAdded: true,
      bottom: false,
      open: true,
    });
  };

  handleInput = (e) => {
    this.setState({
      mailInput: e.target.value,
    });
  };

  renderAddEmail = () => (
    <div className="wr-add-mail">
      <div className="wr-new-email">
        <img src={require(`assets/fisdom/ic-emails.svg`)} alt="" />
        <div>Add new email</div>
      </div>

      <div className="wr-mail-content">
        Add the email address and get insights on your portfolio from fisdom
      </div>

      <FormControl fullWidth>
        <TextField
          variant="outlined"
          placeholder="Enter new email..."
          InputProps={{
            disableUnderline: true,
            className: "wr-input-addmail",
          }}
          onChange={this.handleInput}
        />
      </FormControl>

      <div className="wr-btn">
        <Button className="wr-cancel-btn">Cancel</Button>

        <Button className="wr-add-btn" onClick={this.addMail}>
          Add email
        </Button>
      </div>
    </div>
  );

  renderEmailAdded = () => (
    <div className="wr-email-added">
      <img src={require(`assets/fisdom/ic-mob-success.svg`)} alt="" />
      <div className="wr-content">Email has been added successfully!</div>
      <div className="wr-continue">Continue</div>
    </div>
  );

  render() {
    return (
      <React.Fragment>
        {!isMobileDevice() && !this.state.addEmail ? (
          this.renderEmailList()
        ) : (
          <Dialog
            open={this.props.open && this.state.open}
            onClose={this.props.onClose}
            fullWidth={true}
          >
            {this.renderEmailList()}
          </Dialog>
        )}

        {this.state.addEmail && (
          <Dialog
            open={this.props.open && this.state.open}
            onClose={this.props.onClose}
          >
            {this.renderAddEmail()}
          </Dialog>
        )}

        {this.state.emailAdded && (
          <Dialog
            open={this.props.open && this.state.open}
            onClose={this.props.onClose}
          >
            {this.renderEmailAdded()}
          </Dialog>
        )}
      </React.Fragment>
    );
  }
}

export default EmailListMobile;
