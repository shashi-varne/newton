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

function PortfolioLanding({ handleRealisedGains, handleInsurance }) {
  const [isBottomsheetOpen, setIsBottomsheetOpen] = useState(false);
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
          dataAid="keyTotalCurrent"
          style={{ paddingBottom: 8 }}
        >
          Total current value
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
              dataAid="valueTotalCurrent"
              style={{ marginRight: 8 }}
            >
              ₹19.6L
            </Typography>
            <Icon
              src={require("assets/eye_icon.svg")}
              size="16px"
              dataAid="currentValue"
              className="eye-icon"
              onClick={() => setIsBottomsheetOpen(true)}
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
            dataAid="keyOneDayChange"
            style={{ marginRight: 4 }}
          >
            1 day change:
          </Typography>
          <Typography
            variant="body2"
            color={"foundationColors.secondary.profitGreen.400"} //TODO: change color acc to profit/loss
            dataAid="valueOneDayChange"
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
              dataAid="investedKey"
            >
              Invested amount
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
              dataAid={`keyP&L`}
            >
              P&amp;L
            </Typography>
            <Typography
              variant="heading4"
              color={"foundationColors.supporting.white"}
              dataAid={`valueP&L`}
            >
              + ₹6.1L
            </Typography>
          </Box>
        </Stack>
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent="flex-start"
          onClick={handleRealisedGains}
          className="realised-gains"
        >
          <Typography
            variant="body2"
            color={"foundationColors.supporting.white"}
            dataAid={`realisedGain`}
            style={{ marginRight: 10 }}
          >
            View realised gain
          </Typography>
          <Icon
            src={require("assets/generic_green_right_arrow.svg")}
            width="6px"
            height="10px"
            dataAid={"right"}
          />
        </Stack>
      </Box>
      <Box className="carousel-section">
        <HeadingRow
          title="Investments"
          titleDataAid={"investments"}
          isActionable
        />
        <FeatureCardCarousel />
      </Box>
      <Box className="allocations-section">
        <HeadingRow title="Allocations" titleDataAid={"investmentAllocation"} />
        <Allocations />
      </Box>
      <Box className="bottom-section">
        <Box className="mf-banner">
          <Icon
            width="100%"
            style={{ marginBottom: 24 }}
            src={require("assets/invest_in_mf_banner.svg")}
          />
        </Box>
        <WrapperBox onClick={handleInsurance} elevation={1}>
          <InfoCard
            imgSrc={require("assets/pf_insurance.svg")}
            title={"Insurance"}
            titleColor={"foundationColors.content.primary"}
            subtitle={"Build a safety net for your future"}
            subtitleColor={"foundationColors.content.secondary"}
            dataAid={"insurance"}
          />
        </WrapperBox>
      </Box>
      <BottomSheet
        isOpen={isBottomsheetOpen}
        onClose={() => setIsBottomsheetOpen(false)}
        onBackdropClick={() => setIsBottomsheetOpen(false)}
      >
        <div className="pf-landing-bottomsheet">
          <BottomsheetRow
            label={"Current value"}
            labelId={"keyCurrent"}
            value={"₹19.50,00,500"}
            valueId={"valueCurrent"}
          />
          <BottomsheetRow
            label={"Invested value"}
            labelId={"keyInvested"}
            value={"₹19.50,00,500"}
            valueId={"valueInvested"}
          />
          <BottomsheetRow
            label={"Profit & loss"}
            labelId={"keyProfit&Loss"}
            value={"₹2,24,67,474"}
            valueId={"valueProfit&Loss"}
            valueColor={"foundationColors.secondary.profitGreen.400"}
          />
        </div>
      </BottomSheet>
    </Container>
  );
}

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
            dataAid="viewAll"
            variant="link"
            title="View all"
          />
          <Icon
            src={require("assets/generic_green_right_arrow.svg")}
            width="6px"
            height="10px"
            dataAid={"right"}
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
