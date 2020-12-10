
import React, { useEffect } from 'react';
import { getConfig } from "utils/functions";
import NavBar from '../mini-components/NavBar';
import NavBarMobile from '../mini-components/NavBarMobile';
import Dashboard from './Dashboard';
import Analysis from './Analysis';
import Holdings from './Holdings';
import Statements from './Statements';
import Recommendations from './Recommendations';
import { isEmpty, storageService } from '../../utils/validators';
import { navigate as navigateFunc } from '../common/commonFunctions';
import Api from '../../utils/api';
import { CSSTransition } from 'react-transition-group';
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

  const renderTab = () => {
    const tabMap = {
      'dashboard': <Dashboard />,
      'analysis': <Analysis />,
      'holdings': <Holdings />,
      'statements': <Statements />,
      'recommendations': <Recommendations />,
    };

    return tabMap[params.tab] || <></>;
  }

  return (
      <div id='iwd-main'>
        {isMobileView ? <NavBarMobile /> : <NavBar />}
        <CSSTransition
          in={true}
          appear
          enter={false}
          exit={false}
          classNames='iwd-entry-animate'
          timeout={30000}
        >
          {renderTab()}
        </CSSTransition>
      </div>
  );
};

export default Main;
