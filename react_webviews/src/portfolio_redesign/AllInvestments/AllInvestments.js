import React from "react";
import Container from "designSystem/organisms/ContainerWrapper";
import { Box, Stack } from "@mui/material";
import Typography from "../../designSystem/atoms/Typography";
import "./style.scss";
import PfFeatureCard from "../../featureComponent/portfolio/PfFeatureCard/PfFeatureCard";
import WrapperBox from "../../designSystem/atoms/WrapperBox";
import { ALL_INVESTMENTS_LANDING } from "businesslogic/strings/portfolio";

const cardData = [
  {
    src: require("assets/amazon_pay.svg"),
    title: "Stocks, F&O",
    currentValue: "₹3,00,600",
    pLValue: "₹3,00,600",
  },
  {
    src: require("assets/amazon_pay.svg"),
    title: "Mutual funds",
    currentValue: "₹3,00,600",
    pLValue: "₹3,00,600",
  },
  {
    src: require("assets/amazon_pay.svg"),
    title: "NPS",
    currentValue: "₹3,00,600",
    pLValue: "₹3,00,600",
  },
  {
    src: require("assets/amazon_pay.svg"),
    title: "FD",
    currentValue: "₹3,00,600",
    pLValue: "₹3,00,600",
  },
];

function AllInvestments() {
  return (
    <Container
      headerProps={{
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
            ₹3,00,00,000
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
            color="foundationColors.secondary.profitGreen.400"
            dataAid={
              ALL_INVESTMENTS_LANDING.topInvestmentSection.valuePl.dataAid
            }
          >
            + ₹10,26,340
          </Typography>
        </Box>
      </Stack>
      <Box className="card-container">
        {cardData.map((card, index) => (
          <WrapperBox key={index} elevation={1}>
            <PfFeatureCard
              topImgSrc={card.src}
              textProps={{
                title: card.title,
                leftTitle:
                  ALL_INVESTMENTS_LANDING.topInvestmentSection.keyCurrent.text,
                rightTitle:
                  ALL_INVESTMENTS_LANDING.topInvestmentSection.keyPl.text,
                leftSubtitle: card.currentValue,
                rightSubtitle: card.pLValue,
              }}
              className="investment-card"
            />
          </WrapperBox>
        ))}
      </Box>
    </Container>
  );
}

export default AllInvestments;
