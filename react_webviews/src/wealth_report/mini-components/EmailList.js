// common for both mobile view and web view

import React, { useState, useEffect } from "react";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Dialog from "common/ui/Dialog";
import FormControl from "@material-ui/core/FormControl";
import WrButton from "../common/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { isMobileDevice } from "utils/functions";
import Tooltip from "common/ui/Tooltip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { fetchEmails } from "../common/ApiCalls";
import toast from "../../common/ui/Toast";

export default function EmailList(props) {
  const [accounts, setAccounts] = useState([]);
  const [addEmail, setAddEmail] = useState(false);
  const [emailListModal, toggleEmailListModal] = useState(false);
  const [openTooltip, toggleToolTip] = useState(false);
  const [addEmailModal, toggleEmailModal] = useState(false);
  const [emailAddedModal, toggleEmailAddedModal] = useState(false);
  const [emailAdded, setEmailAdded] = useState(false);
  const [mailInput, setMailInput] = useState("");

  useEffect(() => {
    (async() => {
      try {
        const data = await fetchEmails();
        setAccounts(data);
      } catch (err) {
        console.log(err);
        toast(err);
      }
    })();
  },[]);

  const handleClick = () => {
    setAddEmail(true);
    toggleEmailModal(true);
    toggleToolTip(false)
  };

  const handleClose = () => {
    toggleEmailModal(false);
    toggleEmailAddedModal(false);
    toggleEmailListModal(false)
  };

  const addMail = () => {
    setEmailAdded(true);
    toggleEmailModal(false);
    toggleEmailAddedModal(true)
  };

  const handleInput = (e) => {
    setMailInput(e.target.value);
  };

  const handleTooltipClose = () => {
    toggleToolTip(false)
  };

  // will render Listing of emails
  const renderEmailList = () => (
    <div className="wr-accounts">
      <WrButton
        fullWidth={true}
        classes={{ root: "wr-add-email-btn" }}
        onClick={() => handleClick()}
      >
        <AddCircleOutlineIcon
          style={{ fontSize: "18px", marginRight: "10px" }}
        />
        Add new Email
      </WrButton>
      <div style={{ margin: "28px 10px 0 10px" }}>
        <div className="wr-email-list-title">All emails</div>
        {accounts.map((account, index) => (
          <div className="wr-mails" key={index}>
            <div>
              <div className="wr-eli-email">account.email</div>
              <div className="wr-eli-sync">{`Synced on ${account.latest_success_statement.dt_updated}`}</div>
            </div>
            <img src={require(`assets/fisdom/ic-email-sync.svg`)} alt="" />
          </div>
        ))}
      </div>
    </div>
  );

  // will display a form to add the email
  const renderAddEmail = (
    <div className="wr-add-mail">
      {/* visibility will be modified based on the condition in media queries */}
      <div className="wr-new-email">
        <img src={require(`assets/fisdom/ic-mob-emails.svg`)} alt="" />
        <div style={{ marginLeft: "12px" }}>Add new email</div>
      </div>

      <div className="wr-mail-content">
        Add the email address that you want to track on the fisdom platform and
        we will share the insights
      </div>

      <FormControl className="wr-form">
        <TextField
          variant="outlined"
          placeholder="Enter new email..."
          InputProps={{
            disableUnderline: true,
            // className: "wr-input-addmail",
          }}
          classes={{ root: "wr-input-addmail" }}
          onChange={(e) => handleInput(e)}
        />
      </FormControl>

      <div className="wr-btn">
        <Button className="wr-cancel-btn" onClick={() => handleClose()}>
          Cancel
        </Button>

        <Button className="wr-add-btn" onClick={() => addMail()}>
          Add email
        </Button>
      </div>
    </div>
  );

  // will render successfully added email modal
  const renderEmailAdded = () => (
    <div className="wr-email-added">
      <img src={require(`assets/fisdom/ic-mob-success.svg`)} alt="" />
      <div className="wr-content">Email has been added successfully!</div>
      <div className="wr-continue" onClick={() => handleClose()}>
        Continue
      </div>
    </div>
  );

  const email = (
    <img
      src={require(`assets/fisdom/ic-emails.svg`)}
      alt=""
      id="wr-account-img"
      onClick={() => {
        toggleToolTip(!openTooltip);
        toggleEmailListModal(!emailListModal);
      }}
    />
  );

  return (
    <React.Fragment>
      {!isMobileDevice() ? (
        // will show the tooltip for desktop view and dialog box for the mobile view
        <ClickAwayListener onClickAway={() => handleTooltipClose()}>
          <Tooltip
            content={renderEmailList()}
            isOpen={openTooltip}
            direction="down"
            forceDirection
            className="wr-email-list"
          >
            {email}
          </Tooltip>
        </ClickAwayListener>
      ) : (
        //mobile view
        <React.Fragment>
          {email}
          <Dialog
            open={emailListModal}
            onClose={() => handleClose()}
            classes={{ paper: "wr-dialog-paper" }}
          >
            {renderEmailList()}
          </Dialog>
        </React.Fragment>
      )}

      {addEmail && (
        //common for both mobile and webview
        <Dialog
          open={addEmailModal}
          onClose={() => handleClose()}
          classes={{ paper: "wr-dialog-paper" }}
        >
          {renderAddEmail}
        </Dialog>
      )}

      {emailAdded && (
        //common for both mobile and webview
        <Dialog
          open={emailAddedModal}
          onClose={() => handleClose()}
          classes={{ paper: "wr-dialog-paper" }}
        >
          {renderEmailAdded()}
        </Dialog>
      )}
    </React.Fragment>
  );
};
