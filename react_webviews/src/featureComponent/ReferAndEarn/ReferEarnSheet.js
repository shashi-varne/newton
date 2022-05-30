import React from "react";
import BottomSheet from "../../designSystem/organisms/BottomSheet";
import { BOTTOMSHEETS_CONTENT } from "businesslogic/strings/referAndEarn";

const STRINGS = BOTTOMSHEETS_CONTENT.referAndEarnSheet;
const ReferEarnSheet = ({
  isOpen, 
  handleClose,
  onPrimaryClick,
 }) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={STRINGS.title}
      imageSrc={require(`assets/iv_refer_and_earn.svg`)}
      subtitle={STRINGS.subtitle}
      primaryBtnTitle={STRINGS.primaryButtonTitle}
      onPrimaryClick={onPrimaryClick}
      dataAid={STRINGS.dataAid}
    />
  );
};

export default ReferEarnSheet;
