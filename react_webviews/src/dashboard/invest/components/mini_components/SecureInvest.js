import React from "react";
import { getConfig } from "utils/functions";
let productName = getConfig().productName;
const SecureInvest = () => {
  return (
    <div className="secure-invest-bottom">
      <div className="content">
        Investments with {productName} are 100% secure
      </div>
      <img
        className="trust-icons-invest"
        alt=""
        src={require(`assets/${productName}/trust_icons.svg`)}
      />
    </div>
  );
};

export default SecureInvest;
