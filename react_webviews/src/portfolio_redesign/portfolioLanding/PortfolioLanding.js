import React, { useState } from "react";
import "./style.scss";
import Container from "designSystem/organisms/ContainerWrapper";
import BottomSheet from "designSystem/organisms/BottomSheet";
import Icon from "designSystem/atoms/Icon";
import InfoCard from "designSystem/molecules/InfoCard";
import WrapperBox from "designSystem/atoms/WrapperBox";
import { Box, Stack, Typography } from "@mui/material";
import "./style.scss";
import Button from "../../designSystem/atoms/Button";
import FeatureCardCarousel from "./FeatureCardCarousel";
import Allocations from "./Allocations";
import { PORTFOLIO_LANDING, MF_LANDING } from "businesslogic/strings/portfolio";

const {
  investmentSummary: INVESTMENT_SUMMARY,
  investmentSection: INVESTMENT_SECTION,
  allocationSection: ALLOCATION_SECTION,
  bannerSection: BANNER_SECTION,
  insurance: INSURANCE,
  realisedGainSheet: REALISED_GAIN_SHEET,
} = PORTFOLIO_LANDING;

const { currentInvestmentSheet: CURRENT_INVESTMENT_SHEET } = MF_LANDING;

function PortfolioLanding({ handleInsurance }) {
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
              ₹19.6L
            </Typography>
            <Icon
              src={require("assets/eye_icon.svg")}
              size="16px"
              dataAid={INVESTMENT_SUMMARY.currentValueIcon.dataAid}
              className="eye-icon"
              onClick={() => setIsCurrentValueSheetOpen(true)}
            />
          </Stack>
          <Icon
            src={require("assets/iv_positive.svg")}
            size="40px"
            dataAid={"positive"} //TODO: change id dynamically acc to profit/loss
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
            color={"foundationColors.secondary.profitGreen.400"} //TODO: change color acc to profit/loss
            dataAid={INVESTMENT_SUMMARY.valueOneDayChange.dataAid}
          >
            + ₹36,865 (+8.6%)
            {/* //TODO: get both values dynamically */}
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
              ₹13.5L
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
              + ₹6.1L
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
        <Allocations />
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
      </Box>
      <BottomSheet
        isOpen={isCurrentValueSheetOpen}
        onClose={() => setIsCurrentValueSheetOpen(false)}
        onBackdropClick={() => setIsCurrentValueSheetOpen(false)}
      >
        <div className="pf-landing-bottomsheet">
          <BottomsheetRow
            label={CURRENT_INVESTMENT_SHEET.keyCurrent.text}
            labelId={CURRENT_INVESTMENT_SHEET.keyCurrent.dataAid}
            value={"₹19.50,00,500"}
            valueId={CURRENT_INVESTMENT_SHEET.valueCurrent.dataAid}
          />
          <BottomsheetRow
            label={CURRENT_INVESTMENT_SHEET.keyInvested.text}
            labelId={CURRENT_INVESTMENT_SHEET.keyInvested.dataAid}
            value={"₹19.50,00,500"}
            valueId={CURRENT_INVESTMENT_SHEET.valueInvested.dataAid}
          />
          <BottomsheetRow
            label={CURRENT_INVESTMENT_SHEET.keyProfitLoss.text}
            labelId={CURRENT_INVESTMENT_SHEET.keyProfitLoss.dataAid}
            value={"₹2,24,67,474"}
            valueId={CURRENT_INVESTMENT_SHEET.valueProfitLoss.dataAid}
            valueColor={"foundationColors.secondary.profitGreen.400"}
          />
        </div>
      </BottomSheet>

      <BottomSheet
        isOpen={isRealisedGainSheetOpen}
        onClose={() => setIsRealisedGainSheetOpen(false)}
        onBackdropClick={() => setIsRealisedGainSheetOpen(false)}
      >
        <RealisedGainSheet value={"₹32,50,00,500"} />
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

const BottomsheetRow = ({ label, value, labelId, valueId, valueColor }) => {
  return (
    <Stack
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent="space-between"
      style={{ marginBottom: 24 }}
    >
      <Typography
        variant="heading4"
        color={"foundationColors.content.primary"}
        dataAid={labelId}
      >
        {label}
      </Typography>
      <Typography
        variant="body8"
        color={valueColor || "foundationColors.content.primary"}
        dataAid={valueId}
      >
        {value}
      </Typography>
    </Stack>
  );
};

export default PortfolioLanding;
