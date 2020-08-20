// common for both mobile view and web view

import React, { useState, useEffect } from "react";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Dialog from "common/ui/Dialog";
import FormControl from "@material-ui/core/FormControl";
import WrButton from "../common/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { formatDateAmPm } from 'utils/validators';
import { getConfig } from "utils/functions";
import Tooltip from "common/ui/Tooltip";
import { fetchEmails, requestStatement } from "../common/ApiCalls";
import toast from "../../common/ui/Toast";
import { IconButton } from "material-ui";
import { regenTimeLimit } from "../constants";
import { CircularProgress } from "@material-ui/core";
const isMobileView = getConfig().isMobileDevice;

export default function EmailList(props) {
  const [accounts, setAccounts] = useState([]);
  const [emailListModal, toggleEmailListModal] = useState(false);
  const [openTooltip, toggleToolTip] = useState(false);
  const [addEmailModal, toggleEmailModal] = useState(false);
  const [emailAddedModal, toggleEmailAddedModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isSyncing, setSyncLoad] = useState(false);

  const fetchEmailList = async () => {
    try {
      const data = await fetchEmails();
      setAccounts(data);
    } catch (err) {
      console.log(err);
      toast(err);
    }
  };

  useEffect(() => {
    (async() => {
      setLoading(true);
      await fetchEmailList();
      setLoading(false);
    })();
  },[]);

  const addNewEmail = () => {
    toggleEmailModal(true);
    toggleToolTip(false);
    toggleEmailListModal(false);
  };

  const handleClose = () => {
    toggleEmailModal(false);
    toggleEmailAddedModal(false);
    toggleEmailListModal(false);
  };

  const addMail = async () => {
    try {
      setLoading(true);
      await requestStatement({ email: email }); 
      await fetchEmailList();
    } catch(err) {
      console.log(err);
      toast(err);
    }
    setLoading(false);
    toggleEmailModal(false);
    toggleEmailAddedModal(true);
  };

  const handleInput = (e) => {
    setEmail(e.target.value);
  };

  const handleTooltipClose = (event) => {
    // If click event is triggered from within tooltip, skip it
    const clickInsideTooltip = event.path.find((element) =>
      element.nodeName === 'DIV' && element.classList.contains("wr-accounts")
    );
    if (clickInsideTooltip) return;
    toggleToolTip(false);
  };

  const resyncEmail = async(email) => {
    try {
      setSyncLoad(true);
      await requestStatement({
        email: email,
        resync: 'true',
      });
      await fetchEmailList();
    } catch(err) {
      console.log(err);
      toast(err);
    }
    setSyncLoad(false);
  };

  // will render Listing of emails
  const renderEmailList = () => (
    <div className="wr-accounts">
      <Button
        fullWidth={true}
        classes={{ root: "wr-add-email-btn" }}
        onClick={addNewEmail}
      >
        <AddCircleOutlineIcon
          style={{ fontSize: "18px", marginRight: "10px" }}
        />
        Add new Email
      </Button>
      <div style={{ margin: "28px 10px 0 10px" }}>
        <div className="wr-email-list-title">All emails</div>
        {accounts.map((account, index) => (
          <div className="wr-mails" key={index}>
            <div>
              <div className="wr-eli-email">{account.email}</div>
              <div className="wr-eli-sync">
                {`Synced on ${formatDateAmPm(account.latest_statement.dt_updated)}`}</div>
            </div>
            {/* Checking if regenerate time limit has elapsed in order to show resync option */}
            { 
              (new Date() - new Date(account.latest_statement.dt_updated)) / 60000 >= regenTimeLimit &&
              <IconButton onClick={() => resyncEmail(account.email)}>
                <img src={require(`assets/fisdom/ic-email-sync.svg`)} alt="resync" />
              </IconButton>
            }
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
        <Button className="wr-cancel-btn" onClick={handleClose}>
          Cancel
        </Button>

        <WrButton className="wr-add-btn" onClick={addMail} disabled={isLoading}>
          {isLoading ?
            <CircularProgress size={20} thickness={4} color="white" /> :
            'Add email'
          }
        </WrButton>
      </div>
    </div>
  );

  // will render successfully added email modal
  const renderEmailAdded = () => (
    <div className="wr-email-added">
      <img src={require(`assets/fisdom/ic-mob-success.svg`)} alt="success" />
      <div className="wr-content">Email has been added successfully!</div>
      <Button className="wr-continue-btn" onClick={handleClose} fullWidth={true}>
        Okay
      </Button>
    </div>
  );

  const emailIcon = (
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
      {!isMobileView ? (
        // will show the tooltip for desktop view and dialog box for the mobile view
        <Tooltip
          onClickAway={handleTooltipClose}
          content={renderEmailList()}
          isOpen={openTooltip}
          direction="down"
          forceDirection
          className="wr-email-list"
        >
          {emailIcon}
        </Tooltip>
      ) : (
        //mobile view
        <React.Fragment>
          {emailIcon}
          <Dialog
            open={emailListModal}
            onClose={handleClose}
            classes={{ paper: "wr-dialog-paper" }}
          >
            {renderEmailList()}
          </Dialog>
        </React.Fragment>
      )}

      {addEmailModal && (
        //common for both mobile and webview
        <Dialog
          open={addEmailModal}
          onClose={handleClose}
          classes={{ paper: "wr-dialog-paper" }}
        >
          {renderAddEmail}
        </Dialog>
      )}

      {emailAddedModal && (
        //common for both mobile and webview
        <Dialog
          open={emailAddedModal}
          onClose={handleClose}
          classes={{ paper: "wr-dialog-paper" }}
        >
          {renderEmailAdded()}
        </Dialog>
      )}
    </React.Fragment>
  );
};
