import React from "react";
import { getConfig } from "../../../utils/functions";
import "./mini-components.scss";
import WVBottomSheet from "../../../common/ui/BottomSheet/index";

const productName = getConfig().productName;
export const ConfirmPan = ({ isOpen, name, pan }) => {
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
      button1Props={{ title: "EDIT PAN", type: "secondary" }}
      button2Props={{ title: "CONFIRM PAN", type: "primary" }}
      image={require(`assets/${productName}/stocks_status_icon.svg`)}
    >
      <div className="kyc-confirm-pan-text">{pan}</div>
    </WVBottomSheet>
  );
};
