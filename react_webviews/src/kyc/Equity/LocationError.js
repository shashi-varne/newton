import React from "react";
import { Imgc } from "../../common/ui/Imgc";
import { getConfig } from "../../utils/functions";
import Container from "../common/Container";
import "./commonStyles.scss";

const productName = getConfig().productName;
const LocationError = (props) => {
  return (
    <Container buttonTitle="OKAY" type="outlined" hidePageTitle>
      <div className="kyc-location-error">
        <Imgc
          className="kyc-location-error-img"
          src={require(`assets/${productName}/kyc_no_stocks_nri.svg`)}
        />
        <div className="kyc-location-error-title">
          You cannot proceed with KYC
        </div>
        <div className="kyc-location-error-subtitle">
          As per SEBI regulations, your location should be in India
        </div>
      </div>
    </Container>
  );
};

export default LocationError;
