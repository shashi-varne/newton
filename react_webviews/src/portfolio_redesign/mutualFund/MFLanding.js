import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { MORE_OPTIONS } from "businesslogic/constants/portfolio";
import { MF_LANDING } from "businesslogic/strings/portfolio";
import BottomSheet from "designSystem/organisms/BottomSheet";
import React, { useState } from "react";
import Icon from "../../designSystem/atoms/Icon";
import Typography from "../../designSystem/atoms/Typography";
import WrapperBox from "../../designSystem/atoms/WrapperBox/WrapperBox";
import CardHorizontal from "../../designSystem/molecules/CardHorizontal";
import CategoryCard from "../../designSystem/molecules/CategoryCard/CategoryCard";
import InfoCard from "../../designSystem/molecules/InfoCard";
import Container from "../../designSystem/organisms/ContainerWrapper";
import PfFeatureCard from "../../featureComponent/portfolio/PfFeatureCard/PfFeatureCard";
import { getConfig } from "../../utils/functions";
import { formatAmountInr, numDifferentiation } from "../../utils/validators";
import LandingBottomsheet from "../portfolioLanding/landingBottomsheet";
import SemiDonutGraph from "../portfolioLanding/SemiDonutGraph";
import "./style.scss";
import { STATUS_VARIANTS } from "../../designSystem/atoms/Status/Status";

const {
  investmentSummary: INVESTMENT_SUMMARY,
  assetAllocationSection: ASSET_ALLOCATION,
} = MF_LANDING;

const productName = getConfig().productName;
const optionList = [
  {
    variant: "variant32",
    dataAid: "sipManager",
    title: "SIP manager",
    imgSrc: require("assets/mf_sip.svg"),
    // goto: TODO:
  },
  {
    variant: "variant32",
    dataAid: "yourFunds",
    title: "Your funds",
    imgSrc: require("assets/mf_your_funds.svg"),
    // goto: TODO:
  },
  {
    variant: "variant32",
    dataAid: "goalTracker",
    title: "Goal tracker",
    imgSrc: require("assets/mf_goal_tracker.svg"),
    // goto: TODO:
  },
  {
    variant: "variant32",
    dataAid: "yourOrders",
    title: "Your orders",
    imgSrc: require("assets/mf_your_orders.svg"),
    // goto: TODO:
  },
  {
    variant: "variant32",
    dataAid: "withdraw",
    title: "Withdraw",
    imgSrc: require("assets/mf_withdraw.svg"),
    // goto: TODO:
  },
];

const graphOptions = {
  colors: ["#33CF90", "#FE794D", "#5AAAF6"],
  seriesData: [
    ["Equity", 60],
    ["Debt", 30],
    ["Others", 10],
  ],
};

function MFLanding({ mfSummary, goToAssetAllocation }) {
  const [isCurrentValueSheetOpen, setIsCurrentValueSheetOpen] = useState(false);
  return (
    <Container
      headerProps={{
        headerTitle: MF_LANDING.navigationHeader.title,
        dataAid: MF_LANDING.navigationHeader.dataAid,
        headerSx: {
          //TODO: add header background color
          // backgroundColor: "foundationColors.primary.600",
          // color: "foundationColors.supporting.white",
        },
      }}
      className="mf-landing-container"
      noPadding
      dataAid={MF_LANDING.screenDataAid}
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
          dataAid={INVESTMENT_SUMMARY.keyTotalCurrent.dataAid}
        >
          {INVESTMENT_SUMMARY.keyTotalCurrent.text}
        </Typography>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Typography
            variant="heading1"
            color="foundationColors.supporting.white"
            dataAid={INVESTMENT_SUMMARY.valueTotalCurrent.dataAid}
            style={{ marginRight: 10 }}
          >
            {numDifferentiation(mfSummary?.current_value, true, 1, false, true)}
          </Typography>
          <Box>
            <Icon
              src={require("assets/eye_icon.svg")}
              className="eye-icon"
              dataAid={INVESTMENT_SUMMARY.currentValueIcon.dataAid}
              onClick={() => setIsCurrentValueSheetOpen(true)}
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
            dataAid={INVESTMENT_SUMMARY.keyOneDayChange.dataAid}
            style={{ marginRight: 4 }}
          >
            {INVESTMENT_SUMMARY.keyOneDayChange.text}
          </Typography>
          <Typography
            variant="body2"
            color={
              mfSummary?.one_day_earnings > 0
                ? "foundationColors.secondary.profitGreen.400"
                : "foundationColors.secondary.lossRed.400"
            }
            dataAid={INVESTMENT_SUMMARY.valueOneDayChange.dataAid}
          >
            {mfSummary?.one_day_earnings > 0 ? "+" : "-"}
            {formatAmountInr(Math.abs(mfSummary?.one_day_earnings))} ({" "}
            {mfSummary?.one_day_earnings_percent > 0 ? "+" : "-"}
            {Math.abs(mfSummary?.one_day_earnings_percent)}%)
          </Typography>
        </Stack>

        <PfFeatureCard
          dataAid={INVESTMENT_SUMMARY.pfFeatureCard}
          textProps={{
            title: "Current investment",
            leftTitle: "Invested",
            leftSubtitle: numDifferentiation(
              mfSummary?.invested_value,
              true,
              1,
              false,
              true
            ),
            rightTitle: "XIRR",
            rightSubtitle: `${mfSummary.xirr}%`,
            middleTitle: "P&L",
            middleSubtitle: numDifferentiation(
              mfSummary?.earnings,
              true,
              1,
              false,
              true
            ),
          }}
          rightIcon={require("assets/ec_info.svg")}
          textColors={{
            rightSubtitle: "ffoundationColors.secondary.profitGreen.400",
          }}
          toolTipProps={{
            rightText:
              "This is your rate of return earned for the various investments made at different points in time",
          }}
        />
      </Box>
      <Box className="info-card-section">
        <WrapperBox elevation={1}>
          <InfoCard
            imgSrc={require("assets/give_cash.svg")}
            title={MF_LANDING.easySip.title}
            subtitle={MF_LANDING.easySip.subtitle}
            dataAid={MF_LANDING.easySip.dataAid}
          />
        </WrapperBox>
        {/* <WrapperBox elevation={1}>
          <InfoCard //TODO: change copy according status from businesslogic
            imgSrc={require("assets/locked_suit.svg")}
            title={"MF_LANDING.externalPortfolio.title"}
            subtitle={"MF_LANDING.externalPortfolio.subtitle"}
            dataAid={"MF_LANDING.externalPortfolio.dataAid"}
          />
        </WrapperBox> */}

        <WrapperBox elevation={1}>
          <CardHorizontal //TODO: change copy according status from businesslogic
            title={"Import external portfolio"}
            subtitle={"Forward CAS email to cas@fisdom.com "}
            statusTitle="PENDING ON YOU"
            statusVariant={STATUS_VARIANTS.positive}
            rightImgSrc={require("assets/ext_portfolio.svg")}
            className="external-portfolio-card"
          />
        </WrapperBox>
      </Box>
      <Box className="banner-section">
        <Icon
          src={require("assets/mf_marketing_banner.svg")}
          className="marketing-banner"
          dataAid={MF_LANDING.bannerSection.first.iconDataAid}
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
            dataAid={ASSET_ALLOCATION.title.dataAid}
          >
            {ASSET_ALLOCATION.title.text}
          </Typography>

          <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            onClick={goToAssetAllocation}
            className="view-details"
          >
            <Typography
              variant="body8"
              color="foundationColors.action.brand"
              dataAid={ASSET_ALLOCATION.viewDetails.ctaDataAid}
              style={{ marginRight: 8 }}
            >
              {ASSET_ALLOCATION.viewDetails.ctaTitle}
            </Typography>
            <Icon
              src={require(`assets/${[productName]}/right_arrow_small.svg`)}
              dataAid={ASSET_ALLOCATION.viewDetails.iconDataAid}
            />
          </Stack>
        </Stack>
        <Box className="semi-donut-graph">
          <SemiDonutGraph data={graphOptions} />
        </Box>
      </Box>
      <Box className="more-options">
        <Typography
          variant="heading3"
          color="foundationColors.content.primary"
          dataAid={"more"}
        >
          More options
        </Typography>
        <Box className="options-grid">
          {optionList.map((option, index) => (
            <CategoryCard
              key={index}
              variant={option.variant}
              dataAid={MORE_OPTIONS[index].dataAid}
              title={MORE_OPTIONS[index].title}
              imgSrc={option.imgSrc}
            />
          ))}
        </Box>
      </Box>

      <BottomSheet
        isOpen={isCurrentValueSheetOpen}
        onClose={() => setIsCurrentValueSheetOpen(false)}
        onBackdropClick={() => setIsCurrentValueSheetOpen(false)}
      >
        <LandingBottomsheet
          current={mfSummary?.current_value}
          invested={mfSummary?.invested_value}
          earning={mfSummary?.earnings}
        />
      </BottomSheet>
    </Container>
  );
}

export default MFLanding;
