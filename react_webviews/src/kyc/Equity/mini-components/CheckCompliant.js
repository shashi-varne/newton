import React, { useMemo } from "react";
import WVLoadingBottomSheet from "../../../common/ui/LoadingBottomSheet/WVLoadingBottomSheet";
import { getConfig } from "../../../utils/functions";

const CheckCompliant = ({ isOpen }) => {
  const { productName } = useMemo(() => {
    return getConfig();
  }, []);
  return (
    <WVLoadingBottomSheet
      isOpen={isOpen}
      gifSrc={require(`assets/${productName}/kyc_loader.gif`)}
      title="Checking your KYC status"
      subtitle="Please wait, while we check if you’re investment ready"
    />
  );
};

export default CheckCompliant;
