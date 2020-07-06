import React, { Component } from 'react';
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
            src={require(`assets/${productType}/btm_mail_check.svg`)}
            id="btm_mail_check_img"
          />
          <span className="header-title-text">
            What is the status of the<br /> CAS email?
          </span>
          <Button
            variant="outlined" color="secondary" fullWidth={true}
            classes={{
              root: 'gen-statement-btn',
              label: 'gen-statement-btn-label'
            }}
            onClick={this.props.emailForwardedHandler}
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
