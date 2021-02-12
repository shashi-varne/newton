import React from "react";
import Container from "../common/Container";
import { getConfig } from "utils/functions";
import { navigate as navigateFunc } from "../common/functions";
import { storageService } from "../../utils/validators";
import { getPathname } from "../constants";

const productName = getConfig().productName;
const Verify = (props) => {
  const navigate = navigateFunc.bind(props);

  const handleClick = () => {
    if (storageService().get("native")) {
      // callbackWeb.user_exit();
    } else {
      navigate(getPathname.invest);
    }
  };

  return (
    <Container
      hideInPageTitle
      id="kyc-compliant-verify"
      buttonTitle="INVEST NOW"
      handleClick={handleClick}
    >
      <div className="kyc-compliant-complete kyc-compliant-verify">
        <div className="kyc-main-title">KYC verified</div>
        <header>
          <img
            src={require(`assets/${productName}/ic_process_done.svg`)}
            alt=""
          />
          <div className="title">You're ready to invest!</div>
          <div className="subtitle">See KYC application details {" >"}</div>
        </header>
      </div>
    </Container>
  );
};

export default Verify;
