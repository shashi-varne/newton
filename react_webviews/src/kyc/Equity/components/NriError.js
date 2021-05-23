import React from "react";
import Container from "../../common/Container";
import { StatusInfo } from "../mini-components/StatusInfo";
import "./commonStyles.scss";

const NriError = (props) => {
  return (
    <Container
      data-aid='nri-error-screen'
      hidePageTitle
      twoButtonVertical={true}
      button1Props={{
        type: "primary",
        order: "1",
        title: "COMPLETE MUTUAL FUND KYC",
      }}
      button2Props={{
        type: "secondary",
        order: "2",
        title: "DONE",
      }}
    >
      <StatusInfo
        icon="no_stocks_nri.svg"
        title="Currently, we don't offer trading and demat services to NRI users"
        subtitle="Please check back later or continue with your mutual fund KYC"
      />
    </Container>
  );
};

export default NriError;
