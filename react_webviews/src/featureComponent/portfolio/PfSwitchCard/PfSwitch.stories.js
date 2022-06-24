import React from "react";
import PfSwitchCard from "./PfSwitchCard";
import { PF_SWITCH_TYPE } from "../PfSwitchCard/PfSwitchCard";

export default {
  component: PfSwitchCard,
  title: "Atoms/PfSwitchCard",
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};

export const SwitchDetail = (args) => <PfSwitchCard {...args} />;

SwitchDetail.args = {
  infoText: "Info Text",
  status: "Accessed",
  topLeftImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  middleImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  label: "Label",
  variant: PF_SWITCH_TYPE.DETAIL,
  title: "Title placeholder lfds dsf ff dfsdlk dsf lkds",
  tags: ["TAG 1", "TAG 2", "TAG 33"],
  description: "Random description",
  middleLabel: "Label 2",
  leftImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  rightImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  centerImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  leftTitle: " Title",
  leftSubtitle: "subtitle",
  centerTitle: " Title",
  centerSubtitle: "subtitle",
  rightTitle: "Title",
  rightSubtitle: "Subtitle",
  onClick: () => console.log("clicked"),
};

export const SwitchProgress = (args) => <PfSwitchCard {...args} />;

SwitchProgress.args = {
  labelOne: "Label 1",
  infoText: "Info Text",
  status: "Accessed",
  topLeftImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  topTitle: "Two line Placeholder wh sdf ldsfj dsflks sdlfj dfskk dlsd",
  topImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  topDesc: "Active",
  variant: PF_SWITCH_TYPE.PROGRESS,
  labelTwo: "Label 2",
  bottomTitle: "Two line Placeholder wh sdf ldsfj dsflks sdlfj dfskk dlsd",
  bottomImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  bottomDesc: "Active",
  switchImgSrc: require("assets/amazon_pay.svg"),
};
