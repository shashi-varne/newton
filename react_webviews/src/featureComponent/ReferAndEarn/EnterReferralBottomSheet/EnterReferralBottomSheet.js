import React from "react";
import { BOTTOMSHEETS_CONTENT } from "businesslogic/strings/referAndEarn";
import { Stack } from "@mui/material";
import Typography from "../../../designSystem/atoms/Typography";
import Button from "../../../designSystem/atoms/Button";
import "./EnterReferralBottomSheet.scss";
import InputField from "../../../designSystem/molecules/InputField";
import { isEmpty, noop } from "lodash-es";
import BottomSheet from "../../../designSystem/organisms/BottomSheet/BottomSheet";
const STRINGS = BOTTOMSHEETS_CONTENT.enterReferral;

const EnterReferralBottomSheet = ({
  isOpen,
  value = "",
  inputError = "",
  onChange = noop,
  onPrimaryClick = noop,
  handleClose = noop,
}) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      data-aid={`bottomsheet_${STRINGS.dataAid}`}
    >
      <Stack className={`enter-ref-bottom-sheet-wrapper`}>
        <Typography
          className="btn-sheet-title"
          variant="heading3"
          color={"foundationColors.content.primary"}
          component="div"
          dataAid="title"
        >
          {STRINGS.title}
        </Typography>
        <InputField
          label={STRINGS.inputLabel}
          value={value}
          onChange={onChange}
          dataAid={STRINGS.inputDataAid}
          error={!isEmpty(inputError)}
          helperText={inputError}
        />
        <Stack
          flexDirection="column"
          spacing={1}
          className="btm-sheet-cta-wrapper"
        >
          <Button
            title={STRINGS.primaryButtonTitle}
            onClick={onPrimaryClick}
            dataAid="primary"
          />
          <Button
            title={STRINGS.secondaryButtonTitle}
            variant="secondary"
            onClick={handleClose}
            dataAid="secondary"
          />
        </Stack>
      </Stack>
    </BottomSheet>
  );
};

export default EnterReferralBottomSheet;
