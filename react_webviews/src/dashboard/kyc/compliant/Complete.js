import React from "react";
import Container from "../common/Container";
import { getConfig } from "utils/functions";
import Alert from "../mini_components/Alert";
import { navigate as navigateFunc } from "../common/functions";
import { getPathname, storageConstants } from "../constants";
import { storageService } from "utils/validators";
import { nativeCallback } from "utils/native_callback";

const Complete = (props) => {
  const productName = getConfig().productName;
  const navigate = navigateFunc.bind(props);

  const handleClick = () => {
    if (storageService().get(storageConstants.NATIVE)) {
      nativeCallback({ action: "exit" });
    } else {
      navigate(getPathname.invest);
    }
  };

  return (
    <Container
      hideInPageTitle
      id="kyc-compliant-complete"
      buttonTitle="Ok"
      handleClick={handleClick}
    >
      <div className="kyc-compliant-complete">
        <header>
          <img
            src={require(`assets/${productName}/ic_process_done.svg`)}
            alt=""
          />
          <div className="title">Kudos, KYC is completed!</div>
          <div
            className="subtitle"
            onClick={() => navigate(getPathname.kycReport)}
          >
            See KYC application details {" >"}
          </div>
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
