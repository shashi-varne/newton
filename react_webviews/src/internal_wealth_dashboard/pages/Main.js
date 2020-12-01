import React from 'react';

import Statements from './Statements';
import { getConfig } from 'utils/functions';
import NavBar from '../mini-components/NavBar';
import NavBarMobile from '../mini-components/NavBarMobile';
import Dashboard from './Dashboard';
import Analysis from './Analysis';
import Holdings from './Holdings';
import Recommendations from './Recommendations';
const isMobileView = getConfig().isMobileDevice;

const Main = (props) => {
  const {
    match: { params },
  } = props;

  return (
    <div id='iwd-main'>
      {isMobileView ? <NavBarMobile /> : <NavBar />}
      {params.tab === 'dashboard' && <Dashboard />}
      {params.tab === 'analysis' && <Analysis />}
      {params.tab === 'holdings' && <Holdings />}
      {params.tab === 'statements' && <Statements />}
      {params.tab === 'recommendations' && <Recommendations />}
    </div>
  );
};

export default Main;
