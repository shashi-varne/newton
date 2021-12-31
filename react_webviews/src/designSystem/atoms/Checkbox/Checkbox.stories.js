import React from "react";
import Checkbox from "./Checkbox";

export default {
  component: Checkbox,
  title: "Atoms/Checkbox",
  argTypes: {
    checked: {
      defaultValue: true,
    },
    disabled: {
      defaultValue: false,
    },
    onChange: {
      action: "checkbox-clicked",
    },
    value: {
      control: {
        type: "text"
      }
    }
  },
};

export const Default = (args) => <Checkbox {...args} />;
