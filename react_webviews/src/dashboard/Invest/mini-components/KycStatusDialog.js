import React from "react";
import { getConfig } from "utils/functions";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";

const KycStatusDialog = ({ isOpen, close, data }) => {
  const productName = getConfig().productName;
  return (
    <WVBottomSheet
      open={isOpen}
      onClose={close}
      title={data.title}
      subtitle={data.subtitle}
      image={require(`assets/${productName}/${data.icon}`)}
      button1Props={data.button1Props}
      button2Props={data.button2Props}
    />
  );
};

export default KycStatusDialog;
