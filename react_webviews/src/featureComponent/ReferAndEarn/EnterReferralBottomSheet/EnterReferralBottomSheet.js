import React from "react";
import { BOTTOMSHEETS_CONTENT } from "businesslogic/strings/referAndEarn";
import { Dialog, Stack } from "@mui/material";
import Typography from "../../../designSystem/atoms/Typography";
import Button from "../../../designSystem/atoms/Button";
import "./EnterReferralBottomSheet.scss";
import { Box } from "@mui/system";
import InputField from "../../../designSystem/molecules/InputField";
import { isEmpty, noop } from "lodash-es";
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
    <Dialog
      variant="bottomsheet"
      keepMounted
      open={isOpen}
      onClose={handleClose}
      data-aid={`bottomsheet_${STRINGS.dataAid}`}
    >
      <Stack className={`bottom-sheet-wrapper`}>
        <Stack
          justifyContent="center"
          alignItems="center"
          className="btm-sheet-indicator"
        >
          <Box
            component="span"
            sx={{ backgroundColor: "foundationColors.supporting.athensGrey" }}
          />
        </Stack>
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
    </Dialog>
  );
};

export default EnterReferralBottomSheet;
