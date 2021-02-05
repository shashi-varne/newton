import React, { useState } from "react";
import Container from "../common/Container";

const ConfirmPan = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);

  const handleClick = () => {};

  const handleClick2 = () => {};

  return (
    <Container
      showLoader={showLoader}
      hideInPageTitle
      id="confirm-pan"
      buttonTitle="EDIT PAN"
      buttonTitle2="CONFIRM PAN"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
      handleClick2={handleClick2}
      twoButton={true}
      buttonClassName="confirm-pan-button1"
    >
      <div className="kyc-compliant-confirm-pan">
        <div className="kyc-main-title">Confirm PAN</div>
        <div className="kyc-main-subtitle">
          Confirm your PAN to unlock premium onboarding
        </div>
        <main>
          <img alt="" src={require(`assets/crd_pan.png`)} />
          <div className="pan-block-on-img">
            <div className="user-name">SAI</div>
            <div className="pan-number">
              PAN: <span>AAAAA 1234 A</span>
            </div>
          </div>
        </main>
      </div>
    </Container>
  );
};

export default ConfirmPan;
