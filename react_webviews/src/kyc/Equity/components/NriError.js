import React from "react";
import { navigate as navigateFunc } from "../../common/functions";
import { getConfig } from "../../../utils/functions";
import Container from "../../common/Container";
import "./commonStyles.scss";
import { PATHNAME_MAPPER } from "../../constants";
import { nativeCallback } from "../../../utils/native_callback";
import { Imgc } from "../../../common/ui/Imgc";

const productName = getConfig().productName;
const NriError = (props) => {
  const navigate = navigateFunc.bind(props);
  
  return (
    <Container
      data-aid='nri-error-screen'
      hidePageTitle
      twoButtonVertical={true}
      button1Props={{
        type: "primary",
        title: "COMPLETE MUTUAL FUND KYC",
        onClick: () => navigate(PATHNAME_MAPPER.journey)
      }}
      button2Props={{
        type: "secondary",
        title: "HOME",
        onClick: () => nativeCallback({ action: "exit" })
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
