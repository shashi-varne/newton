import React from "react";
import Container from "../common/Container";
import { getConfig } from "utils/functions";
import { navigate as navigateFunc } from "../common/functions";
import { storageService } from "../../utils/validators";
import { getPathname, storageConstants } from "../constants";
import { nativeCallback } from "utils/native_callback";
import "./commonStyles.scss";

const productName = getConfig().productName;
const Verify = (props) => {
  const navigate = navigateFunc.bind(props);

  const handleClick = () => {
    if (storageService().get(storageConstants.NATIVE)) {
      nativeCallback({ action: "exit_web" });
    } else {
      navigate(getPathname.invest);
    }
  };

  return (
    <Container
      id="kyc-compliant-verify"
      buttonTitle="INVEST NOW"
      handleClick={handleClick}
      title="KYC verified"
      data-aid='kyc-compliant-verify-screen'
    >
      <div className="kyc-compliant-complete" data-aid='kyc-compliant-complete-container'>
        <header data-aid='kyc-compliant-complete'>
          <img
            src={require(`assets/${productName}/ic_process_done.svg`)}
            alt=""
          />
          <div className="title" data-aid='title'>You're ready to invest!</div>
          <div
            className="subtitle margin-top" data-aid='application-details-text'
            onClick={() => navigate(getPathname.compliantReport)}
          >
            See KYC application details {" >"}
          </div>
        </header>
      </div>
    </Container>
  );
};

export default Verify;
