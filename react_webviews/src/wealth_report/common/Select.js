import React from "react";
import {
  FormControl,
  Select,
  createMuiTheme,
  MuiThemeProvider,
  MenuItem,
} from "material-ui";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
        fontSize: "15px",
        fontWeight: "600",
        lineHeight: "1.2",
        letterSpacing: "0.76px",
        color: "var(--primary)",
        textTransform: "uppercase",
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
  const classes = {};
  return (
    <MuiThemeProvider theme={theme}>
      <FormControl className={classes.formControl}>
        <Select
          value={props.selectedValue}
          onChange={(event) => props.onSelect(event)}
          name={props.name}
          displayEmpty
          className={props.className}
          IconComponent={ExpandMoreIcon}
          style={props.style}
          classes={props.classes}
          disableUnderline={props.disableUnderline}
        >
          <MenuItem value="" disabled>
            {props.placeholder}
          </MenuItem>
          {props.menu.map((filter, index) => (
            <MenuItem key={index} value={filter.value}>{filter.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </MuiThemeProvider>
  );
};

export default WrSelect;
