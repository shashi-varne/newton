import React from "react";
import MfLanding from "../../pages/AppLanding/MfLanding";
import { navigate as navigateFunc } from "../../utils/functions";

const screen = "MF_LANDING";
const mfLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);

  return <WrappedComponent />;
};

export default mfLandingContainer(MfLanding);
