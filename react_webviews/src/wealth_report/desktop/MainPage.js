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
import NoPan from "./NoPan";

const MainPage = (props) => {
  const { params } = props.match;
  const [pan, setPan] = useState('');
  useEffect(() => {
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
  }, []);

  // const getHeightFromTop = () => {
  //   var el = document.getElementById('wr-body');
  //   var height = el.getBoundingClientRect().top;
  //   return height;
  //   // window.removeEventListener('scroll', this.onScroll, false);
  // };

  // const onScroll = () => {
  //   if (this.getHeightFromTop() < 268) {
  //     console.log('Swipe up');
  //   }
  // };

  const addNewEmail = () => {
    const elem = document.getElementById('wr-account-img');
    elem.click();
  };

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
      <div id="wr-header-hero" className="animated animatedFadeInUp fadeInUp">
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

      <Header onPanSelect={setPan}/>

      {!pan ? 
        (<LoadingScreen text="Preparing your report, please wait..." />) :
        (
          <div id="wr-body">
          {pan === 'empty' ? 
            <NoPan onSyncClick={addNewEmail}/> :
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