import React from "react";
import Container from "designSystem/organisms/ContainerWrapper";
import { Box, Stack } from "@mui/material";
import Typography from "../../designSystem/atoms/Typography";
import "./AllInvestments.scss";
import PfFeatureCard from "../../featureComponent/portfolio/PfFeatureCard/PfFeatureCard";
import WrapperBox from "../../designSystem/atoms/WrapperBox";
import { ALL_INVESTMENTS_LANDING } from "businesslogic/strings/portfolio";
import { formatAmountInr } from "../../utils/validators";

function AllInvestments({
  investments,
  investmentSummary,
  handleCardClick,
  sendEvents,
}) {
  return (
    <Container
      eventData={sendEvents()}
      headerProps={{
        hideInPageTitle: true,
        headerTitle:
          ALL_INVESTMENTS_LANDING.topInvestmentSection.screenTitle.text,
      }}
      className="all-investments-container"
      dataAid={ALL_INVESTMENTS_LANDING.topInvestmentSection.screenTitle.dataAid}
    >
      <Stack
        flexDirection={"row"}
        alignItems="center"
        justifyContent={"space-between"}
        className="investment-details"
      >
        <Box className="current-value">
          <Typography
            variant="body2"
            color="foundationColors.content.secondary"
            dataAid={
              ALL_INVESTMENTS_LANDING.topInvestmentSection.keyCurrent.dataAid
            }
          >
            {ALL_INVESTMENTS_LANDING.topInvestmentSection.keyCurrent.text}
          </Typography>
          <Typography
            variant="body8"
            color="foundationColors.content.primary"
            dataAid={
              ALL_INVESTMENTS_LANDING.topInvestmentSection.valueCurrent.dataAid
            }
          >
            {formatAmountInr(investmentSummary?.current)}
          </Typography>
        </Box>
        <Box className="pal-value">
          <Typography
            variant="body2"
            color="foundationColors.content.secondary"
            style={{ textAlign: "right" }}
            dataAid={ALL_INVESTMENTS_LANDING.topInvestmentSection.keyPl.dataAid}
          >
            {ALL_INVESTMENTS_LANDING.topInvestmentSection.keyPl.text}
          </Typography>
          <Typography
            variant="body8"
            color={
              investmentSummary?.earnings > 0
                ? "foundationColors.secondary.profitGreen.400"
                : "foundationColors.secondary.lossRed.400"
            }
            dataAid={
              ALL_INVESTMENTS_LANDING.topInvestmentSection.valuePl.dataAid
            }
          >
            {investmentSummary?.earnings > 0 && "+"}
            {formatAmountInr(investmentSummary?.earnings)}
          </Typography>
        </Box>
      </Stack>
      <Box className="card-container">
        {investments?.map((card, index) => (
          <WrapperBox key={index} elevation={1} className="">
            <PfFeatureCard
              onClick={() => handleCardClick(card)}
              topImgSrc={card.icon}
              textProps={{
                title: card.title,
                leftTitle:
                  ALL_INVESTMENTS_LANDING.topInvestmentSection.keyCurrent.text,
                rightTitle:
                  ALL_INVESTMENTS_LANDING.topInvestmentSection.keyPl.text,
                leftSubtitle: formatAmountInr(card?.current_value || 0),
                rightSubtitle: `${
                  card?.earnings > 0 ? "+" : ""
                } ${formatAmountInr(Math.abs(card?.earnings || 0))}`,
              }}
              className="investment-card"
              textColors={{
                rightSubtitle: !card?.earnings
                  ? "foundationColors.content.primary"
                  : card?.earnings > 0
                  ? "foundationColors.secondary.profitGreen.400"
                  : "foundationColors.secondary.lossRed.400",
              }}
            />
          </WrapperBox>
        ))}
      </Box>
    </Container>
  );
}

export default AllInvestments;
