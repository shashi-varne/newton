import React, { useState } from "react";
import Container from "../common/Container";
import { navigate as navigateFunc } from "../common/functions";
import { getPathname } from "../constants";

const AadharCallback = (props) => {
  const [showLoader] = useState(false);
  const navigate = navigateFunc.bind(props);
  const error = props.match.params.error || "";
  let aadhaarError = false;
  let kycFlow = false;
  let aadhaarErrorMessage = "";
  if (error) {
    aadhaarError = true;
    switch (error) {
      case "system_error":
        kycFlow = true;
        aadhaarErrorMessage =
          "We are sorry; we are unable to complete eKYC. Please proceed with normal KYC process";
        break;
      case "mobile_number_mismatch":
        aadhaarErrorMessage =
          "Mobile number does not match with the number registered with Aadhaar";
        break;
      case "invalid_pan":
        aadhaarErrorMessage = "Invalid PAN number";
        break;
      case "ekyc_failure":
        kycFlow = true;
        aadhaarErrorMessage =
          "We are sorry; we are unable to complete eKYC. Please proceed with normal KYC process";
        break;
      case "pan_kyc":
        kycFlow = true;
        aadhaarErrorMessage =
          "We are sorry; we are unable to complete eKYC. Please proceed with normal KYC process";
        break;
      default:
        break;
    }
  } else {
    navigate("");
    // $state.go("pan");
  }
  const handleClick = () => {
    if (kycFlow) navigate("");
    // $state.go("pan");
    else navigate(getPathname.aadhar);
  };

  return (
    <Container
      showSkelton={showLoader}
      hideInPageTitle
      id="aadhar-callback"
      buttonTitle="PROCEED"
      handleClick={handleClick}
    >
      <div className="aadhar-confirmation">
        <header>Error</header>
        <main>
          <p>{aadhaarErrorMessage}</p>
        </main>
      </div>
    </Container>
  );
};

export default AadharCallback;
