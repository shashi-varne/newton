// common for both mobile view and web view

import React, { useState, useEffect } from "react";
import { Button } from "material-ui";
import TextField from "material-ui/TextField";
import Dialog from "common/ui/Dialog";
import FormControl from "@material-ui/core/FormControl";
import WrButton from "../common/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { formatDateAmPm } from 'utils/validators';
import { fetchEmails, requestStatement } from "../common/ApiCalls";
import toast from "../../common/ui/Toast";
import { IconButton } from "material-ui";
import { regenTimeLimit } from "../constants";
import { CircularProgress } from "@material-ui/core";
import { validateEmail } from "../../utils/validators";
import WrTooltip from "../common/WrTooltip";

export default function EmailList(props) {
  const [accounts, setAccounts] = useState([]);
  const [emailListModal, toggleEmailListModal] = useState(false);
  const [openTooltip, toggleToolTip] = useState(false);
  const [addEmailModal, toggleEmailModal] = useState(false);
  const [emailAddedModal, toggleEmailAddedModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
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
      if (!validateEmail(email)) {
        return setEmailErr('Please enter a valid email');
      } else {
        setLoading(true);
        await requestStatement({ email }); 
        await fetchEmailList();
      }
    } catch(err) {
      console.log(err);
      toast(err);
    }
    setLoading(false);
    toggleEmailModal(false);
    toggleEmailAddedModal(true);
  };

  const handleInput = (e) => {
    setEmailErr('');
    setEmail(e.target.value);
  };

  const handleTooltipClose = (event = {}, toggleFunction) => {
    var path = event.path || (event.composedPath && event.composedPath());
    if (!event || !path) return;
    // If click event is triggered from within tooltip, skip it
    const clickInsideTooltip = path.find((element) =>
      element.nodeName === 'DIV' && element.classList.contains("wr-accounts")
    );
    const clickAddEmail = path.find((element) =>
      element.nodeName === 'DIV' && element.classList.contains("wr-add-email-btn")
    );
    if (!clickAddEmail && clickInsideTooltip) return;
    toggleFunction(false);
  };

  const resyncEmail = async(account) => {
    const { latest_statement, email } = account;
    try {
      const syncIndex = accounts.findIndex(account => account.email === email);
      if (isSyncing === syncIndex) return; // To prevent triggering of duplicate sync requests
      setSyncLoad(syncIndex);
      
      const props = { email };
      if (latest_statement.statement_status === 'success') {
        props.resync = 'true';
      } else {
        props.statement_id = latest_statement.statement_id;
        props.retrigger = 'true';
      }
      await requestStatement(props);

      setTimeout(() => {
        setSyncLoad('');
        fetchEmailList();
      }, 10000);
    } catch(err) {
      console.log(err);
      setSyncLoad('');
      toast(err);
    }
  };

  const getSyncStatus = (email) => {
    const { statement_status } = email.latest_statement;
    const statusMap = {
      init: 'Wait for statement email to be requested',
      requested: 'Forward the CAMS email to cas@fisdom.com',
      success: 'Synced successfully',
      failed: 'Statement processing failed. Please initiate resync',
      processing: 'Processing the statement received',
      parsing: 'Processing the statement received',
      invalid_statement_uploded: 'Invalid statement received. Try again',
    };
    return statusMap[statement_status] || 'Sync Pending';
  };

  // will render Listing of emails
  const EmailListElement = (
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
      {!!accounts.length && 
        <div id="wr-all-emails" style={{ margin: "28px 0 0" }}>
          <div className="wr-email-list-title">All emails</div>
          {accounts.map((account, index) => (
            <div className="wr-mails" key={index}>
              <div>
                <div className="wr-eli-email">{account.email}</div>
                {account.latest_statement.statement_status === 'success' &&
                  <div className="wr-eli-sync-date">
                    {`Last successful sync: ${formatDateAmPm(account.latest_success_statement.dt_updated)}`}
                  </div>
                }
                {account.latest_statement.statement_status !== 'success' &&
                  <div className="wr-eli-sync-status">
                    {getSyncStatus(account)}
                  </div>
                }
              </div>
              {/* Checking if regenerate time limit has elapsed in order to show resync option */}
              { 
                (new Date() - new Date(account.latest_statement.dt_updated)) / 60000 >= regenTimeLimit &&
                <IconButton onClick={() => resyncEmail(account)} disabled={isSyncing === index}>
                  <img
                    src={require(`assets/fisdom/ic-email-sync.svg`)}
                    alt="resync"
                    className={isSyncing === index ? "wr-rotate" : ""}
                  />
                </IconButton>
              }
            </div>
          ))}
        </div>
      }
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
        Add the email address to track that you want to track on the fisdom platform
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
      {!!emailErr && <div style={{
          marginTop: "10px",
          color: "red",
          letterSpacing: "0.5px"
        }}>
        {emailErr}
        </div>
      }

      <div className="wr-btn">
        <Button className="wr-cancel-btn" onClick={handleClose} disabled={isLoading}>
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
  const renderEmailAdded = (
    <div className="wr-email-added">
      <img src={require(`assets/fisdom/ic-mob-success.svg`)} alt="success" />
      <div className="wr-content">Sync successfully initiated for {email}. Forward the CAMS email to <b>cas@fisdom.com</b></div>
      <Button className="wr-email-continue-btn" onClick={handleClose} fullWidth={true}>
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
      <WrTooltip
        trigger={emailIcon}
        tipContent={EmailListElement}
        onClickAway={handleTooltipClose}
        content={EmailListElement}
        forceDirection={true}
        openOnClick={true}
        tooltipClass="wr-email-list"
      />

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
          {renderEmailAdded}
        </Dialog>
      )}
    </React.Fragment>
  );
};
