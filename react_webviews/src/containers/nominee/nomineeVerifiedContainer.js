import React, { useMemo } from "react";
import Success from "../../pages/Nominee/Success";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { NOMINEE } from "businesslogic/strings/nominee";

const VerifiedStrings = NOMINEE.nomineeVerified;

const NomineeVerifiedContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);
  const onClick = () => {};

  return (
    <WrappedComponent
      onClick={onClick}
      productName={productName}
      dataAid={VerifiedStrings.title.dataAid}
      title={VerifiedStrings.successTitle.text}
      titleDataAid={VerifiedStrings.successTitle.dataAid}
      subtitle={VerifiedStrings.successSubtitle.text}
      subtitleDataAid={VerifiedStrings.successSubtitle.dataAid}
    />
  );
};

export default NomineeVerifiedContainer(Success);
