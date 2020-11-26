// -------------------- Assets ------------------
import close from 'assets/ic_close_white.svg';
import fisdom_logo from 'assets/fisdom/fisdom_logo.png';
// ----------------------------------------------
import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, CircularProgress } from 'material-ui';
import MenuIcon from '@material-ui/icons/Menu';
import { logout } from '../common/ApiCalls';
import { navigate as navigateFunc } from '../common/commonFunctions';
import toast from '../../common/ui/Toast';
const allTabs = ['dashboard', 'analysis', 'holdings', 'recommendations', 'statements'];

const NavBarMobile = (props) => {
  const { match = {} } = props;
  const navigate = navigateFunc.bind(props);
  const [expanded, setExpanded] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { params: { tab: currentTab = 'dashboard' }} = match;

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

  return (
    <div
      id="iwd-nav-mob"
      style={{
        height: expanded ? '100vh' : '',
        borderRadius: expanded ? '0' : '',
      }}>
      {!expanded ?
        <div id="iwd-nm-header">
          <img src={fisdom_logo} id="iwd-nmh-fisdom-logo" alt="fisdom" />
          <Button className="iwd-nmh-menu" onClick={() => setExpanded(true)}>
            <MenuIcon fontSize="inherit" />
            <span id="iwd-nmhm-text">Menu</span>
          </Button>
          <div id="iwd-nmh-profile" onClick={() => setExpanded(true)}>
            U
          </div>
        </div> :
        <div id="iwd-nm-body">
          <Button
            variant="flat"
            onClick={() => setExpanded(false)}
            classes={{
              root: 'iwd-nav-close'
            }}
          >
            <img src={close} alt="close" />
          </Button>
          {allTabs.map(tab =>
            <Link to={tab} onClick={() => setExpanded(false)}>
              <div
                className={`
                iwd-nmb-link
                ${currentTab === tab ? 'selected' : ''}
              `}>
                <div className="iwd-nmbl-label">{tab}</div>
                <div className="iwd-nmbl-desc">Easy view for all your investments</div>
              </div>
            </Link>
          )}
          <div id="iwd-nmb-divider" />
          <div id="iwd-nmb-profile">
            <div id="iwd-nmp-user-name">Uttam Paswan</div>
            <div id="iwd-nmp-user-icon">U</div>
            <div className="iwd-nmp-user-detail">
              <b>PAN: </b>
              CXIPP 4122 M
            </div>
            <div className="iwd-nmp-user-detail">
              <b>Email: </b>
              uttam@fisdom.com
            </div>
            <div className="iwd-nmp-user-detail">
              <b>Mob.: </b>
              +91-8800927468
            </div>
          </div>
          <Button
            fullWidth={true}
            onClick={logoutUser}
            classes={{
              root: 'iwd-nmb-logout',
              label: 'iwd-nmb-logout-text',
            }}
          >
            {loggingOut ?
              <CircularProgress size={25} /> : 'Logout'
            }
        </Button>
        </div>
      }
    </div>
  );
};

export default withRouter(NavBarMobile);