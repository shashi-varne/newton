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
import { storageService } from '../../utils/validators';
const allTabs = ['dashboard', 'analysis', 'holdings', 'recommendations', 'statements'];

const NavBarMobile = (props) => {
  const name = storageService().get('iwd-user-name') || '';
  const email = storageService().get('iwd-user-email') || '';
  let mobile = storageService().get('iwd-user-mobile') || '';
  mobile = mobile ? `+91-${mobile}` : '';
  const pan = storageService().get('iwd-user-pan') || '';
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
          <Link
            to={`dashboard${props.location.search}`}
            onClick={() => setExpanded(false)}
            style={{ marginRight: 'auto' }}
          >
            <img src={fisdom_logo} id="iwd-nmh-fisdom-logo" alt="fisdom" />
          </Link>
          <Button className="iwd-nmh-menu" onClick={() => setExpanded(true)}>
            <MenuIcon fontSize="inherit" />
            <span id="iwd-nmhm-text">Menu</span>
          </Button>
          <div id="iwd-nmh-profile" onClick={() => setExpanded(true)}>
            {name.charAt(0)}
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
          {allTabs.map((tab, idx) =>
            <Link to={`${tab}${props.location.search}`} onClick={() => setExpanded(false)} key={idx}>
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
            <div id="iwd-nmp-user-name">{name}</div>
            <div id="iwd-nmp-user-icon">{name.charAt(0)}</div>
            <div className="iwd-nmp-user-detail">
              <b>PAN: </b>
              {pan}
            </div>
            <div className="iwd-nmp-user-detail">
              <b>Email: </b>
              {email}
            </div>
            <div className="iwd-nmp-user-detail">
              <b>Mob.: </b>
              {'  '}{mobile || '--'}
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
              <CircularProgress size={25} color="white" /> : 'Logout'
            }
        </Button>
        </div>
      }
    </div>
  );
};

export default withRouter(NavBarMobile);