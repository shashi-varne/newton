import React, { useState } from "react";
import MenuOverlay from "./MenuOverlay";
import { Box } from "@mui/system";

export default {
  component: MenuOverlay,
  title: "Molecules/MenuOverlay",
  argTypes: {
    labelColor: {
      defaultValue: "foundationColors.content.primary",
    },
    anchorOriginVertical: {
      options: ["top", "center", "bottom"],
      control: "radio",
      defaultValue: "top",
    },
    anchorOriginHorizontal: {
      options: ["left", "center", "right"],
      control: "radio",
      defaultValue: "right",
    },
    transformOriginVertical: {
      options: ["top", "center", "bottom"],
      control: "radio",
      defaultValue: "top",
    },
    transformOriginHorizontal: {
      options: ["left", "center", "right"],
      control: "radio",
      defaultValue: "right",
    },
    options: {
      defaultValue: ["Label 1", "Label  2"],
    },
    onClose: {
      action: "navigation-popup-closed",
    },
    dataAid: {
      defaultValue: "demo",
    },
  },
};

export const Default = (args) => {
  const [anchorEl, setAnchorEl] = useState(false);

  const handleClick = (event) => {
    console.log({ current: event.currentTarget });
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        minHeight: "400px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          cursor: "pointer",
          padding: "10px 16px",
          width: "fit-content",
          textAlign: "center",
          borderRadius: "8px",
          backgroundColor: "#E7E7E7",
        }}
        aria-owns={anchorEl ? "menu-overlay" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        SHOW OVERLAY
      </div>
      <MenuOverlay
        {...args}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClickLabel={(index) => {
          console.log("clicked label", index);
        }}
      />
    </div>
  );
};
