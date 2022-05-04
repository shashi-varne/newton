import React, { useMemo } from "react";
import ESignLanding from "../../pages/Nominee/ESignLanding";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";

const ESignLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);

  const handleProceed = () => {};

  return (
    <WrappedComponent
      onClickProceed={handleProceed}
      productName={productName}
    />
  );
};

export default ESignLandingContainer(ESignLanding);
