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
  title: "Title Placeholder",
  topImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  leftTitle: "Title 1",
  leftSubtitle: "Subtitle 1",
  rightTitle: "Title 2",
  rightSubtitle: "Subtitle 2",
  middleTitle: "Title 3",
  middleSubtitle: "Subtitle 3",
  leftIcon: require("assets/ec_info.svg"),
  middleIcon: require("assets/ec_info.svg"),
  rightIcon: require("assets/ec_info.svg"),
  onClick: () => console.log("card"),
  onIconClick: () => console.log("icon"),
};

export const WithoutImg = (args) => <PfFeatureCard {...args} />;

WithoutImg.args = {
  title: "Title Placeholder",
  leftTitle: "Title 1",
  leftSubtitle: "Subtitle 1",
  rightTitle: "Title 2",
  rightSubtitle: "Subtitle 2",
  middleTitle: "Title 3",
  middleSubtitle: "Subtitle 3",
  leftIcon: require("assets/ec_info.svg"),
  middleIcon: require("assets/ec_info.svg"),
  rightIcon: require("assets/ec_info.svg"),
  onClick: () => console.log("card"),
  onIconClick: () => console.log("icon"),
};
