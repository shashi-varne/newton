/* eslint-disable no-ex-assign */
import React, { useState } from 'react';
import { TextField, CircularProgress } from 'material-ui';
import { requestStatement } from '../common/ApiCalls';
import toast from '../../common/ui/Toast';
import { storageService, validateEmail } from '../../utils/validators';

export default function NoPan(props) {
  const [syncClicked, clickSync] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState(false);
  const [emailAdded, setEmailAdded] = useState(
    storageService().get('wr-email-added')
  );

  const handleInput = (e) => {
    setEmailErr('');
    setEmail(e.target.value);
  };
  
  const addEmail = async() => {
    try {
      if (!validateEmail(email)) {
        setEmailErr('Please enter a valid email');
      } else {
        setLoading(true);
        await requestStatement({ email });
        setEmailAdded(email);
        storageService().set('wr-email-added', email);
      }
    } catch (err) {
      console.log(err);
      if (!err.includes('try again')) {
        err += '. Try Again';
      }
      toast(err);
    }
    setLoading(false);
  };

  const buttonContent = () => {
    if (isLoading) {
      return <CircularProgress size={20} />;
    } else if (syncClicked) {
      return <span onClick={addEmail} style={{ cursor: 'pointer' }}>Sync</span>;
    } else {
      return <span style={{ cursor: 'pointer' }}>Sync Email</span>;
    }
  };

  // Added key to div below to prevent React from caching it and causing animations to not replay
  const renderRequestSent = (
    <div id="wr-no-pan-screen" key={emailAdded}>
      <div className="wr-no-pan-content-head animated animatedFadeInUp fadeInUp">Email Sync Request Successful.</div>
      <div className="wr-no-pan-content animated animatedFadeInUp fadeInUp">
        Within the next 24 hours, you will receive a statement email on
        <b> {emailAdded}</b> from CAMS. Please <b>forward the email</b> to us at
        <b> cas@fisdom.com</b>
      </div>
      <div className="wr-no-pan-content animated animatedFadeInUp fadeInUp">
        Once forwarded, wait 5 to 10 minutes for us to set up your portfolio and refresh the page to get started.
      </div>
    </div>
  );

  const renderNoPans = (
    <div id="wr-no-pan-screen" >
      <div className="wr-no-pan-content-head animated animatedFadeInUp fadeInUp">
        NO ACTIVE PANS FOUND.
      </div>
      <div
        className="animated animatedFadeInUp fadeInUp"
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <div className="wr-no-pan-content">
          Syncing an Investment Email is a good first step!
        </div>
        <div
          style={{ textAlign: 'left' }}>
          <div
            onClick={() => clickSync(true)}
            className={`wr-no-pan-back ${syncClicked ? 'expand' : ''}`}>
            {syncClicked &&
              <TextField
                disabled={isLoading}
                autoFocus={true}
                placeholder="Enter Email"
                InputProps={{
                  disableUnderline: true,
                  classes: {
                    input: 'wr-no-pan-input',
                  },
                }}
                onChange={(e) => handleInput(e)}
              ></TextField>
            }
            {buttonContent()}
          </div>
          {!!emailErr && <div style={{
              marginTop: "10px",
              color: "red",
              letterSpacing: "0.5px",
              fontSize: '14px',
            }}>
              {emailErr}
            </div>
          }
        </div>
      </div>
    </div>
  );

  return emailAdded ? renderRequestSent : renderNoPans;
};