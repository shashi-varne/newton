// -------------------- Assets ------------------
import close from 'assets/ic_close_white.svg';
import fisdom_logo from 'assets/fisdom/fisdom_logo_white.svg';
// ----------------------------------------------
import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, CircularProgress } from 'material-ui';
import MenuIcon from '@material-ui/icons/Menu';
import { logout } from '../common/ApiCalls';
import { navigate as navigateFunc } from '../common/commonFunctions';
import toast from '../../common/ui/Toast';
import { storageService } from '../../utils/validators';
import { nativeCallback } from '../../utils/native_callback';
import { get } from 'lodash';
import Api from '../../utils/api';
const allTabs = [{
  tab:'dashboard',
  desc: 'Easy view for all your investments',
}, {
  tab: 'analysis',
    desc: 'Anatomy of your equity and debt investments',
}, {
  tab: 'holdings',
    desc: 'Fund summary and transactions',
}, {
  tab: 'recommendations',
    desc: 'Rebalancing, coming soon for you!',
}, {
  tab: 'statements',
  desc: 'Download transactions, capital gain and ELSS report',
}];

const NavBarMobile = (props) => {
  const { match = {} } = props;
  const navigate = navigateFunc.bind(props);
  const [userDetail, setUserDetail] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { params: { tab: currentTab = 'dashboard' }} = match;

  const initialiseUserData = async () => {
    let pan = storageService().get('iwd-user-pan') || '';
    let mobile = storageService().get('iwd-user-mobile') || '';
    mobile = mobile ? `+91-${mobile}` : '';
    const user = {
      name: storageService().get('iwd-user-name') || '',
      email: storageService().get('iwd-user-email') || '',
      mobile,
    };

    setUserDetail(user);

    if (!pan) {
      const kycDetail = await Api.post(`api/user/account/summary`, {
        "kyc": ["kyc"],
        "user": ["user"]
      });
      pan = get(kycDetail, 'pfwresponse.result.data.kyc.kyc.data.pan.meta_data.pan_number', '');
      storageService().set('iwd-user-pan', pan);
    }
    setUserDetail({ ...user, pan });
  };

  useEffect(() => {
    initialiseUserData();
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
            <img src={fisdom_logo} id="iwd-nmh-fisdom-logo" width="96px" alt="fisdom" />
          </Link>
          <Button className="iwd-nmh-menu" onClick={() => setExpanded(true)}>
            <MenuIcon fontSize="inherit" />
            <span id="iwd-nmhm-text">Menu</span>
          </Button>
          <div id="iwd-nmh-profile" onClick={() => setExpanded(true)}>
            {(userDetail.name || '').charAt(0)}
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
          {allTabs.map(({tab, desc}, idx) =>
            <Link to={`${tab}${props.location.search}`} onClick={() => setExpanded(false)} key={idx}>
              <div
                className={`
                iwd-nmb-link
                ${currentTab === tab ? 'selected' : ''}
              `}>
                <div className="iwd-nmbl-label">{tab}</div>
                <div className="iwd-nmbl-desc">{desc}</div>
              </div>
            </Link>
          )}
          <div id="iwd-nmb-divider" />
          <div id="iwd-nmb-profile">
            <div id="iwd-nmp-user-name">{userDetail.name}</div>
            <div id="iwd-nmp-user-icon">{(userDetail.name || '').charAt(0)}</div>
            <div className="iwd-nmp-user-detail">
              <b>PAN: </b>
              {userDetail.pan}
            </div>
            <div className="iwd-nmp-user-detail">
              <b>Email: </b>
              {userDetail.email}
            </div>
            <div className="iwd-nmp-user-detail">
              <b>Mob.:</b>
              {'  '}{userDetail.mobile || ' --'}
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