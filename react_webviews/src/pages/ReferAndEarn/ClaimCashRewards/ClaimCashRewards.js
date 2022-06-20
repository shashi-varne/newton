import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import Typography from "../../../designSystem/atoms/Typography";
import { CLAIM_CASH_REWARDS } from "businesslogic/strings/referAndEarn";
import { Stack } from "@mui/material";
import HeaderTitle from "../../../designSystem/molecules/HeaderTitle/HeaderTitle";
import WrapperBox from "../../../designSystem/atoms/WrapperBox";
import InputField from "../../../designSystem/molecules/InputField";
import { isEmpty } from "lodash-es";
import Checkbox from "../../../designSystem/atoms/Checkbox/Checkbox";
import "./ClaimCashRewards.scss";

const STRINGS = CLAIM_CASH_REWARDS;

const ClaimCashRewards = ({
  minAmount,
  amount,
  totalBalance,
  accDetails,
  inputError,
  isPageLoading,
  buttonDisabled,
  transferFullFlag,
  onChangeAmount,
  onCheckTransferFull,
  onClickTransfer,
  sendEvents,
}) => {
  return (
    <Container
      headerProps={{
        dataAid: STRINGS.title.dataAid,
        headerTitle: STRINGS.title.text,
        hideInPageTitle: true,
      }}
      footer={{
        button1Props: {
          title: STRINGS.cta.text,
          dataAid: STRINGS.cta.dataAid,
          onClick: onClickTransfer,
          disabled: buttonDisabled,
        },
      }}
      isPageLoading={isPageLoading}
      className="claim-cash-rewards"
      dataAid={STRINGS.screenDataAid}
      eventData={sendEvents("just_set_events")}
    >
      <Stack>
        <HeaderTitle
          sx={{ marginTop: "24px", marginBottom: "24px" }}
          title={STRINGS.headerTitle.text + totalBalance}
          dataAid={STRINGS.headerTitle.dataAid}
        />
        <WrapperBox elevation={1}>
          <Stack className="ccr-enter-amount-wrapper">
            <Typography
              variant="heading4"
              dataAid={STRINGS.enterAmount.dataAid}
            >
              {STRINGS.enterAmount.text}
            </Typography>
            <InputField
              variant="outlined"
              prefix={<Typography variant="body2">₹</Typography>}
              value={amount}
              onChange={onChangeAmount}
              inputMode="numeric"
              error={!isEmpty(inputError)}
              helperText={inputError || STRINGS.helperText + minAmount}
            />
            <Stack
              direction={"row"}
              sx={{ pt: "16px" }}
              alignItems="center"
              justifyContent="flex-start"
              onClick={onCheckTransferFull}
            >
              <Checkbox checked={transferFullFlag} dataAid={"1"} />
              <Typography
                variant="body2"
                color="foundationColors.content.secondary"
                className="pointer"
                dataAid={STRINGS.withdrawAll.dataAid}
              >
                {STRINGS.withdrawAll.text}
              </Typography>
            </Stack>
          </Stack>
        </WrapperBox>
        <Typography
          sx={{ marginTop: "16px" }}
          variant="body2"
          color="foundationColors.supporting.cadetBlue"
          dataAid={STRINGS.noteDataAid}
        >
          {`Note: Amount will be credited to your ${accDetails.name} account ending with ${accDetails.number}`}
        </Typography>
      </Stack>
    </Container>
  );
};

export default ClaimCashRewards;
