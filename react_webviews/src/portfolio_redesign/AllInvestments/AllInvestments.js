import { Box, Stack } from "@mui/material";
import { ALL_INVESTMENTS_LANDING } from "businesslogic/strings/portfolio";
import Container from "designSystem/organisms/ContainerWrapper";
import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import WrapperBox from "../../designSystem/atoms/WrapperBox";
import FeatureCard, {
  LeftSlot,
  RightSlot,
} from "../../designSystem/molecules/FeatureCard/FeatureCard";
import { formatUptoFiveDigits } from "../../utils/validators";
import "./AllInvestments.scss";

const dataAidMapper = {
  mf: "mutualFund",
  equity: "stocks",
  nps: "nps",
};

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
            {formatUptoFiveDigits(investmentSummary?.current)}
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
            {formatUptoFiveDigits(investmentSummary?.earnings)}
          </Typography>
        </Box>
      </Stack>
      <Box className="card-container">
        {investments?.map((card, index) => (
          <WrapperBox key={index} elevation={1} className="feature-card">
            <FeatureCard
              style={{
                cursor: "pointer",
              }}
              dataAid={dataAidMapper[card?.type] || ""}
              onCardClick={() => handleCardClick(card)}
              topLeftImgSrc={card?.icon}
              heading={card?.title}
            >
              <LeftSlot
                description={{
                  title:
                    card?.type === "nps" && card?.is_nsdl
                      ? "Invested value"
                      : ALL_INVESTMENTS_LANDING.topInvestmentSection.keyCurrent
                          .text,
                  titleColor: "foundationColors.content.primary",
                  subtitle:
                    card?.type === "nps" && card?.is_nsdl
                      ? formatUptoFiveDigits(card?.invested_value || 0)
                      : formatUptoFiveDigits(card?.current_value || 0),
                  subtitleColor: "foundationColors.content.secondary",
                }}
              />
              <RightSlot
                description={{
                  title:
                    card?.type === "nps" && card?.is_nsdl
                      ? ""
                      : ALL_INVESTMENTS_LANDING.topInvestmentSection.keyPl.text,
                  titleColor: "foundationColors.content.primary",
                  subtitle:
                    card?.type === "nps" && card?.is_nsdl
                      ? ""
                      : `${
                          card?.earnings > 0 ? "+" : ""
                        } ${formatUptoFiveDigits(
                          Math.abs(card?.earnings || 0)
                        )}`,
                  subtitleColor: !card?.earnings
                    ? "foundationColors.content.primary"
                    : card?.earnings > 0
                    ? "foundationColors.secondary.profitGreen.400"
                    : "foundationColors.secondary.lossRed.400",
                }}
              />
            </FeatureCard>
          </WrapperBox>
        ))}
      </Box>
    </Container>
  );
}

export default AllInvestments;
