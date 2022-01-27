import React from "react";
import Badge, { BADGE_VARIANTS } from "./Badge";

export default {
  component: Badge,
  title: "Atoms/Badge",
  argTypes: {
    variant: {
      options: Object.values(BADGE_VARIANTS),
      defaultValue: "standard",
      control: "radio",
    },
    badgeContent: {
      defaultValue: 1,
    },
    dataAid: {
      defaultValue: 1,
    },
  },
};

export const Default = (args) => <Badge {...args} />;
