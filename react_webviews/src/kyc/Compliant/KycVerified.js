import React from "react";
import Container from "../common/Container";
import { getConfig } from "utils/functions";
import { navigate as navigateFunc } from "../common/functions";
import { storageService } from "../../utils/validators";
import { PATHNAME_MAPPER, STORAGE_CONSTANTS } from "../constants";
import { nativeCallback } from "utils/native_callback";
import "./commonStyles.scss";

const productName = getConfig().productName;
const KycVerified = (props) => {
  const navigate = navigateFunc.bind(props);

  const handleClick = () => {
    if (storageService().get(STORAGE_CONSTANTS.NATIVE)) {
      nativeCallback({ action: "exit_web" });
    } else {
      navigate(PATHNAME_MAPPER.invest);
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
      <div className="kyc-compliant-complete" data-aid='kyc-compliant-complete'>
        <header data-aid='kyc-compliant-verify-header'>
          <img
            src={require(`assets/${productName}/ic_process_done.svg`)}
            alt=""
          />
          <div className="title" data-aid='kyc-title'>You're ready to invest!</div>
          <div
            className="subtitle margin-top"
            onClick={() => navigate(PATHNAME_MAPPER.kycReport)}
            data-aid='kyc-application-details-text'
          >
            See KYC application details {" >"}
          </div>
        </header>
      </div>
    </Container>
  );
};

export default KycVerified;
