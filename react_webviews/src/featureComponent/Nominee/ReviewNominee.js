import React from "react";
import BottomSheet from "../../designSystem/organisms/BottomSheet";

import { BOTTOMSHEETS_CONTENT } from "businesslogic/strings/nominee";

const STRINGS = BOTTOMSHEETS_CONTENT.reviewNomination;
const ReviewNominee = ({
  isOpen,
  hideAddNominee,
  handleClose,
  onPrimaryClick,
  onSecondaryClick,
}) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={STRINGS.title}
      imageTitleSrc={require(`assets/caution.svg`)}
      subtitle={STRINGS.subtitle}
      primaryBtnTitle={STRINGS.editNominee}
      secondaryBtnTitle={!hideAddNominee ? STRINGS.addAnotherNominee : ""}
      onPrimaryClick={onPrimaryClick}
      onSecondaryClick={onSecondaryClick}
      dataAid={STRINGS.dataAid}
    />
  );
};

export default ReviewNominee;
