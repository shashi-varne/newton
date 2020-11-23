import React from 'react';
import { getConfig } from "utils/functions";
import NavBar from '../mini-components/NavBar';
import NavBarMobile from '../mini-components/NavBarMobile';
import Dashboard from './Dashboard';
import Holdings from './Holdings';
import Recommendations from './Recommendations';
// import Dashboard from './Dashboard-v2';
const isMobileView = getConfig().isMobileDevice;

const Main = (props) => {
  const { match: { params } } = props;

  return (
    <div id="iwd-main">
      {isMobileView ? <NavBarMobile /> : <NavBar />}
      {params.tab === 'dashboard' && <Dashboard />}
      {params.tab === 'analysis' && <Dashboard />}
      {params.tab === 'holdings' && <Holdings />}
      {params.tab === 'statements' && <Dashboard />}
      {params.tab === 'recommendations' && <Recommendations />}
    </div>
  );
};

export default Main;