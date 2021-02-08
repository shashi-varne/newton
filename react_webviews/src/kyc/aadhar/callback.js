import React, { useState } from "react";
import Container from "../common/Container";

const AadharCallback = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);

  const handleClick = () => {};

  return (
    <Container
      showLoader={showLoader}
      hideInPageTitle
      id="aadhar-callback"
      buttonTitle="PROCEED"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="aadhar-confirmation">
        <header>Error</header>
        <main>
          <p>
            We are sorry; we are unable to complete eKYC. Please proceed with
            normal KYC process
          </p>
        </main>
      </div>
    </Container>
  );
};

export default AadharCallback;
