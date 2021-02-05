import React, { useState } from "react";
import Container from "../common/Container";
import { getConfig } from "utils/functions";

const productName = getConfig().productName;
const Verify = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);

  const handleClick = () => {};

  return (
    <Container
      showLoader={showLoader}
      hideInPageTitle
      id="kyc-compliant-verify"
      buttonTitle="INVEST NOW"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-compliant-complete kyc-compliant-verify">
        <div className="kyc-main-title">KYC verified</div>
        <header>
          <img
            src={require(`assets/${productName}/ic_process_done.svg`)}
            alt=""
          />
          <div className="title">You're ready to invest!</div>
          <div className="subtitle">See KYC application details {" >"}</div>
        </header>
      </div>
    </Container>
  );
};

export default Verify;
