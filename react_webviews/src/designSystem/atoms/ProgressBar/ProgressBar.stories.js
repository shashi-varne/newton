import React from "react";
import ProgressBar from "./ProgressBar";

export default {
  component: ProgressBar,
  title: "Atoms/ProgressBar",
};

export const Default = (args) => <ProgressBar {...args} />;

export const WithColor = (args) => <ProgressBar {...args} />;
WithColor.args = {
  title: "Title",
  label: "Label",
  percentage: 45,
  progressBackgroundColor: " #ECECF1",
  progressColor: "#D4C3FF",
};
