import React from "react";
import PfFeatureCard from "./PfFeatureCard";

export default {
  component: PfFeatureCard,
  title: "Atoms/PfFeatureCard",
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};

export const Default = (args) => <PfFeatureCard {...args} />;

Default.args = {
  topImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  textProps: {
    title: "Title Placeholder",
    leftTitle: "Title 1",
    leftSubtitle: "Subtitle 1",
    rightTitle: "Title 2",
    rightSubtitle: "Subtitle 2",
    middleTitle: "Title 3",
    middleSubtitle: "Subtitle 3",
  },
  toolTipProps: {
    leftText: "left tooltip",
    middleText: "middle tooltip",
    rightText: "right tooltip",
  },
  textColors: {
    title: "",
    leftTitle: "",
    leftSubtitle: "",
    rightTitle: "",
    rightSubtitle: "",
    middleTitle: "",
    middleSubtitle: "",
  },
  leftIcon: require("assets/ec_info.svg"),
  middleIcon: require("assets/ec_info.svg"),
  rightIcon: require("assets/ec_info.svg"),
};

export const WithoutImg = (args) => <PfFeatureCard {...args} />;

WithoutImg.args = {
  topImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  textProps: {
    title: "Title Placeholder",
    leftTitle: "Title 1",
    leftSubtitle: "Subtitle 1",
    rightTitle: "Title 2",
    rightSubtitle: "Subtitle 2",
    middleTitle: "Title 3",
    middleSubtitle: "Subtitle 3",
  },
  toolTipProps: {
    leftText: "left tooltip",
    middleText: "middle tooltip",
    rightText: "right tooltip",
  },
  textColors: {
    title: "",
    leftTitle: "",
    leftSubtitle: "",
    rightTitle: "",
    rightSubtitle: "",
    middleTitle: "",
    middleSubtitle: "",
  },
  leftIcon: require("assets/ec_info.svg"),
  middleIcon: require("assets/ec_info.svg"),
  rightIcon: require("assets/ec_info.svg"),
  onIconClick: () => console.log("icon"),
};
