import React from "react";
import BottomSheet from "../../designSystem/organisms/BottomSheet";

const KycBottomsheet = ({
  isOpen,
  onClose,
  data,
  dataAid,
  onPrimaryClick,
  onSecondaryClick,
}) => {
  if (data.oneButton) {
    onPrimaryClick = data.handleClick || onPrimaryClick;
  } else {
    data.secondaryButtonTitle = data.button2Title || "LATER";
  }
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={data.title}
      imageSrc={require(`assets/fisdom/${data.icon}`)}
      subtitle={data.subtitle}
      primaryBtnTitle={data.buttonTitle}
      secondaryBtnTitle={data.secondaryButtonTitle}
      onPrimaryClick={onPrimaryClick}
      onSecondaryClick={onSecondaryClick}
      dataAid={dataAid}
    />
  );
};

export default KycBottomsheet;
