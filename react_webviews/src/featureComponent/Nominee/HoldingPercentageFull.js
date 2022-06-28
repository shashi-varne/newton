import React from "react";
import BottomSheet from "../../designSystem/organisms/BottomSheet";

import { BOTTOMSHEETS_CONTENT } from "businesslogic/strings/nominee";

const STRINGS = BOTTOMSHEETS_CONTENT.holdingsFull;
const HoldingsPercentageFull = ({ isOpen, handleClose, onPrimaryClick }) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={STRINGS.title}
      imageTitleSrc={require(`assets/caution.svg`)}
      subtitle={STRINGS.subtitle}
      primaryBtnTitle={STRINGS.edit}
      onPrimaryClick={onPrimaryClick}
      dataAid={STRINGS.dataAid}
    />
  );
};

export default HoldingsPercentageFull;
