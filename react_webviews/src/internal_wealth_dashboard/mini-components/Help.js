import { Button } from 'material-ui';
import React, { memo } from 'react';
import { getConfig } from 'utils/functions';
// ---------- Image Imports ------------
import fisdomLogo from 'assets/fisdom/fisdom_logo_white.svg';
import close from 'assets/ic_close_white.svg';
import banner from 'assets/fisdom/its_help.svg';
import bannerMob from 'assets/fisdom/its_help_mob.svg';
import IcSebi from '../../assets/fisdom/ic_sebi_transparent.svg';
import IcAMFI from '../../assets/fisdom/ic_amfi_white.svg';
import IcBSE from '../../assets/fisdom/ic_bse_white.svg';
// -------------------------------------
const isMobileView = getConfig().isMobileDevice;

const HelpPage = (props) => {
  window.scrollTo(0, 0);
  return (
    <div id="iwd-help" className={props.className}>
      <h1>Help</h1>
      <p>
        Don’t worry! Managing money can be stressful at times. We are always
        here to help you.
      </p>
      <Button
        variant="flat"
        onClick={props.onClose}
        classes={{
          root: 'iwd-help-close',
        }}
      >
        <img src={close} alt="close" />
      </Button>
      <div className="iwd-help-contact">
        <span>MAIL US</span>
        ask@fisdom.com
      </div>
      <div className="iwd-help-contact">
        <span>CALL US</span>
        +91 804 809 3070
      </div>
      <img
        src={isMobileView ? bannerMob : banner}
        alt=""
        className="iwd-help-banner"
      />
      <div id="iwd-help-footer">
        <img src={fisdomLogo} alt="fisdom" id="iwd-help-fisdom-logo" />
        <div>
          <picture>
            <img src={IcSebi} alt="SEBI" />
            <small>SEBI registered investment advisor INA200005323</small>
          </picture>
          <picture>
            <img src={IcAMFI} alt="AMFI" />
            <small>Association of Mutual Funds of India registered mutual fund distributor ARN:103168</small>
          </picture>
          <picture>
            <img src={IcBSE} alt="BSE" />
            <small>
            BSE registered mutual fund distributor mutual fund code no:10140
            </small>
          </picture>
        </div>
      </div>
    </div>
  );
};

export default memo(HelpPage);
