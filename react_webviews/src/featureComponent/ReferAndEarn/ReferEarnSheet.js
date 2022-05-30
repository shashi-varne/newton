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
      title={'Refer & earn'}
      imageSrc={require(`assets/iv_refer_and_earn.svg`)}
      subtitle={'Invite as many friends as you can and earn up to ₹2,00,000'}
      primaryBtnTitle={'REFER NOW'}
      onPrimaryClick={onPrimaryClick}
      dataAid={STRINGS.dataAid}
    />
  );
};

export default ReferEarnSheet;
