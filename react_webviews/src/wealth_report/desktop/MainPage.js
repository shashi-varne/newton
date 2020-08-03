import React, { Component } from "react";
import Overview from "./Overview";
import Holdings from "./Holdings";
import Taxation from "./Taxation";
import Header from "../mini-components/Header";
import Footer from "../common/Footer";

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
    return (
      <React.Fragment>
      <div style={{ width: '100%', height: '100%', background: 'white', overflow: 'scroll' }}>
        <div id="wr-header-hero"></div>
        <Header />
        <div id="wr-body">
          {this.renderTab(params.tab)}
        </div>
        <div id="wr-footer">
        <Footer />
        </div>
      </div>
      
      </React.Fragment>
    );
  }
}