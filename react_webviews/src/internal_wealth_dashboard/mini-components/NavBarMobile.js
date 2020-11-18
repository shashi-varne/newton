import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import fisdom_logo from 'assets/fisdom/fisdom_logo.png';
import { Button } from 'material-ui';
import MenuIcon from '@material-ui/icons/Menu';
import close from 'assets/ic_close_white.svg';
const allTabs = ['dashboard', 'analysis', 'holdings', 'recommendations', 'statements'];

const NavBarMobile = (props) => {
  const { match = {} } = props;
  const [expanded, setExpanded] = useState(false);
  const { params: { tab: currentTab = 'dashboard' }} = match;

  return (
    <div id="iwd-nav-mob" style={{ height: expanded ? '100vh' : '' }}>
      {!expanded ?
        <div id="iwd-nm-header">
          <img src={fisdom_logo} id="iwd-nmh-fisdom-logo" alt="fisdom" />
          <Button className="iwd-nmh-menu" onClick={() => setExpanded(true)}>
            <MenuIcon fontSize="inherit" />
            <span id="iwd-nmhm-text">Menu</span>
          </Button>
          <div id="iwd-nmh-profile" onClick={() => setExpanded(false)}>
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
            classes={{
              root: 'iwd-nmb-logout',
              label: 'iwd-nmb-logout-text',
            }}
          >
            Logout
        </Button>
        </div>
      }
    </div>
  );
};

export default withRouter(NavBarMobile);