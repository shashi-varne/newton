import React from "react";

export default function Footer() {
  return (
    <div className="wr-footer">
      <div className="wr-footer-secure">
        <img src={require(`assets/ic_trust.png`)} alt=""/>
        Fisdom ensures privacy for your data.
      </div>
      <div className="wr-register">
        <div className="wr-title">
          <img src={require(`assets/sebi-logo.png`)} alt="" width="32" />
          SEBI REGISTERED INVESTMENT ADVISOR INA200005323
        </div>
        <div className="wr-title-mob">
          <img src={require(`assets/sebi-logo.png`)} alt="" width="19" />
          SEBI REGISTERED INVESTMENT ADVISOR
        </div>
        <div className="wr-title">
          <img src={require(`assets/bse-logo.png`)} alt="" width="67" />
          BSE REGISTERED MUTUAL FUND DISTRIBUTOR MUTUAL FUND CODE NO:10140
        </div>
        <div className="wr-title-mob">
          <img src={require(`assets/bse-logo.png`)} alt="" width="41" />
          BSE REGISTERED MUTUAL FUND DISTRIBUTOR
        </div>
      </div>
    </div>
  );
};
