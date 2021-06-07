import React from "react";
import { getConfig, navigate as navigateFunc, } from "../../../utils/functions";
import Container from "../../common/Container";
import "./commonStyles.scss";
import { PATHNAME_MAPPER } from "../../constants";
import { nativeCallback } from "../../../utils/native_callback";
import { Imgc } from "../../../common/ui/Imgc";

const config = getConfig();
const productName = config.productName;
const NriError = (props) => {
  const navigate = navigateFunc.bind(props);
  const stateParams = props?.location?.state;

  const handleClick = () => {
    if(config.Web) {
      navigate("/");
    } else {
      nativeCallback({ action: "exit_web" });
    }
  }
  
  return (
    <Container
      data-aid='nri-error-screen'
      hidePageTitle
      twoButtonVertical={true}
      button1Props={stateParams?.originState === "invest" ? {} :
      {
        type: "primary",
        title: "COMPLETE MUTUAL FUND KYC",
        onClick: () => navigate(PATHNAME_MAPPER.journey)
      }}
      button2Props={{
        type: stateParams?.originState === "invest" ? "primary" : "secondary",
        title: "HOME",
        onClick: handleClick
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
