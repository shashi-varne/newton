import React from "react";
import Container from "../../common/Container";
import { StatusInfo } from "../mini-components/StatusInfo";
import "./commonStyles.scss";

const LocationError = (props) => {
  return (
    <Container buttonTitle="OKAY" type="outlined" hidePageTitle>
      <StatusInfo
        icon="no_stocks_nri.svg"
        title="You cannot proceed with KYC"
        subtitle="As per SEBI regulations, your location should be in India"
      />
    </Container>
  );
};

export default LocationError;
