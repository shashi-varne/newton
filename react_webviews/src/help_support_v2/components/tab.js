import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import OpenQueries from "./open_queries";

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = (theme) => ({
  root: {
    // backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
});

class FullWidthTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (value) => {
    this.setState({ value });
  };

  handleChangeIndex = (index) => {
    this.setState({ value: index });
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <div>
        <div className="tabContainer" style={{ marginTop: "30px" }}>
          <div className="tab" onClick={() => this.handleChange(0)}>
            {theme.direction}
          </div>
          <div className="tab" onClick={() => this.handleChange(1)}>
            Closed queries
          </div>
        </div>
        <div className="generic-hr"></div>
        <div
          className="generic-hr hr"
          style={{ left: `${this.state.value === 1 ? "50%" : "0%"}` }}
        ></div>

        <SwipeableViews
          // axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={"ltr"}>
            <OpenQueries />
            {theme.direction}
          </TabContainer>
          <TabContainer dir={"ltr"}>
            Item Two
            {theme.direction}
          </TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(FullWidthTabs);
