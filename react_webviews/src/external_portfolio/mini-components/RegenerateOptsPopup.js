import React, { Component } from 'react';
import { Drawer, Button } from 'material-ui';
import { getConfig } from '../../utils/functions';
import { navigate } from '../common/commonFunctions';
import { nativeCallback } from 'utils/native_callback';

const productType = getConfig().productName;

export default class RegenerateOptsPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigate = navigate.bind(this);
  }
  
  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'portfolio_tracker',
      "properties": {
        "user_action": user_action,
        "screen_name": 'reconfirm popup',
      }
    };
    
    if (['just_set_events', 'back'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
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
          <div
            className="header-title-text-hni"
            style={{ maxWidth: '55%', wordBreak: 'break-word' }}>
            What is the status of the CAS email?
          </div>
          <Button
            variant="outlined" color="secondary" fullWidth={true}
            classes={{
              root: 'gen-statement-btn',
              label: 'gen-statement-btn-label'
            }}
            onClick={() => { this.sendEvents('email forwarded'); this.props.emailForwardedHandler() }}
          >
            CAS EMAIL FORWARDED
          </Button>
          <Button
            variant="outlined" color="secondary" fullWidth={true}
            classes={{
              root: 'gen-statement-btn',
              label: 'gen-statement-btn-label'
            }}
            onClick={() => { this.sendEvents('email not received'); this.props.notReceivedClick() }}
          >
            CAS EMAIL NOT RECIEVED
          </Button>
        </div>
      </Drawer>
    );
  }
}
