import React from "react";
import {
  FormControl,
  Select,
  createMuiTheme,
  MuiThemeProvider,
  MenuItem,
} from "material-ui";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getConfig } from "utils/functions";
const isMobileView = getConfig().isMobileDevice;
const theme = createMuiTheme({
  overrides: {
    MuiSelect: {
      root: {
        backgroundColor: "rgba(80, 45, 168, 0.1)",
        padding: "12px",
        minWidth: "110px",
        borderRadius: "4px",
      },
      select: {
        fontSize: isMobileView ? "13px" : "15px",
        fontWeight: "600",
        lineHeight: "1.2",
        letterSpacing: "0.76px",
        color: "var(--primary)",
        textTransform: "capitalize",
        textAlign: "center"
      },
      icon: {
        right: "12px",
        color: "#502da8",
        top: "calc(50% - 16px)",
        position: "absolute",
        pointerEvents: "none",
        fontSize: "28px",
      },
    },
  },
});

const WrSelect = (props) => {
  const { classes = {} } = props;
  return (
    <MuiThemeProvider theme={theme}>
      <FormControl className={classes.formControl} disabled={props.disabled}>
        <Select
          value={props.selectedValue}
          onChange={(event) => props.onSelect(event)}
          name={props.name}
          IconComponent={ExpandMoreIcon}
          style={props.style}
          classes={classes.select}
          disableUnderline={props.disableUnderline}
        >
          {props.menu.map((filter, index) => (
            <MenuItem key={index} value={filter.value}>{filter.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </MuiThemeProvider>
  );
};

export default WrSelect;
