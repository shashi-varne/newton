import React, { Component } from 'react';
import btm_mail_check_f from '../../assets/fisdom/btm_mail_check.svg';
import btm_mail_check_m from '../../assets/myway/btm_mail_check.svg';
import { Drawer, Button } from 'material-ui';
import { getConfig } from '../../utils/functions';
import { navigate } from '../common/commonFunctions';

const productType = getConfig().productName;

export default class RegenerateOptsPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigate = navigate.bind(this);
  }

  render() {
    return (
      <Drawer
        anchor="bottom"
        open={this.props.open}
        onClose={this.props.onPopupClose}
        variant="temporary">
        <div className="statement-req-popup">
          <img
            alt="mail-check"
            src={productType === 'fisdom' ? btm_mail_check_f : btm_mail_check_m}
            id="btm_mail_check_img"
          />
          <span className="header-title-text">
            Reconfirming the <br />status of CAS email
          </span>
          <Button
            variant="outlined" color="secondary" fullWidth={true}
            classes={{
              root: 'gen-statement-btn',
              label: 'gen-statement-btn-label'
            }}
            onClick={this.props.forwardedClick}
          >
            CAS EMAIL FORWARDED
          </Button>
          <Button
            variant="outlined" color="secondary" fullWidth={true}
            classes={{
              root: 'gen-statement-btn',
              label: 'gen-statement-btn-label'
            }}
            onClick={this.props.notReceivedClick}
          >
            CAS EMAIL NOT RECIEVED
          </Button>
        </div>
      </Drawer>
    );
  }
}
