import React from "react";
import { getConfig } from "utils/functions";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";

const KycStatusDialog = ({ isOpen, close, data, handleClick, handleClick2}) => {
  const productName = getConfig().productName;
  let button1Props = {};
  let button2Props = {};
  const defaultButtonProps = {
    variant: "contained",
    title: data.buttonTitle,
    onClick: data.handleClick || handleClick,
  };
  if (data.oneButton) {
    button1Props = defaultButtonProps;
  } else {
    button1Props = {
      variant: "outlined",
      title: data.button2Title || "LATER",
      onClick: handleClick2,
    };
    button2Props = defaultButtonProps;
  }
  return (
    <WVBottomSheet
      isOpen={isOpen}
      onClose={close}
      title={data.title}
      subtitle={data.subtitle}
      image={require(`assets/${productName}/${data.icon}`)}
      button1Props={button1Props}
      button2Props={button2Props}
    />
  );
};

export default KycStatusDialog;
