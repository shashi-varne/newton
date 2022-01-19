import React, { useMemo } from "react";
import Container from "../common/Container";
import { Imgc } from "../../common/ui/Imgc";
import { getConfig } from "../../utils/functions";

const KycStatus = (props) => {
  const { productName } = useMemo(getConfig, []);

  const handleClick = () => {
    props.history.goBack();
  };

  return (
    <Container
      data-aid="reports-kyc-status"
      buttonTitle="COMPLETE KYC TO START INVESTING"
      handleClick={handleClick}
      hidePageTitle
      classOverRide="reports-kyc-status"
    >
      <Imgc
        src={require(`assets/${productName}/reports_kyc_status.svg`)}
        className="rks-banner"
      />
      <div className="rks-title">You don’t have any holdings yet</div>
      <div>
        Invest in stocks, F&O, IPOs & other primary market products to build
        your equity portfolio now
      </div>
    </Container>
  );
};

export default KycStatus;
