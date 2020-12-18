import { Button, CircularProgress, ClickAwayListener } from 'material-ui';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { navigate as navigateFunc } from '../common/commonFunctions';
import { logout } from '../common/ApiCalls';
import toast from '../../common/ui/Toast';
import { storageService } from '../../utils/validators';
import { nativeCallback } from '../../utils/native_callback';

const IwdProfile = (props) => {
  const name = storageService().get('iwd-user-name') || '';
  const email = storageService().get('iwd-user-email') || '';
  let mobile = storageService().get('iwd-user-mobile') || '';
  mobile = mobile ? `+91-${mobile}` : '';
  const pan = storageService().get('iwd-user-pan') || '';
  const navigate = navigateFunc.bind(props);
  const [expanded, setExpanded] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const sendEvents = (user_action, props) => {
    let eventObj = {
      "event_name": 'internal dashboard hni',
      "properties": {
        screen_name: 'landing page',
        "user_action": user_action,
        ...props,
      }
    };
    nativeCallback({ events: eventObj });
  };

  const toggleExpanded = () => setExpanded(!expanded);

  const logoutUser = async () => {
    try {
      setLoggingOut(true);
      await logout();
      sendEvents('logout');
      navigate('login');
    } catch (err) {
      console.log(err);
      toast(err);
    }
    setLoggingOut(false);
  };

  const profileIcon = (
    <div id='iwd-profile-icon' onClick={!expanded ? toggleExpanded : undefined}>
      {name.charAt(0)}
    </div>
  );

  if (expanded) {
    return (
      <ClickAwayListener onClickAway={toggleExpanded}>
        <div id='iwd-profile' className="iwd-fade">
          {profileIcon}
          <div className='iwd-profile-username'>{name}</div>
          <div className='iwd-profile-detail' id='pan'>
            <b>PAN: </b>
            {pan || '--'}
          </div>
          <div className='iwd-profile-detail'>
            <b>Email: </b>
            {email}
          </div>
          <div className="iwd-profile-detail">
            <b>Mob.:</b>
            {'  '}{mobile || '--'}
          </div>
          <div id='iwd-profile-divider'></div>
          <Button
            fullWidth={true}
            onClick={logoutUser}
            classes={{
              root: 'iwd-profile-logout',
              label: 'iwd-profile-logout-text',
            }}
          >
            {loggingOut ? <CircularProgress size={25} /> : 'Logout'}
          </Button>
        </div>
      </ClickAwayListener>
    );
  }
  return (
    <div id="iwd-profile-short">
      <div style={{
        marginRight: '10px',
      }}>
        <div id="iwd-ps-name">
          {name}
        </div>
        <div id="iwd-ps-contact">
          {mobile || email || '--'}
        </div>
      </div>
      {profileIcon}
    </div>
  );
};

export default withRouter(IwdProfile);
