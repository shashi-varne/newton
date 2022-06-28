import React from "react";
import Container from "designSystem/organisms/ContainerWrapper";
import { Box, Stack } from "@mui/material";
import Typography from "../../designSystem/atoms/Typography";
import "./style.scss";
import PfFeatureCard from "../../featureComponent/portfolio/PfFeatureCard/PfFeatureCard";
import WrapperBox from "../../designSystem/atoms/WrapperBox";

const cardData = [
  {
    src: require("assets/iv_left.svg"),
    title: "Stocks, F&O",
    currentValue: "₹3,00,600",
    pLValue: "₹3,00,600",
  },
  {
    src: require("assets/iv_left.svg"),
    title: "Mutual funds",
    currentValue: "₹3,00,600",
    pLValue: "₹3,00,600",
  },
  {
    src: require("assets/iv_left.svg"),
    title: "NPS",
    currentValue: "₹3,00,600",
    pLValue: "₹3,00,600",
  },
  {
    src: require("assets/iv_left.svg"),
    title: "FD",
    currentValue: "₹3,00,600",
    pLValue: "₹3,00,600",
  },
];

function AllInvestments() {
  return (
    <Container
      headerProps={{
        headerTitle: "Investments",
      }}
      className="all-investments-container"
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
            dataAid={"keyCurrent"}
          >
            Current value
          </Typography>
          <Typography
            variant="body8"
            color="foundationColors.content.primary"
            dataAid={"valueCurrent"}
          >
            ₹3,00,00,000
          </Typography>
        </Box>
        <Box className="pal-value">
          <Typography
            variant="body2"
            color="foundationColors.content.secondary"
            style={{ textAlign: "right" }}
            dataAid={"keyCurrent"}
          >
            P&amp;L
          </Typography>
          <Typography
            variant="body8"
            color="foundationColors.secondary.profitGreen.400"
            dataAid={"valueCurrent"}
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
                leftTitle: "Current value",
                rightTitle: "P&L",
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
