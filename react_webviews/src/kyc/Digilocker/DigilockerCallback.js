import React from "react";
import { navigate as navigateFunc } from "utils/functions";
import { getUrlParams } from "../../utils/validators";

const DigilockerCallback = (props) => {
  const navigate = navigateFunc.bind(props);
  const status = getUrlParams().status || "";
  if (status === "success") {
    navigate("/kyc/digilocker/success");
  } else {
    navigate("/kyc/digilocker/failed");
  }

  return <div></div>;
};

export default DigilockerCallback;
