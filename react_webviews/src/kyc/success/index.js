import React, { useState, useEffect } from "react";
import { storageService, isEmpty } from "../../utils/validators";
import Container from "../common/Container";
import { storageConstants, getPathname } from "../constants";
import { navigate as navigateFunc } from "../common/functions";
import { initData } from "../services";
import { getConfig } from "../../utils/functions";

const RegistrationSuccess = (props) => {
  const navigate = navigateFunc.bind(props);
  const [showLoader, setShowLoader] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    storageService().getObject(storageConstants.USER) || {}
  );
  const [userKyc, setUserKyc] = useState(
    storageService().getObject(storageConstants.KYC) || {}
  );
  const [isCompliant, setIsCompliant] = useState();
  const [buttonTitle, setButtonTitle] = useState();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    let userkycDetails = { ...userKyc };
    let user = { ...currentUser };
    if (isEmpty(userkycDetails) || isEmpty(user)) {
      setShowLoader(true);
      await initData();
      userkycDetails = storageService().getObject(storageConstants.KYC);
      user = storageService().getObject(storageConstants.USER);
      setUserKyc(userkycDetails);
      setCurrentUser(user);
      setShowLoader(false);
    }
    let is_compliant = userkycDetails.kyc_status === "compliant" ? true : false;
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
    if (currentUser.nps_investment) {
      if (!getConfig().isIframe) {
        navigate(getPathname.reports);
      }
    } else {
      navigate(getPathname.invest);
    }
  };

  return (
    <Container
      showSkelton={showLoader}
      hideInPageTitle
      id="registration-success"
      buttonTitle={buttonTitle}
      title="KYC Submitted"
      disable={showLoader}
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
