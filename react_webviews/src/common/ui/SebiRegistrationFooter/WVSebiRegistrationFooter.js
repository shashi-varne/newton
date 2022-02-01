import React from "react";
import { getConfig } from "../../../utils/functions";
import { Imgc } from "../Imgc";
import "./WVSebiRegistrationFooter.scss";

const WVSebiRegistrationFooter = ({
  dataAidSuffix,
  alignCenter = true, // Center aligns component [default=true]
  className = "",
}) => {
  const { colorLogo, isSdk } = getConfig();
  return (
    <div
      style={{ margin: alignCenter ? "auto" : "" }}
      className={`wv-sebi-registration-footer ${className}`}
      data-aid={`wv-sebi-registration-footer-${dataAidSuffix}`}
    >
      {isSdk && <div className="wv-srd-partner-text">In partnership with</div>}
      <div className="flex-between-center">
        <Imgc 
        src={require(`assets/${colorLogo}`)} 
        className="wv-srd-partner-logo" />
        <Imgc 
        src={require(`assets/sebi-logo.svg`)} 
        className="wv-srd-sebi-logo" />
      </div>
      <div className="wv-srd-footer-text">
        NSE member code - 90228 | BSE member code - 6696 | NSE/BSE - SEBI
        registration no. - INZ000209036 | CDSL - SEBI registeration no. -
        IN-DP-572-2021 , INA200005323 | AMFI registration no. ARN 103168
      </div>
    </div>
  );
};

export default WVSebiRegistrationFooter;
