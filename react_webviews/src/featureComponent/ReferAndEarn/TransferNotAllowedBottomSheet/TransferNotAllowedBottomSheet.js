import React from "react";
import { noop } from "lodash-es";
import ShareCodeComponent from "../ShareCodeComponet/ShareCodeComponent";
import { BOTTOMSHEETS_CONTENT } from "businesslogic/strings/referAndEarn";
import BottomSheet from "../../../designSystem/organisms/BottomSheet";
import "./TransferNotAllowedBottomSheet.scss";

const STRINGS = BOTTOMSHEETS_CONTENT.transferNotAllowed;

const TransferNotAllowedBottomSheet = ({
  isOpen,
  handleClose = noop,
  isWeb = true,
  refferalCode = "ABCD1234",
  onClickCopy = noop,
  onClickMail = noop,
  onClickCta = noop,
}) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      title={STRINGS.title}
      imageTitleSrc={require(`assets/caution.svg`)}
      subtitle={STRINGS.subtitle}
      subtitleColor={"foundationColors.content.tertiary"}
      onClose={handleClose}
      disablePortal={true}
      renderButtonComponent={
        <ShareCodeComponent
          showCopyCode={isWeb}
          refferalCode={refferalCode}
          onClickCopy={onClickCopy}
          onClickMail={onClickMail}
          onClickCta={onClickCta}
          customToastClassName="tna-btm-sheet-toast"
        />
      }
    />
  );
};

export default TransferNotAllowedBottomSheet;
