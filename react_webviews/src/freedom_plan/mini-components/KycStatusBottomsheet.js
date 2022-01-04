import React, { useMemo } from "react";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import { getConfig } from "../../utils/functions";
import noop from "lodash/noop";

const KycStatusBottomsheet = ({
  isOpen = false,
  data = {},
  onClick = noop,
}) => {
  const { productName } = useMemo(getConfig, []);
  return (
    <WVBottomSheet
      isOpen={isOpen}
      title={data.title}
      subtitle={data.subtitle}
      image={require(`assets/${productName}/${data.icon}`)}
      button1Props={{
        title: data.buttonTitle,
        variant: "contained",
        onClick: onClick,
      }}
    />
  );
};

export default KycStatusBottomsheet;
