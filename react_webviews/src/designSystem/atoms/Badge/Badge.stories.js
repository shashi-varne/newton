import React from "react";
import { Imgc } from "../../../common/ui/Imgc";
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

export const WithIcon = (args) => (
  <div
    style={{
      textAlign: "center",
      padding: "10px",
    }}
  >
    <Badge {...args}>
      <Imgc
        src={require("assets/cub.png")}
        style={{
          width: "20px",
          height: "20px",
        }}
      />
    </Badge>
  </div>
);
