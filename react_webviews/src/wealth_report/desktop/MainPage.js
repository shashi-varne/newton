import React, { Component } from "react";
import Overview from "./Overview";
import Holdings from "./Holdings";
import Taxation from "./Taxation";
import Header from "../mini-components/Header";
import Footer from "../common/Footer";
import EmailList from '../mini-components/EmailList';
import UserAccount from '../mini-components/UserAccount';
import PanSelect from '../mini-components/PanSelect';
import Analysis from '../desktop/Analysis';

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mailList: false,
      account: false,
      addMail: false
    };
  }

  getHeightFromTop = () => {
    var el = document.getElementById('wr-body');
    var height = el.getBoundingClientRect().top;
    return height;
  }

  onScroll = () => {
    if (this.getHeightFromTop() < 268) {
      console.log('Swipe up');
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  renderTab = (tab) => {

    if (tab === 'overview') {
      return <Overview />;
    } else if (tab === 'analysis') {
      return <Analysis />
    } else if (tab === 'holdings') {
      return <Holdings />
    } else if (tab === 'taxation') {
      return <Taxation />
    }
  }

  handleClose = () => {
    this.setState({
      mailList: false,
      account: false,
    })
  }

  handleClick = () => {
    this.setState({
      addMail: true
    })
  }

  render() {
    const { params } = this.props.match;
    console.log(params);
    
    return (
      <div style={{ width: '100%', height: '100%', background: 'white', overflowY: 'scroll' }}>
        <div id="wr-header-hero">
          <div className="wr-hero-container">

            {/* will be hidden for mobile view and visible for desktop view */}
            <div className="wr-fisdom">
              <img src='' alt="fisdom" />
              <span className='wr-vertical-divider'></span>
              <span className="wr-report">Mutual fund report</span>
            </div>
            
            {/* will be hidden for desktop view and visible for mobile view */}
            <PanSelect />
            
            {/* visbility will be modified based on condition in media queries */}
            <div className="wr-user-account">
              <EmailList />
              <UserAccount />
            </div>

          </div>
        </div>

        <Header />
        
        <div id="wr-body">
          {this.renderTab(params.tab)}
        </div>

        {/* will be hidden for the mobile view */}
        <div id="wr-footer">
          <Footer />
        </div>
      </div>
    );
  }
}