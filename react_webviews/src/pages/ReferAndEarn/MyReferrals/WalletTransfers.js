import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import Typography from "../../../designSystem/atoms/Typography";
import { WALLET_TRANSFERS } from "businesslogic/strings/referAndEarn";
import { WALLET_TRANSFERS_FILTER_DATA } from "businesslogic/constants/referAndEarn";
import { Box, Stack } from "@mui/material";
import { Pill, Pills } from "../../../designSystem/atoms/Pills";
import WalletTransactionListItem from "../../../featureComponent/ReferAndEarn/WalletTransactionListItem";

import "./WalletTransfers.scss";
const STRINGS = WALLET_TRANSFERS;

const WalletTransfers = ({
  transactionData = [],
  sendEvents,
  isPageLoading,
  filterApplied,
  handleWalletFilter,
}) => {
  return (
    <Container
      headerProps={{
        dataAid: STRINGS.title.dataAid,
        headerTitle: STRINGS.title.text,
        subtitle: "View wallet to bank transfer history",
      }}
      isPageLoading={isPageLoading}
      className="wallet-transactions"
      dataAid={STRINGS.screenDataAid}
      eventData={sendEvents("just_set_events")}
      fixedFooter={true}
      renderComponentAboveFooter={<FooterComponent />}
    >
      <Stack>
        <Box className="wt-pill-filter-wrapper">
          <Pills
            value={filterApplied}
            sx={{ pointerEvents: isPageLoading ? "none" : "default" }}
            onChange={handleWalletFilter}
          >
            {WALLET_TRANSFERS_FILTER_DATA.map((item, index) => (
              <Pill
                label={item.label}
                value={item.value}
                dataAid={item.dataAid}
              />
            ))}
          </Pills>
        </Box>
        {transactionData.map((item, index) => {
          const isLastItem = index + 1 === transactionData.length;
          return (
            <WalletTransactionListItem
              amount="₹80,000"
              date="3 May, 2022"
              account="HDFC •••••••• 9220"
              status="pending"
              showSeparator={!isLastItem}
              dataAid={`${index + 1}`}
            />
          );
        })}
      </Stack>
    </Container>
  );
};

const FooterComponent = () => {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: "foundationColors.primary.100",
      }}
      className="wt-footer"
      data-aid={`grp_${STRINGS.footer.dataAid}`}
    >
      <Typography
        variant="body2"
        dataAid={STRINGS.footer.dataAid}
        color="foundationColors.content.tertiary"
      >
        {STRINGS.footer.text}
        <Typography
          variant="body2"
          component="span"
          onClick={() => {
            console.log("footer");
          }}
          color={"foundationColors.action.brand"}
        >
          {STRINGS.footer.secondaryText}
        </Typography>
      </Typography>
    </Stack>
  );
};

export default WalletTransfers;
