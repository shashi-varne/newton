import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import Typography from "@material-ui/core/Typography";
import Tickets from "./tickets";

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

class FullWidthTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <div>
        <div className="tabContainer" style={{ marginTop: "30px" }}>
          <div
            className={`tab ${this.state.value === 0 ? "tabclicked" : ""}`}
            onClick={() => this.handleChange(0)}
          >
            Opened queries
          </div>
          <div
            className={`tab ${this.state.value === 1 ? "tabclicked" : ""}`}
            onClick={() => this.handleChange(1)}
          >
            Closed queries
          </div>
        </div>
        <div
          className="generic-hr hr"
          style={{ left: `${this.state.value === 1 ? "50%" : "0%"}` }}
        ></div>
        <div className="generic-hr"></div>

        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={"ltr"}>
            <Tickets />
          </TabContainer>
          <TabContainer dir={"ltr"}>Item Two</TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}

export default FullWidthTabs;
