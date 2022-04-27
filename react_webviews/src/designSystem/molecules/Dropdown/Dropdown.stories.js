import React from "react";
import Dropdown from "./Dropdown";

export default {
  component: Dropdown,
  title: "Molecules/Dropdown",
  argTypes: {
    disabled: {
      defaultValue: false,
    },
    error: {
      defaultValue: false,
    },
    options: {
      defaultValue: ["label 1", "label 2", "label 3"],
    },
    value: {
      defaultValue: "label 2",
      control: {
        type: "text",
      },
    },
    helperText: {
      control: {
        type: "text",
      },
    },
    label: {
      defaultValue: "Label",
    },
    displayKey: {
      defaultValue: "name",
    },
    valueKey: {
      defaultValue: "value",
    },
    dataAid: {
      defaultValue: "selector",
    },
  },
};

const Template = (args) => <Dropdown {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: "Label",
  variant: "filled",
  helperText: "",
};

export const WithObjectData = (args) => <Dropdown {...args} />;
WithObjectData.args = {
  displayKey: "name",
  valueKey: "value",
  value: "1",
  options: [
    {
      name: "low",
      value: 1,
    },
    {
      name: "avg",
      value: 3,
    },
    {
      name: "high",
      value: 5,
    },
  ],
};
