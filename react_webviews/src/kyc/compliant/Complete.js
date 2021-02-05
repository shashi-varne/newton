import React, { useState } from "react";
import Container from "../common/Container";
import { getConfig } from "utils/functions";
import Alert from "../mini_components/Alert";

const productName = getConfig().productName;
const Complete = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);

  const handleClick = () => {};

  return (
    <Container
      showLoader={showLoader}
      hideInPageTitle
      id="kyc-compliant-complete"
      buttonTitle="Ok"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-compliant-complete">
        <header>
          <img
            src={require(`assets/${productName}/ic_process_done.svg`)}
            alt=""
          />
          <div className="title">Kudos, KYC is completed!</div>
          <div className="subtitle">See KYC application details {" >"}</div>
        </header>
        <Alert
          variant="warning"
          title="Note"
          message="Your bank verification is still pending. You will be able to invest once your bank is verified."
        />
      </div>
    </Container>
  );
};

export default Complete;
