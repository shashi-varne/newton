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
import { isEmpty } from "../../utils/validators";
import { heightThreshold } from "../constants";
import NoPan from "./NoPan";

const MainPage = (props) => {
  const [headerAnimation, setHeaderAnimation] = useState('');
  function getHeightFromTop() {
    var el = document.getElementById('wr-body');
    if (el && !isEmpty(el)) {
      var height = el.getBoundingClientRect().top;
      return height;
    }
  }
  const onScroll = () => {
    if (getHeightFromTop() < heightThreshold) {
      setHeaderAnimation('snapUp');
    } else {
      setHeaderAnimation('');
    }
  };
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

  const { params } = props.match;
  const [pan, setPan] = useState('');
  useEffect(() => {
    setScrollEvent(true);
    (async() => {
      try {
        const res = await Api.get('api/whoami');
        if (!res || res.pfwstatus_code !== 200) {
          navigate(props, '/w-report/login');
        }
      } catch(err) {
        console.log(err);
        navigate(props, '/w-report/login');
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
          <div className="wr-fisdom">
            <img src={require('assets/fisdom/fisdom_logo.png')} alt="fisdom" />
            <span className='wr-vertical-divider'></span>
            <span className="wr-report">Mutual fund report</span>
          </div>
          
          {/* will be hidden for desktop view and visible for mobile view */}
          <PanSelect onPanSelect={setPan}/>
          
          {/* visbility will be modified based on condition in media queries */}
          <div className="wr-user-account">
            <EmailList />
            <UserAccount parentProps={props} />
          </div>

        </div>
      </div>

      <Header onPanSelect={setPan} animation={headerAnimation}/>

      {!pan ? 
        (<LoadingScreen text="Preparing your report, please wait..." />) :
        (
          <div id="wr-body">
          {pan === 'empty' ? 
            <NoPan /> :
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