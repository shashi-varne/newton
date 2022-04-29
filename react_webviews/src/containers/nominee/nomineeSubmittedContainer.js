import React, { useMemo } from "react";
import Success from "../../pages/Nominee/Success";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { NOMINEE } from "businesslogic/strings/nominee";

const SubmittedStrings = NOMINEE.nomineeSubmitted;

const NomineeSubmittedContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);
  const onClick = () => {};

  return (
    <WrappedComponent
      onClick={onClick}
      productName={productName}
      dataAid={SubmittedStrings.title.dataAid}
      title={SubmittedStrings.successTitle.text}
      titleDataAid={SubmittedStrings.successTitle.dataAid}
      subtitle={SubmittedStrings.successSubtitle.text}
      subtitleDataAid={SubmittedStrings.successSubtitle.dataAid}
    />
  );
};

export default NomineeSubmittedContainer(Success);
