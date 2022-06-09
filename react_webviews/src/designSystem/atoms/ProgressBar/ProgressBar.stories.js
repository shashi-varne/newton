import React from "react";
import ProgressBar from "./ProgressBar";

export default {
  component: ProgressBar,
  title: "Atoms/ProgressBar",
  argTypes: {
    progressBackgroundColor: {
      defaultValue: "lightgrey",
    },
    progressColor: {
      defaultValue: "salmon",
    },
    percentage: {
      defaultValue: 40,
    },
    dataAidSuffix: {
      defaultValue: "demo",
    },
  },
};

export const Default = (args) => <ProgressBar {...args} />;
