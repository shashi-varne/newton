import React from "react";
import "./mini-components.scss";

const BrokerageChargesTile = ({ data = {} }) => {
  return (
    <div
      className={`kyc-brokerage-fees-info ${data.className}`}
      data-aid="kyc-opening-charges"
    >
      <div className="kaim-fees-info-text">
        <div>{data.name}</div>
        <div className="kaim-fees-info-subtext">{data.subText}</div>
      </div>
      <div>
        <div className="kaim-no-fees-text1">{data.value}</div>
        {data.message && (
          <div className="kaim-no-fees-text2">{data.message}</div>
        )}
        {data.subValue && (
          <div className="kaim-fees-info-subvalue">{data.subValue}</div>
        )}
      </div>
    </div>
  );
};

export default BrokerageChargesTile;
