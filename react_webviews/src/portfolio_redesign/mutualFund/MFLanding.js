import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { setMfWalkthroughInitiated } from "businesslogic/dataStore/reducers/portfolioV2";
import { MF_LANDING } from "businesslogic/strings/portfolio";
import BottomSheet from "designSystem/organisms/BottomSheet";
import { Steps } from "intro.js-react";
import { isEmpty } from "lodash-es";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import scrollIntoView from "scroll-into-view-if-needed";
import Icon from "../../designSystem/atoms/Icon";
import { STATUS_VARIANTS } from "../../designSystem/atoms/Status/Status";
import Typography from "../../designSystem/atoms/Typography";
import WrapperBox from "../../designSystem/atoms/WrapperBox/WrapperBox";
import CardHorizontal from "../../designSystem/molecules/CardHorizontal";
import InfoCard from "../../designSystem/molecules/InfoCard";
import Container from "../../designSystem/organisms/ContainerWrapper";
import PfFeatureCard from "../../featureComponent/portfolio/PfFeatureCard/PfFeatureCard";
import { getConfig } from "../../utils/functions";
import { formatUptoFiveDigits } from "../../utils/validators";
import LandingBottomsheet from "../portfolioLanding/landingBottomsheet";
import SemiDonutGraph from "../portfolioLanding/SemiDonutGraph";
import ExternalPortfolioCard from "./ExternalPortfolioCard";
import "./MfLanding.scss";
import OptionsGrid from "./OptionsGrid";

const {
  investmentSummary: INVESTMENT_SUMMARY,
  assetAllocationSection: ASSET_ALLOCATION,
} = MF_LANDING;

const productName = getConfig().productName;

const steps = [
  {
    element: ".options-grid .card-1",
    intro: "Click here to view & manage your SIPs",
  },
  {
    element: ".options-grid  .card-2",
    intro: "Click here to view existing investments & fund performance",
  },
  {
    element: ".options-grid .card-3",
    intro: "Click here to track & manage your goals",
  },
  {
    element: ".options-grid .card-4",
    intro: "Click here to view & track your order status",
  },
  {
    element: ".options-grid .card-5",
    intro: "Click here to withdraw funds",
  },
];

const formatSeriesData = (data) => {
  if (isEmpty(data)) return;
  const seriesData = {};
  for (let item of data) {
    if (item?.allocation > 0)
      seriesData[item?.type?.toUpperCase()] = item?.allocation;
  }
  return Object.entries(seriesData);
};

function MFLanding({
  mfSummary,
  goToAssetAllocation,
  externalPfCardData,
  graphData,
  externalPfStatus,
  handleInvestInMf,
  handleEasySip,
  handleExternalPortfolio,
  handleOption,
  externalPfSummary,
  sendEvents,
  showMfWalkthrough,
  navigate,
  handleMissedSip,
  showEasySip,
  showMissedSip,
}) {
  const [isCurrentValueSheetOpen, setIsCurrentValueSheetOpen] = useState(false);
  const [enable, setEnable] = useState(false);
  const dispatch = useDispatch();
  const graphOptions = useMemo(() => {
    return {
      colors: ["#33CF90", "#FE794D", "#5AAAF6"],
      seriesData: formatSeriesData(graphData),
    };
  }, []);
  const renderExternalPortfolioCard = () => {
    const cardHorizontalCases = ["pending", "failed", "trigger_failed"];
    if (externalPfStatus === "init") {
      return (
        <WrapperBox elevation={1}>
          <InfoCard
            imgSrc={require("assets/locked_suit.svg")}
            title={externalPfCardData?.title}
            subtitle={externalPfCardData?.subtitle}
            dataAid={externalPfCardData?.dataAid}
          />
        </WrapperBox>
      );
    } else if (cardHorizontalCases.includes(externalPfStatus)) {
      return (
        <WrapperBox elevation={1}>
          <CardHorizontal
            title={externalPfCardData?.title}
            subtitle={externalPfCardData?.subtitle}
            statusTitle={externalPfCardData?.status}
            statusVariant={STATUS_VARIANTS.WARNING}
            dataAid={externalPfCardData?.dataAid}
            rightImgSrc={require("assets/ext_portfolio.svg")}
            className="external-portfolio-card"
          />
        </WrapperBox>
      );
    } else {
      return (
        <WrapperBox elevation={1}>
          <ExternalPortfolioCard
            summary={externalPfSummary?.data}
            data={externalPfCardData}
          />
        </WrapperBox>
      );
    }
  };
  const setSkipButton = () => {
    const featureContainer = document.querySelector(".feature-container");
    const navLinkContainer = document.querySelector(".navlink-container");
    const featureWidth = featureContainer.getBoundingClientRect().width;
    const navLinkWidth = navLinkContainer.getBoundingClientRect().width;

    if (enable) {
      const tooltipTextContainer = document.querySelector(
        ".introjs-tooltiptext"
      );
      const footer = document.querySelector(".introjs-tooltipbuttons");
      const skipButton = document.createElement("button");
      skipButton.innerText = "Skip";
      skipButton.setAttribute("id", "skip-button");
      skipButton.addEventListener("click", (e) => {
        setEnable(false);
      });
      tooltipTextContainer.style.width = `${featureWidth}px`;
      footer.style.marginLeft = `${navLinkWidth}px`;
      footer.style.width = `${featureWidth}px`;
      footer.insertAdjacentElement("afterbegin", skipButton);
    }
  };
  const scrollToOptions = () => {
    const element = document.getElementById("scrollTo");
    scrollIntoView(element, {
      block: "start",
      inline: "nearest",
      behavior: "smooth",
    });
    setTimeout(() => {
      setEnable(true);
    }, 2000);
  };
  useEffect(() => {
    if (!showMfWalkthrough) {
      // scrollToOptions();
    }
  }, [showMfWalkthrough]);

  useEffect(() => {
    setSkipButton();
  }, [enable]);

  const handleWalkthroughSkip = () => {
    if (enable) dispatch(setMfWalkthroughInitiated());
    setEnable(false);
  };

  const handleBackClick = () => {
    if (isEmpty(getConfig().features)) {
      navigate("/");
    }
  };
  return (
    <Container
      eventData={sendEvents()}
      headerProps={{
        headerTitle: MF_LANDING.navigationHeader.title,
        dataAid: MF_LANDING.navigationHeader.dataAid,
        leftIconSrc: require("assets/back_arrow_white.svg"),
        disableSeeMoreFeature: true,
        headerSx: {
          backgroundColor: "foundationColors.primary.600",
          color: "foundationColors.supporting.white",
        },
        onBackClick: handleBackClick,
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
            {formatUptoFiveDigits(mfSummary?.current_value)}
          </Typography>
          <Box
            onClick={() => {
              sendEvents("current_investment", "yes", "next");
              setIsCurrentValueSheetOpen(true);
            }}
          >
            <Icon
              src={require("assets/eye_icon.svg")}
              className="eye-icon"
              dataAid={INVESTMENT_SUMMARY.currentValueIcon.dataAid}
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
              mfSummary?.one_day_earnings >= 0
                ? "foundationColors.secondary.profitGreen.400"
                : "foundationColors.secondary.lossRed.400"
            }
            dataAid={INVESTMENT_SUMMARY.valueOneDayChange.dataAid}
          >
            {mfSummary?.one_day_earnings >= 0 ? "+" : "-"}
            {formatUptoFiveDigits(Math.abs(mfSummary?.one_day_earnings))} ({" "}
            {mfSummary?.one_day_earnings_percent >= 0 ? "+" : "-"}
            {Math.abs(mfSummary?.one_day_earnings_percent)}%)
          </Typography>
        </Stack>

        <PfFeatureCard
          dataAid={"currentInvestment"}
          textProps={{
            title: "Current investment",
            leftTitle: "Invested",
            leftSubtitle: formatUptoFiveDigits(mfSummary?.invested_value),
            rightTitle: "XIRR",
            rightSubtitle: `${mfSummary.xirr}%`,
            middleTitle: "P&L",
            middleSubtitle: formatUptoFiveDigits(mfSummary?.earnings),
          }}
          rightIcon={require("assets/ec_info.svg")}
          textColors={{
            rightSubtitle: !mfSummary.xirr
              ? "foundationColors.content.primary"
              : mfSummary.xirr > 0
              ? "foundationColors.secondary.profitGreen.400"
              : "foundationColors.secondary.lossRed.400",
          }}
          toolTipProps={{
            rightText:
              "This is your rate of return earned for the various investments made at different points in time",
          }}
        />
      </Box>
      <Box className="info-card-section">
        {showEasySip && (
          <WrapperBox onClick={handleEasySip} elevation={1}>
            <InfoCard
              imgSrc={require("assets/give_cash.svg")}
              title={MF_LANDING.easySip.title}
              subtitle={MF_LANDING.easySip.subtitle}
              dataAid={MF_LANDING.easySip.dataAid}
            />
          </WrapperBox>
        )}

        {showMissedSip && (
          <WrapperBox onClick={handleMissedSip} elevation={1}>
            <InfoCard
              imgSrc={require("assets/missed_sip.svg")}
              title={"Missed SIP"}
              subtitle={"Please pay this month’s SIP"}
              dataAid={"missedSip"}
            />
          </WrapperBox>
        )}

        <Box onClick={handleExternalPortfolio}>
          {renderExternalPortfolioCard()}
        </Box>
      </Box>
      <Box className="banner-section" onClick={handleInvestInMf}>
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

          {/* <Stack
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
          </Stack> */}
        </Stack>
        <Box className="semi-donut-graph">
          <SemiDonutGraph data={graphOptions} />
        </Box>
      </Box>
      <OptionsGrid handleOption={handleOption} />
      {/* <button
        style={{ display: enable ? "inline-block" : "none" }}
        id="skip-button"
        onClick={handleWalkthroughSkip}
      >
        Skip
      </button>
      <Steps
        enabled={enable}
        steps={steps}
        initialStep={0}
        onExit={handleWalkthroughSkip}
      /> */}
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
      <div id="scrollTo"></div>
    </Container>
  );
}

export default MFLanding;
