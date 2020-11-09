import { Button } from 'material-ui';
import React, { memo } from 'react';
// ---------- Image Imports ------------
import fisdomLogo from 'assets/fisdom/fisdom_logo.png';
import close from 'assets/ic_close.svg';
// -------------------------------------

const HelpPage = (props) => {
  window.scrollTo(0, 0);
  return (
    <div id="iwd-help" className={props.className}>
      <h1>Help</h1>
      <p>
        Don’t worry! Managing money can be stressful at times.
        We are always here to help you.
      </p>
      <Button
        variant="flat"
        onClick={props.onClose}
        classes={{
          root: 'iwd-help-close'
        }}
      >
        <img src={close} alt="close" />
      </Button>
      <div className="iwd-help-contact">
        <span>
          Mail us
        </span>
        ask@fisdom.com
      </div>
      <div className="iwd-help-contact">
        <span>
          Call us
        </span>
        +91 804 809 3070
      </div>
      <div id="id-help-banner-img"></div>
      <div id="iwd-help-footer">
        <img src={fisdomLogo} alt="fisdom" id="iwd-help-fisdom-logo" />
        <img src={fisdomLogo} alt="fisdom" />
        <img src={fisdomLogo} alt="fisdom" />
        <img src={fisdomLogo} alt="fisdom" />
      </div>
    </div>
  );
};

export default memo(HelpPage);