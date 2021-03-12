import React, { useState } from "react";
import Container from "../common/Container";

const AadharConfirmation = (props) => {
  const [showLoader] = useState(false);

  const handleClick = () => {};

  return (
    <Container
      showSkelton={showLoader}
      hideInPageTitle
      id="aadhar-confirmation"
      buttonTitle="PROCEED"
      disable={showLoader}
      handleClick={handleClick}
    >
      <div className="aadhar-confirmation">
        <header>
          You are now being redirected for Aadhaar authentication. <br />
          You will need to:
        </header>
        <main>
          <p>1. Tick on 'Generate OTP'</p>
          <p>2. You will receive an OTP on your registered mobile number</p>
          <p>3. Enter the OTP</p>
          <p>
            4. Provide your consent for using Aadhaar number for KYC completion
          </p>
          <p>
            5. In the next page, verify your details and fill in any missing
            details
          </p>
        </main>
      </div>
    </Container>
  );
};

export default AadharConfirmation;
