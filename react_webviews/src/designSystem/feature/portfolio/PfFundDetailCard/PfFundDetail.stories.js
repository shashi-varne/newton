import React from "react";
import PfFundDetail from "./PfFundDetail";
import { PF_DETAIL_VARIANT } from "./PfFundDetail";

export default {
  component: PfFundDetail,
  title: "Molecules/PfFundDetail",
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};

export const PrimaryVariant = (args) => <PfFundDetail {...args} />;

PrimaryVariant.args = {
  onClick: () => {},
  label: "Label",
  topImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  topTitle: "Title",
  middleImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  mainTitle: "Main title placeholder",
  middleLabel: "MLabel",
  bottomTitle: "bottomTitle",
  bottomLabel: "BLabel",
  bottomSubtitle: "BSubtitle",
  variant: PF_DETAIL_VARIANT.PRIMARY,
  bottomImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  bottomRowData: {
    leftTitle: "Left",
    leftImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
    leftSubtitle: "SLeft",
    middleTitle: "Left",
    middleImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
    middleSubtitle: "SLeft",
    rightTitle: "Left",
    rightImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
    rightSubtitle: "SLeft",
  },
};

export const SecondaryVariant = (args) => <PfFundDetail {...args} />;

SecondaryVariant.args = {
  onClick: () => {},
  label: "Label",
  topImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  topTitle: "Title",
  middleImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  mainTitle: "Main title placeholder",
  middleLabel: "MLabel",
  bottomTitle: "bottomTitle",
  bottomLabel: "BLabel",
  bottomSubtitle: "BSubtitle",
  variant: PF_DETAIL_VARIANT.SECONDARY,
  bottomImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
  bottomRowData: {
    leftTitle: "Left",
    leftImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
    leftSubtitle: "SLeft",
    middleTitle: "Left",
    middleImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
    middleSubtitle: "SLeft",
    rightTitle: "Left",
    rightImgSrc: require("assets/fisdom/ELSS_Tax_Savings.svg"),
    rightSubtitle: "SLeft",
  },
};
