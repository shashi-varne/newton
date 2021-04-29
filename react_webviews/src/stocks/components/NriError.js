import React from "react";
import Container from "../common/Container";
import { StatusInfo } from "../mini-components/StatusInfo";
import "./commonStyles.scss";

const NriError = (props) => {
  // handle two button vertical align
  return (
    <Container buttonTitle="COMPLETE MUTUAL FUND KYC" hidePageTitle>
      <StatusInfo
        icon="no_stocks_nri.svg"
        title="Currently, we don't offer trading and demat services to NRI users"
        subtitle="Please check back later or continue with your mutual fund KYC"
      />
    </Container>
  );
};

export default NriError;
