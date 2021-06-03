import React from "react";
import WVLoadingBottomSheet from "../../../common/ui/LoadingBottomSheet/WVLoadingBottomSheet";

const productName = getConfig().productName;
const CheckCompliant = ({ isOpen }) => {
  return (
    <WVLoadingBottomSheet
      isOpen={isOpen}
      gifSrc={require(`assets/${productName}/kyc_loader.gif`)}
      title="Checking for PAN compliance"
      subtitle="Hang on while we check if you’re investment ready"
    />
  );
};

export default CheckCompliant;
