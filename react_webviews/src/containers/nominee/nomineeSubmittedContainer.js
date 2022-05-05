import React, { useMemo } from "react";
import Success from "../../pages/Nominee/Success";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { NOMINEE_SUBMITTED } from "businesslogic/strings/nominee";

const NomineeSubmittedContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);
  const onClick = () => {};

  return (
    <WrappedComponent
      onClick={onClick}
      productName={productName}
      dataAid={NOMINEE_SUBMITTED.title.dataAid}
      title={NOMINEE_SUBMITTED.successTitle.text}
      titleDataAid={NOMINEE_SUBMITTED.successTitle.dataAid}
      subtitle={NOMINEE_SUBMITTED.successSubtitle.text}
      subtitleDataAid={NOMINEE_SUBMITTED.successSubtitle.dataAid}
    />
  );
};

export default NomineeSubmittedContainer(Success);
