import React, { useState } from "react";
import NavigationPopup from "./NavigationPopup";

export default {
  component: NavigationPopup,
  title: "Molecules/NavigationPopup",
  argTypes: {
    activeIndex: {
      defaultValue: 1,
    },
    anchorOriginVertical: {
      options: ["top", "center", "bottom"],
      control: "radio",
      defaultValue: "bottom",
    },
    anchorOriginHorizontal: {
      options: ["left", "center", "right"],
      control: "radio",
      defaultValue: "center",
    },
    transformOriginVertical: {
      options: ["top", "center", "bottom"],
      control: "radio",
      defaultValue: "bottom",
    },
    transformOriginHorizontal: {
      options: ["left", "center", "right"],
      control: "radio",
      defaultValue: "center",
    },
    options: {
      defaultValue: ["label 1", "label 2", "label 3"],
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
    setAnchorEl(event.currentTarget);
  };
  const onClose = () => {
    setAnchorEl(null);
  };
  return (
    <div
      style={{
        minHeight: "800px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          cursor: "pointer",
          padding: "10px 20px",
          backgroundColor: "#35cb5d",
          color: "white",
          width: "100%",
          textAlign: "center",
        }}
        onClick={handleClick}
      >
        Click ME
      </div>
      <NavigationPopup {...args} anchorEl={anchorEl} onClose={onClose} />
    </div>
  );
};
