import { Button, CircularProgress, ClickAwayListener } from 'material-ui';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { navigate as navigateFunc } from '../common/commonFunctions';
import { logout } from '../common/ApiCalls';
import toast from '../../common/ui/Toast';
import { storageService } from '../../utils/validators';
import { nativeCallback } from '../../utils/native_callback';

const IwdProfile = (props) => {
  const navigate = navigateFunc.bind(props);
  const [userDetail, setUserDetail] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const initialiseUserData = () => {
    let mobile = storageService().get('iwd-user-mobile') || '';
    mobile = mobile ? `+91-${mobile}` : '';
    setUserDetail({
      name: storageService().get('iwd-user-name') || '',
      email: storageService().get('iwd-user-email') || '',
      pan: storageService().get('iwd-user-pan') || '',
      mobile,
    });
  };

  useEffect(() => {
    // Time delay for following fix https://fisdom.atlassian.net/browse/QA-2497
    setTimeout(initialiseUserData, 500);
  }, []);

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
      {(userDetail.name || '').charAt(0)}
    </div>
  );

  if (expanded) {
    return (
      <ClickAwayListener onClickAway={toggleExpanded}>
        <div id='iwd-profile' className="iwd-fade">
          {profileIcon}
          <div className='iwd-profile-username'>{userDetail.name}</div>
          <div className='iwd-profile-detail' id='pan'>
            <b>PAN: </b>
            {userDetail.pan || '--'}
          </div>
          <div className='iwd-profile-detail'>
            <b>Email: </b>
            {userDetail.email}
          </div>
          <div className="iwd-profile-detail">
            <b>Mob.:</b>
            {'  '}{userDetail.mobile || '--'}
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
          {userDetail.name || '--'}
        </div>
        <div id="iwd-ps-contact">
          {userDetail.mobile || userDetail.email || '--'}
        </div>
      </div>
      {profileIcon}
    </div>
  );
};

export default withRouter(IwdProfile);
