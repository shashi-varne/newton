import React, { Component } from "react";
import Overview from "./Overview";
import Holdings from "./Holdings";
import Taxation from "./Taxation";
import Header from "../mini-components/Header";
import Footer from "../common/Footer";
import EmailList from '../mini-components/EmailList';
import UserAccount from '../mini-components/UserAccount';
import { isMobileDevice } from 'utils/functions';

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mailList: false,
      account: false,
      addMail: false
    };
  }

  renderTab = (tab) => {

    if (tab === 'overview') {
      return <Overview />;
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
      <div style={{ width: '100%', height: '100%', background: 'white', overflow: 'scroll' }}>
        <div id="wr-header-hero">
          <div className="wr-hero-container">

            {!isMobileDevice() ? <div>
              <img src='' alt="fisdom" />
              <span className="wr-report">Mutual fund report</span>
            </div> : ''}
            
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

        <div id="wr-footer">
        {!isMobileDevice() && <Footer />}
        </div>
      </div>
    );
  }
}