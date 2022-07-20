import { Box } from "@mui/material";
import { MORE_OPTIONS } from "businesslogic/constants/portfolio";
import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import CategoryCard from "../../designSystem/molecules/CategoryCard";
import "./OptionsGrid.scss";

const optionList = [
  {
    variant: "variant32",
    dataAid: "sipManager",
    title: "SIP manager",
    imgSrc: require("assets/mf_sip.svg"),
    path: "", // goto: TODO:
  },
  {
    variant: "variant32",
    dataAid: "yourFunds",
    title: "Your funds",
    imgSrc: require("assets/mf_your_funds.svg"),
    path: "", // goto: TODO:
  },
  {
    variant: "variant32",
    dataAid: "goalTracker",
    title: "Goal tracker",
    imgSrc: require("assets/mf_goal_tracker.svg"),
    path: "", // goto: TODO:
  },
  {
    variant: "variant32",
    dataAid: "yourOrders",
    title: "Your orders",
    imgSrc: require("assets/mf_your_orders.svg"),
    path: "", // goto: TODO:
  },
  {
    variant: "variant32",
    dataAid: "withdraw",
    title: "Withdraw",
    imgSrc: require("assets/mf_withdraw.svg"),
    path: "/withdraw/reason", // goto: TODO:
  },
];

function OptionsGrid({ handleOption }) {
  return (
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
          <Box className={`card-${index + 1}`}>
            <CategoryCard
              onClick={() => handleOption(option)}
              key={index}
              variant={option.variant}
              dataAid={MORE_OPTIONS[index].dataAid}
              title={MORE_OPTIONS[index].title}
              imgSrc={option.imgSrc}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default OptionsGrid;
