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
          value={this.props.selectedValue}
          onChange={(event) => this.props.onSelect(event)}
          name={this.props.name}
          displayEmpty
          className={this.props.className}
          IconComponent={ExpandMoreIcon}
          style={this.props.style}
          classes={this.props.classes}
          disableUnderline={this.props.disableUnderline}
        >
          <MenuItem value="" disabled>
            {this.props.placeholder}
          </MenuItem>
          <MenuItem value={this.props.value}>{this.props.value}</MenuItem>
        </Select>
      </FormControl>
    </MuiThemeProvider>
  );
};

export default WrSelect;
