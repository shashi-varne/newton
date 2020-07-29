import React, { Component } from "react";
import Overview from "./Overview";
import Holdings from "./Holdings";

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  renderTab = (tab) => {
    if (tab === 'overview') {
      return <Overview />;
    } else if (tab === 'analysis') {
      return <Analysis />
    } else if (tab === 'holdings') {
      console.log('HERE');
      return <Holdings />
    }
  }

  render() {
    const { params } = this.props.match;
    console.log(params);
    return (
      <div style={{ width: '100%', height: '100%', background: 'white', overflow: 'scroll' }}>
        <div id="wr-header-hero"></div>
        <div id="wr-header-bar">
          <div id="wr-header-pan-select" className="wr-header-tab"></div>
          <div className="wr-header-tab">Overview</div>
          <div className="wr-header-tab">Analysis</div>
          <div className="wr-header-tab">Holdings</div>
          <div className="wr-header-tab">Taxation</div>
        </div>
        <div id="wr-body">
          {this.renderTab(params.tab)}
        </div>
        <div id="wr-footer"></div>
      </div>
    );
  }
}

class Analysis extends Component {
  render() {
    return (
      <span>Analysis</span>
    );
  }
}
class Taxation extends Component {
  render() {
    return (
      <span>Taxation</span>
    );
  }
}