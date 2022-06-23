import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Icon from "../../designSystem/atoms/Icon";
import Typography from "../../designSystem/atoms/Typography";
import InfoCard from "../../designSystem/molecules/InfoCard";
import Container from "../../designSystem/organisms/ContainerWrapper";
import "./style.scss";
import { getConfig } from "../../utils/functions";
import CategoryCard from "../../designSystem/molecules/CategoryCard/CategoryCard";

const productName = getConfig().productName;

function MFLanding({}) {
  return (
    <Container
      headerProps={{
        headerTitle: "Mutual funds",
      }}
      className="mf-landing-container"
      noPadding
    >
      <Box
        sx={{
          backgroundColor: "foundationColors.primary.600",
        }}
        className="top-section"
      >
        <Typography
          variant="body2"
          color="foundationColors.supporting.gainsboro"
          dataAid="keyTotalCurrent"
        >
          Total current value
        </Typography>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Typography
            variant="heading1"
            color="foundationColors.supporting.white"
            dataAid="valueTotalCurrent"
            style={{ marginRight: 10 }}
          >
            ₹19.6Cr
          </Typography>
          <Box>
            <Icon
              dataAid="currentValue"
              src={require("assets/eye_icon.svg")}
              className="eye-icon"
            />
          </Box>
        </Stack>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Typography
            variant="body2"
            color="foundationColors.supporting.gainsboro"
            dataAid="keyOneDayChange"
            style={{ marginRight: 4 }}
          >
            1 day change:
          </Typography>
          <Typography
            variant="body2"
            color="foundationColors.secondary.profitGreen.400"
            dataAid="valueOneDayChange"
          >
            + ₹36,865 (+8.6%)
          </Typography>
        </Stack>
      </Box>
      <Box className="info-card-section">
        <Box>
          <InfoCard
            imgSrc={require("assets/give_cash.svg")}
            title="Set up easySIP"
            subtitle="Authorise a one-time eMandate to enable auto-debit of your SIPs"
            dataAid="easySip"
          />
        </Box>
        <InfoCard
          imgSrc={require("assets/locked_suit.svg")}
          title="Import external portfolio"
          subtitle={`Track & manage all your Fisdom & non-Fisdom investments in one place`}
          dataAid="externalPortfolio"
        />
      </Box>
      <Box className="banner-section">
        <Icon
          src={require("assets/mf_marketing_banner.svg")}
          className="marketing-banner"
          dataAid="marketingBanner"
        />
      </Box>

      <Box className="asset-allocation">
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="heading3"
            color="foundationColors.content.primary"
            dataAid="assetAllocation"
          >
            Asset allocation
          </Typography>

          <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Typography
              variant="body8"
              color="foundationColors.action.brand"
              dataAid="title"
              style={{ marginRight: 8 }}
            >
              View details
            </Typography>
            <Icon
              src={require(`assets/${[productName]}/right_arrow_small.svg`)}
            />
          </Stack>
        </Stack>
      </Box>
      <Box className="more-options">
        <Typography
          variant="heading3"
          color="foundationColors.content.primary"
          dataAid="assetAllocation"
        >
          More options
        </Typography>
        <Box className="options-grid">
          <CategoryCard
            variant={"variant32"}
            dataAid={"sipManager"}
            title="SIP manager"
            imgSrc={require("assets/mf_sip.svg")}
          />
          <CategoryCard
            variant={"variant32"}
            dataAid={"yourFunds"}
            title="Your funds"
            imgSrc={require("assets/mf_your_funds.svg")}
          />
          <CategoryCard
            variant={"variant32"}
            dataAid={"goalTracker"}
            title="Goal tracker"
            imgSrc={require("assets/mf_goal_tracker.svg")}
          />
          <CategoryCard
            variant={"variant32"}
            dataAid={"yourOrders"}
            title="Your orders"
            imgSrc={require("assets/mf_your_orders.svg")}
          />
          <CategoryCard
            variant={"variant32"}
            dataAid={"withdraw"}
            title="Withdraw"
            imgSrc={require("assets/mf_withdraw.svg")}
          />
        </Box>
      </Box>
    </Container>
  );
}

export default MFLanding;
