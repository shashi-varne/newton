import { Button, CircularProgress } from 'material-ui';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { navigate as navigateFunc } from '../common/commonFunctions';
import { logout } from '../common/ApiCalls';
import toast from '../../common/ui/Toast';

const IwdProfile = (props) => {
  const navigate = navigateFunc.bind(props);
  const [expanded, setExpanded] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const logoutUser = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate('login');
    } catch (err) {
      console.log(err);
      toast(err);
    }
    setLoggingOut(false);
  };

  if (expanded) {
    return (
      <div className="iwd-profile" onClick={toggleExpanded}>
        <div className="iwd-profile-icon iwd-profile-icon__primary">U</div>
        <div className="iwd-profile-username">Uttam Paswan</div>
        <div className="iwd-profile-detail" id="pan">
          <b>PAN: </b>
          CXIPP 4122 M
        </div>
        <div className="iwd-profile-detail">
          <b>Email: </b>
          uttam@fisdom.com
        </div>
        <div className="iwd-profile-detail">
          <b>Mob.: </b>
          +91-8800927468
        </div>
        <div id="iwd-profile-divider"></div>
        <Button
          fullWidth={true}
          onClick={logoutUser}
          classes={{
            root: 'iwd-profile-logout',
            label: 'iwd-profile-logout-text',
          }}>
          {loggingOut ?
            <CircularProgress size={25} /> : 'Logout'
          }
        </Button>
      </div>
    );
  }
  return (
    <div className={props.secondary ? 'iwd-profile-icon' : 'iwd-profile-icon iwd-profile-icon__primary'} onClick={toggleExpanded}>U</div>
  );
};

export default withRouter(IwdProfile);