import React from "react";
import { Stack } from "@mui/material";
import Typography from "../../designSystem/atoms/Typography";
import InputField from "../../designSystem/molecules/InputField";
import Button from "../../designSystem/atoms/Button";
import WrapperBox from "../../designSystem/atoms/WrapperBox";
import { LANDING } from "../../strings/webappLanding";
import PropTypes from "prop-types";

const { applyReferralData } = LANDING;

const ApplyReferral = ({ referral, handleChange, onClick, isLoading }) => {
  return (
    <WrapperBox className="lmw-referral-code" elevation={1}>
      <Typography
        component="div"
        dataAid={applyReferralData.titleDataAid}
        className="lmw-rc-title"
        variant="heading3"
      >
        {applyReferralData.title}
      </Typography>
      <Stack
        flexDirection="row"
        alignItems="center"
        gap="24px"
        justifyContent="space-between"
      >
        <InputField
          dataAid={applyReferralData.inputDataAid}
          label={applyReferralData.inputLabel}
          value={referral}
          onChange={handleChange}
          disabled={isLoading}
        />
        <Button
          size="small"
          title={applyReferralData.buttonTitle}
          dataAid={applyReferralData.buttonDataAid}
          onClick={onClick}
          isLoading={isLoading}
        />
      </Stack>
    </WrapperBox>
  );
};

export default ApplyReferral;

ApplyReferral.propTypes = {
  referral: PropTypes.string,
  onClick: PropTypes.func,
  handleChange: PropTypes.func,
  isLoading: PropTypes.bool,
};
