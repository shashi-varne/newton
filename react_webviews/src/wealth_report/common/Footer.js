import React, { Component } from "react";

class Footer extends Component {
  state = {};
  render() {
    return (
      <div className="wr-footer">
        <div className="wr-register">
          <div className="wr-title">
            <img src={require(`assets/fisdom/sebi-logo-svg.jpg`)} alt="" />
            SEBI REGISTERED INVESTMENT ADVISOR INA200005323
          </div>
          <div className="wr-title-mob">
            <img src={require(`assets/fisdom/sebi-logo-mob.jpg`)} alt="" />
            SEBI REGISTERED INVESTMENT ADVISOR
          </div>
          <div className="wr-title">
            <img src={require(`assets/fisdom/bse-logo.jpg`)} alt="" />
            BSE REGISTERED MUTUAL FUND DISTRIBUTOR MUTUAL FUND CODE NO:10140
          </div>
          <div className="wr-title-mob">
            <img src={require(`assets/fisdom/bse-logo-mob.jpg`)} alt="" />
            BSE REGISTERED MUTUAL FUND DISTRIBUTOR
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
