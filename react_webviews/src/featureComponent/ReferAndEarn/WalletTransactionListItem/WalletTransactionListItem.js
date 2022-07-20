import React from "react";
import Typography from "../../../designSystem/atoms/Typography";
import { WALLET_TRANSFERS } from "businesslogic/strings/referAndEarn";
import { Stack } from "@mui/material";
import Icon from "../../../designSystem/atoms/Icon";
import Separator from "../../../designSystem/atoms/Separator";
import "./WalletTransactionListItem.scss";
import { Box } from "@mui/system";

const STRINGS = WALLET_TRANSFERS;

const StatusIconMapper = {
  success: "iv_badge_successfull.svg",
  failed: "iv_badge_failed.svg",
  processing: "iv_badge_pending.svg",
};

const WalletTransactionListItem = ({
  date,
  account,
  amount,
  dataAid,
  status = "processing",
  statusLabel,
  showSeparator = true,
}) => {
  const badgeIcon = StatusIconMapper[status];
  return (
    <Box className="wallet-transaction-item-container">
      <Stack
        direction="row"
        alignItems="center"
        className="wt-content"
        data-aid={`grp_${dataAid}`}
      >
        {badgeIcon && (
          <Icon
            dataAid={STRINGS.listItem.iconDataAid}
            size="24px"
            src={require(`assets/${badgeIcon}`)}
            className="c-icon-wrapper"
          />
        )}
        <Stack sx={{ flexGrow: 1, marginLeft: "16px" }}>
          <Typography
            variant="body2"
            color="foundationColors.content.primary"
            dataAid={STRINGS.listItem.dateDataAid}
          >
            {date}
          </Typography>
          <Typography
            variant="body5"
            color="foundationColors.content.tertiary"
            dataAid={STRINGS.listItem.accountLabelDataAid}
          >
            {account}
          </Typography>
        </Stack>
        <Stack alignItems={"flex-end"}>
          <Typography
            variant="body1"
            color="foundationColors.content.secondary"
            dataAid={STRINGS.listItem.amountDataAid}
          >
            {amount}
          </Typography>
          <Typography
            variant="body5"
            color="foundationColors.content.tertiary"
            dataAid={STRINGS.listItem.statusDataAid}
          >
            {statusLabel}
          </Typography>
        </Stack>
      </Stack>
      {showSeparator && <Separator />}
    </Box>
  );
};

export default WalletTransactionListItem;
