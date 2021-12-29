import React, { useMemo } from "react";
import { getConfig } from "../../../utils/functions";
import "./mini-components.scss";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";
import { panUiSet } from "../../common/functions";

export const ConfirmPan = ({ isOpen, name, pan, handleClick, close }) => {
  const { productName } = useMemo(() => {
    return getConfig();
  }, []);

  const subtitle = (
    <>
      Hi<b>{name && ` ${name}`}</b>, tap on continue to confirm your name and PAN
      <div className="kyc-confirm-pan-text" data-aid="kyc-confirm-pan-text">
        {panUiSet(pan)}
      </div>
    </>
  );
  return (
    <WVBottomSheet
      isOpen={isOpen}
      title="Confirm your name"
      subtitle={subtitle}
      button1Props={{ title: "EDIT PAN", variant: "outlined", onClick: close }}
      button2Props={{
        title: "CONTINUE",
        variant: "contained",
        onClick: handleClick,
      }}
      image={require(`assets/${productName}/kyc_status_icon.svg`)}
    />
  );
};
