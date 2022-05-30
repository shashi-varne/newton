import React from "react";
import BottomSheet from "../../designSystem/organisms/BottomSheet";

const Campaign = ({
  isOpen,
  onClose,
  campaignData,
  onPrimaryClick,
  onSecondaryClick,
}) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={campaignData.title}
      imageSrc={campaignData.imageSrc}
      subtitle={campaignData.subtitle}
      primaryBtnTitle={campaignData.primaryButtonTitle}
      secondaryBtnTitle={campaignData.secondaryButtonTitle}
      onPrimaryClick={onPrimaryClick}
      onSecondaryClick={onSecondaryClick}
      dataAid="campaign"
    />
  );
};

export default Campaign;
