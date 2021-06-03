import React from "react";
import { getConfig } from "../../../utils/functions";
import Container from "../../common/Container";
import "./commonStyles.scss";
import { Imgc } from "../../../common/ui/Imgc";

const productName = getConfig().productName;
const NriError = (props) => {
  return (
    <Container
      data-aid='nri-error-screen'
      hidePageTitle
      twoButtonVertical={true}
      button1Props={{
        type: "primary",
        title: "COMPLETE MUTUAL FUND KYC",
      }}
      button2Props={{
        type: "secondary",
        title: "DONE",
      }}
    >
      <div className="status-info">
        <Imgc
          className="status-info-img"
          src={require(`assets/${productName}/no_stocks_nri.svg`)}
        />
        <div className="status-info-title">
          Currently, we don't offer trading and demat services to NRI users
        </div>
        <div className="status-info-subtitle">
          Please check back later or continue with your mutual fund KYC
        </div>
      </div>
    </Container>
  );
};

export default NriError;
