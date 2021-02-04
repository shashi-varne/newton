import React, { useState, useEffect } from "react";
import Container from "fund_details/common/Container";
import toast from "common/ui/Toast";
import "../style.scss";

const NpsIdentity = (props) => {
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <Container
      classOverRide="pr-error-container"
      fullWidthButton
      buttonTitle="PROCEED"
      hideInPageTitle
      hidePageTitle
      title="Recommended fund"
      showLoader={loader}
      // handleClick={replaceFund}
      classOverRideContainer="pr-container"
    >
      <div>edcsd</div>
    </Container>
  );
};

export default NpsIdentity;