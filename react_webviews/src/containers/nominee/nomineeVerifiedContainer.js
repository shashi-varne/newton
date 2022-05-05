import React, { useMemo } from "react";
import Success from "../../pages/Nominee/Success";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { NOMINEE_VERIFIED } from "businesslogic/strings/nominee";

const NomineeVerifiedContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);
  const onClick = () => {};

  return (
    <WrappedComponent
      onClick={onClick}
      productName={productName}
      dataAid={NOMINEE_VERIFIED.title.dataAid}
      title={NOMINEE_VERIFIED.successTitle.text}
      titleDataAid={NOMINEE_VERIFIED.successTitle.dataAid}
      subtitle={NOMINEE_VERIFIED.successSubtitle.text}
      subtitleDataAid={NOMINEE_VERIFIED.successSubtitle.dataAid}
    />
  );
};

export default NomineeVerifiedContainer(Success);
