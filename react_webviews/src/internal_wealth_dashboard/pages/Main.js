
import React, { useEffect } from 'react';
import { getConfig } from "utils/functions";
import Statements from './Statements';
import NavBar from '../mini-components/NavBar';
import NavBarMobile from '../mini-components/NavBarMobile';
import Dashboard from './Dashboard';
import Analysis from './Analysis';
import Holdings from './Holdings';
import Recommendations from './Recommendations';
import { isEmpty, storageService } from '../../utils/validators';
import { navigate as navigateFunc } from '../common/commonFunctions';
import Api from '../../utils/api';
const isMobileView = getConfig().isMobileDevice;

const Main = (props) => {
  const { match: { params } } = props;
  const navigate = navigateFunc.bind(props);

  const fetchUserCreds = async () => {
    try {
      const res = await Api.get('api/whoami');
      if (isEmpty(res) || res.pfwstatus_code !== 200) {
        navigate('login');
      } else {
        const { user } = res.pfwresponse.result;
        const { email, name, mobile } = user;
        
        storageService().set('iwd-user-email', email || '');
        storageService().set('iwd-user-name', name || '');
        storageService().set('iwd-user-mobile', mobile || '');
      }
    } catch (e) {
      console.log(e);
      navigate('login');
    }
  };

  useEffect(() => {
    fetchUserCreds();
  }, []);

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
