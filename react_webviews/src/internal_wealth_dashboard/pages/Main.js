import React from 'react';
import { getConfig } from "utils/functions";
import { navigate } from '../common/commonFunctions';
import NavBar from '../mini-components/NavBar';
import NavBarMobile from '../mini-components/NavBarMobile';
import Dashboard from './Dashboard';
import Analysis from './Analysis'
// import Dashboard from './Dashboard-v2';
const isMobileView = getConfig().isMobileDevice;

const Main = (props) => {
  const { match: { params } } = props;

  return (
    <div id="iwd-main">
      {isMobileView ? <NavBarMobile /> : <NavBar />}
      {params.tab === 'dashboard' && <Dashboard />}
      {params.tab === 'analysis' && <Analysis />}
      {params.tab === 'holdings' && <Dashboard />}
      {params.tab === 'statements' && <Dashboard />}
      {params.tab === 'recommendations' && <Dashboard />}
    </div>
  );
};

export default Main;