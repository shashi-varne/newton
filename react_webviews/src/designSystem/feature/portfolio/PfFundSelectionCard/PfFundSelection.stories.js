import React from "react";
import PfFundSelectionCard from "./PfFundSelectionCard";

export default {
  component: PfFundSelectionCard,
  title: "Atoms/PfFundSelectionCard",
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};

export const Default = (args) => <PfFundSelectionCard {...args} />;

Default.args = {
  leftImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  rightImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  middleImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  bottomImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  label: "label",
  checked: true,
  onClick: () => {},
  topTitle: "Main title Main title",
  topLabel: "Top Label",
  leftTitle: " Title",
  leftSubtitle: "subtitle",
  middleTitle: " Title",
  middleSubtitle: "subtitle",
  rightTitle: "Title",
  rightSubtitle: "Subtitle",
  bottomTitle: "Info",
  bottomSubtitle: "Info",
  bottomLabel: "Label",
};
