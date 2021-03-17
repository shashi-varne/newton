import React, { useState, useEffect } from "react";
import { isEmpty } from "../../utils/validators";
import Container from "../common/Container";
import { getPathname } from "../constants";
import { navigate as navigateFunc } from "../common/functions";
import { getConfig } from "../../utils/functions";
import useUserKycHook from "../common/hooks/userKycHook";

const RegistrationSuccess = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isCompliant, setIsCompliant] = useState();
  const [buttonTitle, setButtonTitle] = useState();

  const [kyc, user, isLoading] = useUserKycHook();

  useEffect(() => {
    if (!isEmpty(kyc)) {
      initialize();
    }
  }, [kyc]);

  const initialize = async () => {
    let is_compliant = kyc.kyc_status === "compliant" ? true : false;
    setIsCompliant(is_compliant);
    let title = "GOT IT!";
    if (is_compliant) title = "START INVESTING";
    setButtonTitle(title);
  };

  const handleClick = () => {
    if (isCompliant) {
      proceed();
    } else {
      checkNPSAndProceed();
    }
  };

  const proceed = () => {
    navigate(getPathname.invest);
  };

  const checkNPSAndProceed = () => {
    if (user.nps_investment) {
      if (!getConfig().isIframe) {
        navigate(getPathname.reports);
      }
    } else {
      navigate(getPathname.invest);
    }
  };

  return (
    <Container
      skelton={isLoading}
      // hideInPageTitle
      id="registration-success"
      buttonTitle={buttonTitle}
      title="KYC Submitted"
      // disable={isLoading}
      handleClick={handleClick}
      force_hide_inpage_title={true}
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
