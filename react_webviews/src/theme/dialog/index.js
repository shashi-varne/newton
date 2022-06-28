import { createTheme, Slide } from "@mui/material";
import React from "react";

const defaultTheme = createTheme();

const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const dialogStylesOverride = () => {
  return {
    paper: customPaperStyling,
    root: customRootStyling,
  };
};

const customRootStyling = (props) => {
  if (props?.ownerState?.variant === "bottomsheet") {
    return {
      backgroundColor: "transparent !important",
      [defaultTheme.breakpoints.up("sm")]: {
        top: "60px !important",
      },
    };
  }
};

const customPaperStyling = (props) => {
  if (props?.ownerState?.variant === "bottomsheet") {
    return {
      position: "fixed !important",
      bottom: "0 !important",
      width: "100% !important",
      top: "unset !important",
      margin: "0px !important",
      borderRadius: 12,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      [defaultTheme.breakpoints.up("sm")]: {
        bottom: "unset !important",
        borderRadius: "16px !important",
      },
    };
  }
};

export const dialogDefaultProps = () => {
  return {
    TransitionComponent: SlideTransition,
  };
};
