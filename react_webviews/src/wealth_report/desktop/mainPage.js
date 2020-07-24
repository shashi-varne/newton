import React, { Component } from "react";
import {
  Route,
  Switch
} from 'react-router-dom';

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  renderTab = (tab) => {
    if (tab === 'overview') {
      return <Overview />;
    }
  }

  render() {
    const { params } = this.props.match;
    console.log(params);
    return (
      <div style={{ width: '100%', height: '100%', background: 'white' }}>
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

class Overview extends Component {
  render() {
    return (
      <div id="key-numbers">
        <div>Key Numbers</div>
        <div>CURRENT VALUE</div>
        <div>TOTAL INVESTED</div>
        <div>XIRR</div>
        <div>total Realised Gains</div>
        <div>ASSET ALLOCATION</div>
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
class Holdings extends Component {
  render() {
    return (
      <span>Holdings</span>
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