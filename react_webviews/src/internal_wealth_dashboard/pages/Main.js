import fisdomLogo from 'assets/fisdom/fisdom_logo.svg';

import React, { useEffect, useState } from 'react';
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
import IwdScreenLoader from '../mini-components/IwdScreenLoader';
import IwdErrorScreen from '../mini-components/IwdErrorScreen';
import { nativeCallback } from '../../utils/native_callback';
const isMobileView = getConfig().isMobileDevice;

const Main = (props) => {
  const { match: { params } } = props;
  const navigate = navigateFunc.bind(props);
  const [loginErr, setLoginErr] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sendEvents = () => {
    const eventObj = {
      "event_name": 'internal dashboard hni',
      "properties": {
        "user_action": 'landed',
        "screen_name": 'Landing page',
      }
    };

    const storage_val = storageService().get('iwd-landed-time');
    const link_click_time = storage_val ? new Date(storage_val) : null;
    const current_time = new Date();

    // If user lands on this page again within 6 hours, will not log/trigger the event
    if (!link_click_time || (current_time - link_click_time) / 60000 > 6 * 60) {
      storageService().set('iwd-landed-time', current_time);
      nativeCallback({ events: eventObj });
    }
  };

  const fetchUserCreds = async () => {
    try {
      setIsLoading(true);
      const res = await Api.get('api/whoami');
      if (isEmpty(res) || res.pfwstatus_code !== 200) {
        showError();
      } else {
        sendEvents();
        
        const { user } = res.pfwresponse.result;
        const { email, name, mobile = '', dt_first_investment } = user;
        
        storageService().set('iwd-user-email', email || '');
        storageService().set('iwd-user-first-invest', dt_first_investment || '');
        storageService().set('iwd-user-name', name || '');
        storageService().set('iwd-user-mobile', (mobile || '').slice(-10) || '');
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      showError();
    }
  };

  const showError = () => {
    setIsLoading(false);
    setLoginErr(true);
    setTimeout(() => {
      navigate('login');
    }, 5000);
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

  if (isLoading) {
    return (
      <div id="iwd-main" className="iwd-animatedFade">
        <img src={fisdomLogo} alt="fisdom" id="iwd-m-loadscreen-logo"/>
        <IwdScreenLoader
          classes={{
            container: 'iwd-m-loadscreen',
            text: 'iwd-ml-text'
          }}
          loadingText="Verifying login..."
        />
      </div>
    )
  } else if (loginErr) {
    return (
      <div id="iwd-main">
        <IwdErrorScreen
          templateErrText="Redirecting to login page..."
          templateErrTitle="You have been logged out."
          classes={{
            container: 'iwd-m-errorscreen',
            title: 'iwd-me-title',
            text: 'iwd-me-text'
          }}
        />
      </div>
    )
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
