// ------------------ Assets ---------------------
import ic_dashboard from 'assets/ic_dashboard.svg';
import ic_analysis from 'assets/ic_analysis.svg';
import ic_recommend from 'assets/ic_recommend.svg';
import ic_statement from 'assets/ic_statement.svg';
import ic_holdings from 'assets/ic_holding.svg';
import fisdom_logo from 'assets/fisdom/fisdom_logo_white.svg';
import fisdom_icon from 'assets/fisdom/fisdom_logo_icon_white.svg';
// ------------------------------------------------
import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
const tabs = [{
  label: 'dashboard',
  icon: ic_dashboard,
}, {
  label: 'analysis',
  icon: ic_analysis,
}, {
  label: 'holdings',
  icon: ic_holdings,
}, {
  label: 'recommendations',
  icon: ic_recommend,
}, {
  label: 'statements',
  icon: ic_statement,
}];

const NavBar = (props) => {
  const { match: { params } } = props;
  const [open, setOpen] = useState(false);

  return (
    <div
      id="iwd-nav"
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <img
        src={open ? fisdom_logo : fisdom_icon}
        alt="fisdom"
        height="40"
        style={{ marginBottom: '50px' }}
      />
      {tabs.map(({label, icon}) =>
        <Link to={`${label}${props.location.search}`} key={label}>
          <div
            className={`
              iwd-nav-item
              ${params.tab === label ? 'selected' : ''}
            `}>
            <img className="iwd-ni-img" src={icon} alt={label} />
            <span className="iwd-ni-label">{label}</span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default withRouter(NavBar);