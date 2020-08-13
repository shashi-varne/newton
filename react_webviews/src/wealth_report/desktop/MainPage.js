import React, { Component } from "react";
import Overview from "./Overview";
import Holdings from "./Holdings";
import Taxation from "./Taxation";
import Header from "../mini-components/Header"
import { onScroll } from "../common/commonFunctions";
import Analysis from "./Analysis";

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

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

  render() {
    const { params } = this.props.match;
    console.log(params);
    return (
      <div style={{ width: '100%', height: '100%', background: 'white', overflow: 'scroll' }} onScroll={this.onScroll}>
        <div id="wr-header-hero"></div>
        <Header />
        <div id="wr-body">
          {this.renderTab(params.tab)}
        </div>
        <div id="wr-footer"></div>
      </div>
    );
  }
}