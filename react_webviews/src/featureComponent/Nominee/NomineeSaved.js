import React from "react";
import BottomSheet from "../../designSystem/organisms/BottomSheet";

import { BOTTOMSHEETS_CONTENT } from "businesslogic/strings/nominee";

const NOMINEE_SAVED_STRINGS = BOTTOMSHEETS_CONTENT.nomineeSaved;
const NomineeSaved = ({
  isOpen,
  handleClose,
  onSecondaryClick,
  onPrimaryClick,
  productName = "fisdom",
  confirmNominees = false,
}) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={NOMINEE_SAVED_STRINGS.title}
      imageSrc={require(`assets/${productName}/nominee.svg`)}
      subtitle={
        confirmNominees
          ? NOMINEE_SAVED_STRINGS.confirmNomineeSubtitle
          : NOMINEE_SAVED_STRINGS.subtitle
      }
      primaryBtnTitle={
        confirmNominees
          ? NOMINEE_SAVED_STRINGS.confirmNominees
          : NOMINEE_SAVED_STRINGS.addAnotherNominee
      }
      secondaryBtnTitle={
        !confirmNominees && NOMINEE_SAVED_STRINGS.confirmNominees
      }
      onPrimaryClick={onPrimaryClick}
      onSecondaryClick={onSecondaryClick}
      dataAid={NOMINEE_SAVED_STRINGS.dataAid}
    />
  );
};

export default NomineeSaved;
