import React, { Component } from "react";

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
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
        <div id="wr-footer"></div>
      </div>
    );
  }
}