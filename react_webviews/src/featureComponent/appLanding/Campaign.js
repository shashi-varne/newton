import React from "react";
import BottomSheet from "../../designSystem/organisms/BottomSheet";

const Campaign = ({
  isOpen,
  onClose,
  campaignData,
  onPrimaryClick,
  onSecondaryClick,
}) => {
  const buttonData = campaignData?.action_buttons?.buttons || [];
  const secondaryButtonTitle = buttonData?.length === 2 ? buttonData[1]?.title || "Not Now" : "";
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={campaignData.title}
      imageSrc={campaignData.image}
      subtitle={campaignData.subtitle}
      primaryBtnTitle={buttonData[0]?.title}
      secondaryBtnTitle={secondaryButtonTitle}
      onPrimaryClick={onPrimaryClick}
      onSecondaryClick={onSecondaryClick}
      dataAid="campaign"
    />
  );
};

export default Campaign;
