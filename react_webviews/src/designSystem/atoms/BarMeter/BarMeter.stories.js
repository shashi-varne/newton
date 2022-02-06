import React from "react";
import BarMeter from "./BarMeter";

export default {
  component: BarMeter,
  title: "Atoms/BarMeter",
  argTypes: {
    activeIndex: {
      defaultValue: 1,
    },
    displayKey: {
      defaultValue: "name",
    },
    dataAid: {
      defaultValue: "demo",
    },
    barMeterData: {
      defaultValue: ["low", "avg", "high"],
    },
  },
};

export const Default = (args) => <BarMeter {...args} />;

export const WithObjectData = (args) => <BarMeter {...args} />;
WithObjectData.args = {
  barMeterData: [
    {
      name: "low",
      value: 1,
    },
    {
      value: 2,
    },
    {
      value: 3,
    },
    {
      name: "above avg data is here",
      value: 4,
    },
    {
      name: "high",
      value: 5,
    },
  ],
};
