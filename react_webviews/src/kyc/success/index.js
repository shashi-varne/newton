import React, { useState } from "react";
import Container from "../common/Container";

const RegistrationSuccess = (props) => {
  const [showLoader, setShowLoader] = useState(false);

  const [isApiRunning, setIsApiRunning] = useState(false);
  const handleClick = () => {};

  return (
    <Container
      showLoader={showLoader}
      hideInPageTitle
      id="registration-success"
      buttonTitle="GOT IT!"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-registration-success">
        <img src={require(`assets/thumpsup.png`)} alt="Success" />
        <main>
          <p>Thanks for completing your registration.</p>
          <p>
            Thanks for completing your registration.
            <br />
            We will set up your account within 1 working day.
          </p>
          <p>
            Our customer support team will get in touch with you after verifying
            your documents.
          </p>
        </main>
      </div>
    </Container>
  );
};

export default RegistrationSuccess;
