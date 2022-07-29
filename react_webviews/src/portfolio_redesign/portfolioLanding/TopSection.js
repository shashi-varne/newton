import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { PORTFOLIO_LANDING } from "businesslogic/strings/portfolio";
import Lottie from "lottie-react";
import React, { useState } from "react";
import Icon from "../../designSystem/atoms/Icon";
import Typography from "../../designSystem/atoms/Typography";
import BottomSheet from "../../designSystem/organisms/BottomSheet";
import { formatAmountInr, formatUptoFiveDigits } from "../../utils/validators";
import LandingBottomsheet from "./landingBottomsheet";

const {
  investmentSummary: INVESTMENT_SUMMARY,
  realisedGainSheet: REALISED_GAIN_SHEET,
} = PORTFOLIO_LANDING;

function TopSection({ investmentSummary, sendEvents }) {
  const [isCurrentValueSheetOpen, setIsCurrentValueSheetOpen] = useState(false);
  const [isRealisedGainSheetOpen, setIsRealisedGainSheetOpen] = useState(false);
  const handleInvestmentSummary = () => {
    sendEvents("investments_summary", "yes", "next");
    setIsCurrentValueSheetOpen(true);
  };

  const handleRealisedGain = () => {
    sendEvents("realised_gain", "yes", "next");
    setIsRealisedGainSheetOpen(true);
  };
  return (
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
            {formatUptoFiveDigits(investmentSummary?.current)}
          </Typography>
          <Icon
            src={require("assets/eye_icon.svg")}
            size="16px"
            dataAid={INVESTMENT_SUMMARY.currentValueIcon.dataAid}
            className="eye-icon"
            onClick={handleInvestmentSummary}
          />
        </Stack>

        <Lottie
          animationData={require(`assets/lottie/${
            investmentSummary?.earnings >= 0 ? "positive" : "negative"
          }.json`)}
          autoPlay
          loop
          className="pf-landing-lottie-anim"
          data-aid={
            investmentSummary?.earnings >= 0
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
            investmentSummary?.one_day_earnings >= 0
              ? "foundationColors.secondary.profitGreen.400"
              : "foundationColors.secondary.lossRed.400"
          }
          dataAid={INVESTMENT_SUMMARY.valueOneDayChange.dataAid}
        >
          {investmentSummary?.one_day_earnings >= 0 ? "+" : "-"}
          {formatUptoFiveDigits(investmentSummary?.one_day_earnings)} (
          {investmentSummary?.one_day_earnings >= 0 ? "+" : "-"}
          {investmentSummary?.one_day_earnings_percent?.toFixed(1)}%)
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
            {formatUptoFiveDigits(investmentSummary?.invested)}
          </Typography>
        </Box>
        <Box
          sx={{
            textAlign: "right",
          }}
        >
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
            {formatUptoFiveDigits(investmentSummary?.earnings)}
          </Typography>
        </Box>
      </Stack>
      <Stack
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent="flex-start"
        className="realised-gains"
        onClick={handleRealisedGain}
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
          dataAid="realisedGain"
        />
      </Stack>
      <BottomSheet
        isOpen={isCurrentValueSheetOpen}
        onClose={() => setIsCurrentValueSheetOpen(false)}
        onBackdropClick={() => setIsCurrentValueSheetOpen(false)}
        dataAid={"currentInvestment"}
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
        dataAid={"realisedGain"}
      >
        <RealisedGainSheet
          value={formatAmountInr(investmentSummary?.realised_gain)}
        />
      </BottomSheet>
    </Box>
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

export default TopSection;
