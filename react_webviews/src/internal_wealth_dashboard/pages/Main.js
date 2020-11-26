import React from 'react';
import { getConfig } from 'utils/functions';
import { navigate } from '../common/commonFunctions';
import NavBar from '../mini-components/NavBar';
import NavBarMobile from '../mini-components/NavBarMobile';
import Dashboard from './Dashboard';
import Statements from './Statements';
// import Dashboard from './Dashboard-v2';
const isMobileView = getConfig().isMobileDevice;

const Main = (props) => {
  const {
    match: { params },
  } = props;

  return (
    <div id='iwd-main'>
      {isMobileView ? <NavBarMobile /> : <NavBar />}
      {params.tab === 'dashboard' && <Dashboard />}
      {params.tab === 'analysis' && <Dashboard />}
      {params.tab === 'holdings' && <Dashboard />}
      {params.tab === 'statements' && <Statements />}
      {params.tab === 'recommendations' && <Dashboard />}
    </div>
  );
};

export default Main;
