import React, { Component } from "react";
import Overview from "./Overview";
import Holdings from "./Holdings";
import Taxation from "./Taxation";
import Header from "../mini-components/Header";
import Footer from "../common/Footer";
import Tooltip from 'common/ui/Tooltip';
import Email from "../mini-components/EmailList";
import Account from '../mini-components/Account';

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

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


  render() {
    const { params } = this.props.match;
    console.log(params);

    const mail = (
      <img
        src={require(`assets/fisdom/ic-emails.svg`)}
        style={{ cursor: "pointer" }}
        alt=""
      />
      )

    const account = (
      <img
        src={require(`assets/fisdom/ic-account.svg`)}
        style={{ cursor: "pointer" }}
        alt=""
      />
    )
    

    return (
      <div style={{ width: '100%', height: '100%', background: 'white', overflow: 'scroll' }}>
        <div id="wr-header-hero">
          <div className="hero-container">

          <div>
            <img src='' alt="fisdom" />
            <span className="wr-report">Mutual fund report</span>
          </div>

          <div className="wr-account">
            <Tooltip content={<Email />} tip={mail} />
            <Tooltip content={<Account />} tip={account} />
          </div>

          </div>
        </div>
        <Header />
        <div id="wr-body">
          {this.renderTab(params.tab)}
        </div>
        <div id="wr-footer">
        <Footer />
        </div>
      </div>
    );
  }
}