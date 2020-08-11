// common for both mobile view and web view

import React, { Component } from "react";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Dialog from "common/ui/Dialog";
import FormControl from "@material-ui/core/FormControl";
import WrButton from "../common/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { isMobileDevice } from "utils/functions";
import Tooltip from "common/ui/Tooltip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

class EmailListMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: ["Abishmathew21@yahoo.co.in", "Abishmathew21@yahoo.co.in"],
      addEmail: false,
      emailListModal: false,
      openTooltip: false,
      addEmailModal: false,
      emailAddedModal: false,
      emailAdded: false,
      mailInput: "",
    };
  }

  handleClick = () => {
    this.setState({
      addEmail: true,
      openTooltip: false,
      addEmailModal: true,
    });
  };

  handleClose = () => {
    this.setState({
      addEmailModal: false,
      emailAddedModal: false,
      emailListModal: false,
    });
  };

  addMail = () => {
    this.setState({
      emailAdded: true,
      bottom: false,
      addEmailModal: false,
      emailAddedModal: true,
    });
  };

  handleInput = (e) => {
    this.setState({
      mailInput: e.target.value,
    });
  };

  handleTooltipClose = () => {
    this.setState({
      openTooltip: false
    })
  }

  // will render Listing of emails
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

  // will display a form to add the email 
  renderAddEmail = () => (
    <div className="wr-add-mail">
      <div className="wr-new-email">
        <img src={require(`assets/fisdom/ic-mob-emails.svg`)} alt="" />
        <div style={{ marginLeft: "12px" }}>Add new email</div>
      </div>

      <div className="wr-mail-content">
        Add the email address that you want to track on the fisdom platform and
        we will share the insights
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
        <Button className="wr-cancel-btn" onClick={this.handleClose}>
          Cancel
        </Button>

        <Button className="wr-add-btn" onClick={this.addMail}>
          Add email
        </Button>
      </div>
    </div>
  );

  // will render successfully added email modal
  renderEmailAdded = () => (
    <div className="wr-email-added">
      <img src={require(`assets/fisdom/ic-mob-success.svg`)} alt="" />
      <div className="wr-content">Email has been added successfully!</div>
      <div className="wr-continue" onClick={this.handleClose}>
        Continue
      </div>
    </div>
  );

  render() {
    const email = (
      <img
        src={require(`assets/fisdom/ic-emails.svg`)}
        alt=""
        style={{
          height: isMobileDevice() && "30px",
          width: isMobileDevice() && "30px",
        }}
        onClick={() =>
          this.setState({
            openTooltip: !this.state.openTooltip,
            emailListModal: !this.state.emailListModal,
          })
        }
      />
    );

    return (
      <React.Fragment>
        {!isMobileDevice() ? (
          // will show the tooltip not a mobile device else modal for mobile view
          <ClickAwayListener onClickAway={this.handleTooltipClose}>
            <Tooltip
              content={this.renderEmailList()}
              isOpen={this.state.openTooltip}
              direction="down"
              forceDirection
            >
              {email}
            </Tooltip>
          </ClickAwayListener>
        ) : (
          //mobile view
          <React.Fragment>
            {email}
            <Dialog
              open={this.state.emailListModal}
              onClose={this.handleClose}
              classes={{ paper: "wr-dialog-paper" }}
            >
              {this.renderEmailList()}
            </Dialog>
          </React.Fragment>
        )}

        {this.state.addEmail && (
          //common for both mobile and webview
          <Dialog
            open={this.state.addEmailModal}
            onClose={this.handleClose}
            classes={{ paper: "wr-dialog-paper" }}
          >
            {this.renderAddEmail()}
          </Dialog>
        )}

        {this.state.emailAdded && (
          //common for both mobile and webview
          <Dialog
            open={this.state.emailAddedModal}
            onClose={this.handleClose}
            classes={{ paper: "wr-dialog-paper" }}
          >
            {this.renderEmailAdded()}
          </Dialog>
        )}
      </React.Fragment>
    );
  }
}

export default EmailListMobile;
