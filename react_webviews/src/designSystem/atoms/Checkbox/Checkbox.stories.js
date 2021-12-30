import React from "react";
import Checkbox from "./Checkbox";

export default {
  component: Checkbox,
  title: "Atoms/Checkbox",
  argTypes: {
    isSelected: {
      defaultValue: true,
    },
    isDisabled: {
      defaultValue: false,
    },
    onChange: {
      action: "checkbox-clicked",
    },
  },
};

export const Default = (args) => <Checkbox {...args} />;
