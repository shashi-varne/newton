import React, { Component } from "react";

class Footer extends Component {
  state = {};
  render() {
    return (
      <div className="wr-footer">
        <div className="wr-privacy">
        <img src={require(`assets/fisdom/ic-secure.svg`)} alt="" />
          Fisdom ensures privacy for your data. <b>Learn more</b>
        </div>
        <div className="wr-register">
          <div className="wr-logo">
            <img src={require(`assets/fisdom/sebi-logo-svg.jpg`)} alt="" />
            SEBI REGISTERED INVESTMENT ADVISOR INA200005323
          </div>
          <div className="wr-logo">
            <img src={require(`assets/fisdom/bse-logo.jpg`)} alt="" />
            BSE REGISTERED MUTUAL FUND DISTRIBUTOR MUTUAL FUND CODE NO:10140
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
