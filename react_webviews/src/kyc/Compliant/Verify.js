import React from "react";
import Container from "../common/Container";
import { getConfig } from "utils/functions";
import { navigate as navigateFunc } from "../common/functions";
import { storageService } from "../../utils/validators";
import { PATHNAME_MAPPER, storageConstants } from "../constants";
import { nativeCallback } from "utils/native_callback";
import "./commonStyles.scss";

const productName = getConfig().productName;
const Verify = (props) => {
  const navigate = navigateFunc.bind(props);

  const handleClick = () => {
    if (storageService().get(storageConstants.NATIVE)) {
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
    >
      <div className="kyc-compliant-complete">
        <header>
          <img
            src={require(`assets/${productName}/ic_process_done.svg`)}
            alt=""
          />
          <div className="title">You're ready to invest!</div>
          <div
            className="subtitle margin-top"
            onClick={() => navigate(PATHNAME_MAPPER.compliantReport)}
          >
            See KYC application details {" >"}
          </div>
        </header>
      </div>
    </Container>
  );
};

export default Verify;
