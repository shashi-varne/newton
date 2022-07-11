import { Box, Stack, Typography } from "@mui/material";
import { MF_LANDING, PORTFOLIO_LANDING } from "businesslogic/strings/portfolio";
import Icon from "designSystem/atoms/Icon";
import WrapperBox from "designSystem/atoms/WrapperBox";
import InfoCard from "designSystem/molecules/InfoCard";
import BottomSheet from "designSystem/organisms/BottomSheet";
import Container from "designSystem/organisms/ContainerWrapper";
import Lottie from "lottie-react";
import React, { useState } from "react";
import { getConfig } from "utils/functions";
import Button from "../../designSystem/atoms/Button";
import { formatAmountInr, numDifferentiation } from "../../utils/validators";
import Allocations from "./Allocations";
import FeatureCardCarousel from "./FeatureCardCarousel";
import LandingBottomsheet from "./landingBottomsheet";
import "./style.scss";

const productName = getConfig().productName;

const {
  investmentSummary: INVESTMENT_SUMMARY,
  investmentSection: INVESTMENT_SECTION,
  allocationSection: ALLOCATION_SECTION,
  bannerSection: BANNER_SECTION,
  insurance: INSURANCE,
  realisedGainSheet: REALISED_GAIN_SHEET,
} = PORTFOLIO_LANDING;

const { currentInvestmentSheet: CURRENT_INVESTMENT_SHEET } = MF_LANDING;

function PortfolioLanding({
  handleInsurance,
  investmentSummary,
  isInsuranceActive,
  assetWiseData,
  productWiseData,
}) {
  const [isCurrentValueSheetOpen, setIsCurrentValueSheetOpen] = useState(false);
  const [isRealisedGainSheetOpen, setIsRealisedGainSheetOpen] = useState(false);
  return (
    <Container
      headerProps={{
        headerTitle: "Portfolio",
      }}
      noFooter
      className="portfolio-landing-container"
    >
      <Box
        className="top-section"
        sx={{
          backgroundColor: "foundationColors.primary.600",
        }}
      >
        <Typography
          variant="body2"
          color={"foundationColors.supporting.gainsboro"}
          dataAid={INVESTMENT_SUMMARY.keyTotalCurrent.dataAid}
          style={{ paddingBottom: 8 }}
        >
          {INVESTMENT_SUMMARY.keyTotalCurrent.text}
        </Typography>
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent="space-between"
        >
          <Stack
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Typography
              variant="heading1"
              color={"foundationColors.supporting.white"}
              dataAid={INVESTMENT_SUMMARY.valueTotalCurrent.dataAid}
              style={{ marginRight: 8 }}
            >
              {numDifferentiation(
                investmentSummary?.current,
                true,
                1,
                false,
                true
              )}
            </Typography>
            <Icon
              src={require("assets/eye_icon.svg")}
              size="16px"
              dataAid={INVESTMENT_SUMMARY.currentValueIcon.dataAid}
              className="eye-icon"
              onClick={() => setIsCurrentValueSheetOpen(true)}
            />
          </Stack>

          <Lottie
            animationData={require(`assets/lottie/${
              investmentSummary?.earnings > 0 ? "positive" : "negative"
            }.json`)}
            autoPlay
            loop
            className="pf-landing-lottie-anim"
            data-aid={
              investmentSummary?.earnings > 0
                ? INVESTMENT_SUMMARY.plIcon.positiveDataAid
                : INVESTMENT_SUMMARY.plIcon.negativeDataAid
            }
          />
        </Stack>
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent="flex-start"
          className="one-day-change"
        >
          <Typography
            variant="body2"
            color={"foundationColors.supporting.gainsboro"}
            dataAid={INVESTMENT_SUMMARY.keyOneDayChange.dataAid}
            style={{ marginRight: 4 }}
          >
            {INVESTMENT_SUMMARY.keyOneDayChange.text}
          </Typography>
          <Typography
            variant="body2"
            color={
              investmentSummary?.one_day_earnings > 0
                ? "foundationColors.secondary.profitGreen.400"
                : "foundationColors.secondary.lossRed.400"
            }
            dataAid={INVESTMENT_SUMMARY.valueOneDayChange.dataAid}
          >
            {investmentSummary?.one_day_earnings > 0 ? "+" : "-"}
            {formatAmountInr(investmentSummary?.one_day_earnings)} (
            {investmentSummary?.one_day_earnings > 0 ? "+" : "-"}
            {investmentSummary?.one_day_earnings_percent}%)
          </Typography>
        </Stack>
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent="space-between"
          style={{ paddingBottom: 16 }}
        >
          <Box>
            <Typography
              variant="body2"
              color={"foundationColors.supporting.gainsboro"}
              dataAid={INVESTMENT_SUMMARY.investedKey.dataAid}
            >
              {INVESTMENT_SUMMARY.investedKey.text}
            </Typography>
            <Typography
              variant="heading4"
              color={"foundationColors.supporting.white"}
              dataAid="valueInvestedAmount"
            >
              {numDifferentiation(
                investmentSummary?.invested,
                true,
                1,
                false,
                true
              )}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="body2"
              color={"foundationColors.supporting.gainsboro"}
              dataAid={INVESTMENT_SUMMARY.keyPl.dataAid}
            >
              {INVESTMENT_SUMMARY.keyPl.text}
            </Typography>
            <Typography
              variant="heading4"
              color={"foundationColors.supporting.white"}
              dataAid={INVESTMENT_SUMMARY.valuePl.dataAid}
            >
              {numDifferentiation(
                investmentSummary?.earnings,
                true,
                1,
                false,
                true
              )}
            </Typography>
          </Box>
        </Stack>
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent="flex-start"
          className="realised-gains"
          onClick={() => setIsRealisedGainSheetOpen(true)}
        >
          <Typography
            variant="body2"
            color={"foundationColors.supporting.white"}
            dataAid={INVESTMENT_SUMMARY.realisedGain.ctaDataAid}
            style={{ marginRight: 10 }}
          >
            {INVESTMENT_SUMMARY.realisedGain.ctaTitle}
          </Typography>
          <Icon
            src={require("assets/generic_green_right_arrow.svg")}
            width="6px"
            height="10px"
            dataAid={INVESTMENT_SUMMARY.realisedGain.iconDataAid}
          />
        </Stack>
      </Box>
      <Box className="carousel-section">
        <HeadingRow
          title={INVESTMENT_SECTION.title.text}
          titleDataAid={INVESTMENT_SECTION.title.dataAid}
          isActionable
        />
        <FeatureCardCarousel />
      </Box>
      <Box className="allocations-section">
        <HeadingRow
          title={ALLOCATION_SECTION.title.text}
          titleDataAid={ALLOCATION_SECTION.title.dataAid}
        />
        <Allocations
          productWiseData={productWiseData}
          assetWiseData={assetWiseData}
        />
      </Box>
      <Box className="bottom-section">
        <Box className="mf-banner">
          <Icon
            width="100%"
            style={{ marginBottom: 24 }}
            dataAid={BANNER_SECTION.first.iconDataAid}
            src={require("assets/invest_in_mf_banner.svg")}
          />
        </Box>
        {isInsuranceActive && (
          <WrapperBox onClick={handleInsurance} elevation={1}>
            <InfoCard
              imgSrc={require("assets/pf_insurance.svg")}
              title={INSURANCE.title}
              titleColor={"foundationColors.content.primary"}
              subtitle={INSURANCE.subtitle}
              subtitleColor={"foundationColors.content.secondary"}
              dataAid={INSURANCE.dataAid}
            />
          </WrapperBox>
        )}
      </Box>
      <BottomSheet
        isOpen={isCurrentValueSheetOpen}
        onClose={() => setIsCurrentValueSheetOpen(false)}
        onBackdropClick={() => setIsCurrentValueSheetOpen(false)}
      >
        <LandingBottomsheet
          current={investmentSummary?.current}
          invested={investmentSummary?.invested}
          earning={investmentSummary?.earnings}
        />
      </BottomSheet>

      <BottomSheet
        isOpen={isRealisedGainSheetOpen}
        onClose={() => setIsRealisedGainSheetOpen(false)}
        onBackdropClick={() => setIsRealisedGainSheetOpen(false)}
      >
        <RealisedGainSheet
          value={formatAmountInr(investmentSummary?.realised_gain)}
        />
      </BottomSheet>
    </Container>
  );
}

const RealisedGainSheet = ({ value }) => {
  return (
    <Box
      className="realised-gain-sheet"
      data-aid={REALISED_GAIN_SHEET.bottomsheetDataAid}
    >
      <Stack
        flexDirection="row"
        justifyContent={"space-between"}
        alignItems="center"
        style={{ marginBottom: 26 }}
      >
        <Typography
          variant="heading4"
          color={"foundationColors.content.primary"}
          dataAid={REALISED_GAIN_SHEET.keyRealisedGain.dataAid}
        >
          {REALISED_GAIN_SHEET.keyRealisedGain.text}
        </Typography>
        <Typography
          variant="body8"
          color={"foundationColors.content.primary"}
          dataAid={REALISED_GAIN_SHEET.valueRealisedGain.dataAid}
        >
          {value}
        </Typography>
      </Stack>
      <Typography
        variant="body5"
        color={"foundationColors.content.tertiary"}
        dataAid={REALISED_GAIN_SHEET.subtitle.dataAid}
      >
        {REALISED_GAIN_SHEET.subtitle.text}
      </Typography>
    </Box>
  );
};

const HeadingRow = ({ title, titleDataAid, isActionable }) => {
  return (
    <Stack
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      className="heading-row"
    >
      <Typography
        variant="heading4"
        color={"foundationColors.content.primary"}
        dataAid={titleDataAid}
      >
        {title}
      </Typography>
      {isActionable && (
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"flex-start"}
        >
          <Button
            style={{ marginRight: 8 }}
            dataAid={INVESTMENT_SECTION.viewAll.ctaDataAid}
            variant="link"
            title={INVESTMENT_SECTION.viewAll.ctaTitle}
          />
          <Icon
            src={require("assets/generic_green_right_arrow.svg")}
            width="6px"
            height="10px"
            dataAid={INVESTMENT_SECTION.viewAll.iconDataAid}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default PortfolioLanding;
