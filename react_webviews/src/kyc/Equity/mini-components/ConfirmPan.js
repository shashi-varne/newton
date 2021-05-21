import React from "react";
import { getConfig } from "../../../utils/functions";
import "./mini-components.scss";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";
import { panUiSet } from "../../common/functions";

const productName = getConfig().productName;
export const ConfirmPan = ({ isOpen, name, pan, handleClick, close }) => {
  const subtitle = (
    <>
      Hi, <b>{name}</b> please confirm that this PAN belongs to you
    </>
  );
  return (
    <WVBottomSheet
      isOpen={isOpen}
      title="Confirm PAN"
      subtitle={subtitle}
      button1Props={{ title: "EDIT PAN", type: "secondary", onClick: close }}
      button2Props={{
        title: "CONFIRM PAN",
        type: "primary",
        onClick: handleClick,
      }}
      image={require(`assets/${productName}/kyc_status_icon.svg`)}
    >
      <div className="kyc-confirm-pan-text" data-aid='kyc-confirm-pan-tex'>{panUiSet(pan)}</div>
    </WVBottomSheet>
  );
};
