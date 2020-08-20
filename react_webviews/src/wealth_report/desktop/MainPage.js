import React, { useState } from "react";
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

const MainPage = (props) => {
  const { params } = props.match;
  const [pan, setPan] = useState('');

  const getHeightFromTop = () => {
    var el = document.getElementById('wr-body');
    var height = el.getBoundingClientRect().top;
    return height;
    // window.removeEventListener('scroll', this.onScroll, false);
  };

  const onScroll = () => {
    if (this.getHeightFromTop() < 268) {
      console.log('Swipe up');
    }
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
      <div id="wr-header-hero">
        <div className="wr-hero-container">

          {/* will be hidden for mobile view and visible for desktop view */}
          <div className="wr-fisdom">
            <img src='' alt="fisdom" />
            <span className='wr-vertical-divider'></span>
            <span className="wr-report">Mutual fund report</span>
          </div>
          
          {/* will be hidden for desktop view and visible for mobile view */}
          <PanSelect onPanSelect={setPan}/>
          
          {/* visbility will be modified based on condition in media queries */}
          <div className="wr-user-account">
            <EmailList />
            <UserAccount />
          </div>

        </div>
      </div>

      <Header onPanSelect={setPan}/>

      {!pan ? 
        (<LoadingScreen text="Preparing your report, please wait..." />) :
        (<div id="wr-body">
          {renderTab(params.tab)}
        </div>)
      }

      {/* will be hidden for the mobile view */}
      <div id="wr-footer">
        <Footer />
      </div>
    </div>
  );
}

export default MainPage;