import React, { useState, useEffect } from "react";
import Overview from "./Overview";
import Holdings from "./Holdings";
import Taxation from "./Taxation";
import Header from "../mini-components/Header";
import Footer from "../common/Footer";
import EmailList from '../mini-components/EmailList';
import UserAccount from '../mini-components/UserAccount';
import PanSelect from '../mini-components/PanSelect';
import Analysis from '../desktop/Analysis';
import LoadingScreen from "../mini-components/LoadingScreen";
import { navigate } from "../common/commonFunctions";
import Api from '../../utils/api';
import { isEmpty, storageService } from "../../utils/validators";
import { heightThreshold } from "../constants";
import NoPan from "./NoPan";
import { getConfig } from "utils/functions";
import InternalStorage from "../InternalStorage";
import { fetchEmails } from "../common/ApiCalls";
import { toast } from "react-toastify";
import { nativeCallback } from "../../utils/native_callback";
const isMobileView = getConfig().isMobileDevice;

const MainPage = (props) => {
  const [headerAnimation, setHeaderAnimation] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [refreshOnScroll, setRefreshOnScroll] = useState(1);

  function getHeightFromTop() {
    var el = document.getElementById('wr-body');
    if (el && !isEmpty(el)) {
      var height = el.getBoundingClientRect().top;
      return height;
    }
  }

  const sendEvents = () => {
    const eventObj = {
      "event_name": 'portfolio web report',
      "properties": {
        "user_action": 'landed',
        "screen_name": 'Landing page',
      }
    };

    const storage_val = storageService().get('wr-link-click-time');
    const link_click_time = storage_val ? new Date(storage_val) : null;
    const current_time = new Date();

    // If user lands on this page again within 6 hours, will not log/trigger the event
    if (!link_click_time || (current_time - link_click_time) / 60000 > 6 * 60) {
      storageService().set('wr-link-click-time', current_time);
      nativeCallback({ events: eventObj });
    }
  };
  
  const onScroll = () => {
    if ((getHeightFromTop() < heightThreshold) && headerAnimation !== 'snapUp') {
      setHeaderAnimation('snapUp');
    } else {
      setHeaderAnimation('');
    }
  };

  useEffect(() => {
    setRefreshOnScroll(refreshOnScroll + 1);
  }, [headerAnimation]);

  function setScrollEvent(setScroll) {
    const elem = document.getElementById('wr-main');
    if (elem && !isEmpty(elem)) {
      if (setScroll) {
        elem.addEventListener('scroll', onScroll, false);
      } else {
        elem.removeEventListener('scroll', onScroll, false);
      }
    }
  }

  const clearLSFields = () => {
    const fieldsToClear = ['wr-tax-filters', 'wr-fin-year', 'wr-tax-slab'];
    fieldsToClear.map(field => storageService().remove(field));
  };

  const panChanged = (newPan) => {
    InternalStorage.clearStore();
    clearLSFields(); // Clear out any LS fields here that might be dependant on PAN
    setPan(newPan);
    if (!newPan || newPan === 'empty') {
      setNoPanContent();
    } else {
      setLoading(false);
    }
  };

  const setNoPanContent = async() => {
    setLoading(true);
    try {
      const emails = await fetchEmails();
      if (!isEmpty(emails)) {
        const oneEmailRegistered = emails.some(email => !isEmpty(email.latest_success_statement));
        
        if (!oneEmailRegistered) {
          const sortedByModified = emails.sort((email1, email2) =>
            (new Date(email1.latest_statement.dt_updated) - new Date(email2.latest_statement.dt_updated))/60000
          );
          const registeredEmail = sortedByModified.pop();
          storageService().set('wr-email-added', registeredEmail.email);
        }
      }
    } catch(err) {
      console.log(err);
      toast(err);
    }
    setLoading(false);
  };

  const { params } = props.match;
  const [pan, setPan] = useState('');
  useEffect(() => {
    setScrollEvent(true);
    (async() => {
      try {
        const res = await Api.get('api/whoami');
        if (isEmpty(res) || res.pfwstatus_code !== 200) {
          navigate(props, 'login');
        } else {
          const { user } = res.pfwresponse.result;
          const username = user.mobile ? `+${user.mobile.split('|').join('-')}` : user.email;
          storageService().set('wr-username', username);
          sendEvents();
        }
      } catch(err) {
        console.log(err);
        navigate(props, 'login');
      }
    })();
    return function cleanup() {
      setScrollEvent(false);
    };
  }, []);

  const renderTab = (tab) => {
    if (tab === 'overview') {
      return <Overview pan={pan} parentProps={props}/>
    } else if (tab === 'analysis') {
      return <Analysis pan={pan} parentProps={props}/>
    } else if (tab === 'holdings') {
      return <Holdings pan={pan} parentProps={props}/>
    } else if (tab === 'taxation') {
      return <Taxation pan={pan} parentProps={props}/>
    }
  };

  return (
    <div id="wr-main">
      <div
        id="wr-header-hero" className={
          `${headerAnimation}
          animated animatedFadeInUp fadeInUp`
        }>
        <div className="wr-hero-container">

          {/* will be hidden for mobile view and visible for desktop view */}
          <div className="wr-fisdom" onClick={() => navigate(props, 'main/overview')}>
            <img src={require('assets/fisdom/fisdom_logo_white.svg')} alt="fisdom" />
            <span className='wr-vertical-divider'></span>
            <span className="wr-report">Portfolio Report</span>
          </div>
          
          {/* will be hidden for desktop view and visible for mobile view */}
          {isMobileView && <PanSelect onPanSelect={panChanged} parentProps={props}/>}
          
          {/* visbility will be modified based on condition in media queries */}
          <div className="wr-user-account">
            <EmailList refresh={refreshOnScroll} key={refreshOnScroll}/>
            <UserAccount parentProps={props} refresh={refreshOnScroll}/>
          </div>

        </div>
      </div>

      <Header onPanSelect={panChanged} animation={headerAnimation} parentProps={props}/>

      {isLoading ? 
        (<LoadingScreen text="Preparing your report, please wait..." />) :
        (
          <div id="wr-body">
            {!pan || pan === 'empty' ? 
              <NoPan onEmailAdded={() => setRefreshOnScroll(refreshOnScroll + 1)} /> :
              renderTab(params.tab)
            }
          </div>
        )
      }

      {/* will be hidden for the mobile view */}
      <div id="wr-footer">
        <Footer />
      </div>
    </div>
  );
}

export default MainPage;