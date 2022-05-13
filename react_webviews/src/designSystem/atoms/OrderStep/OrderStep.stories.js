import React from "react";
import OrderStep from "./OrderStep";

export default {
  component: OrderStep,
  title: "Atoms/OrderStep",
  argTypes: {
    stepCount: {
      control: {
        type: "text",
      },
    },
  },
};

export const Default = (args) => <OrderStep {...args} />;

Default.args = {
  buttonTitle: "continue",
  stepCount: 10,
  title: "Title",
  subtitle: "Subtitle",
  label: "Label",
  showStepLine: true,
};
