import React from "react";
import { noop } from "lodash-es";
import { BOTTOMSHEETS_CONTENT } from "businesslogic/strings/referAndEarn";
import BottomSheet from "../../../designSystem/organisms/BottomSheet";
import "./TransferNotAllowedBottomSheet.scss";
import { formatAmountInr } from "businesslogic/utils/common/functions";

const STRINGS = BOTTOMSHEETS_CONTENT.transferNotAllowed;

const TransferNotAllowedBottomSheet = ({
  isOpen,
  handleClose = noop,
  onClickCta = noop,
  minAmount,
}) => {
  const subtitle = STRINGS.subtitle.replace(
    "{minAmount}",
    formatAmountInr(minAmount)
  );
  return (
    <BottomSheet
      isOpen={isOpen}
      title={STRINGS.title}
      imageTitleSrc={require(`assets/caution.svg`)}
      subtitle={subtitle}
      subtitleColor={"foundationColors.content.tertiary"}
      onClose={handleClose}
      primaryBtnTitle={"okay"}
      onPrimaryClick={onClickCta}
    />
  );
};

export default TransferNotAllowedBottomSheet;
