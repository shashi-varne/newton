import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import Typography from "@material-ui/core/Typography";
import Tickets from "./tickets";
import { Imgc } from "common/ui/Imgc";
import { SkeltonRect } from "common/ui/Skelton";
import { getConfig } from "utils/functions";

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

class Queries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: {
        closed: false,
        open: false,
      },
      value: 0,
      percent: 0,
      tickets: {},
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    await this.getUserTickets("open");
  };

  handleChange = async (value) => {
    this.setState({ value: value, percent: value === 1 ? 100 : 0 });

    let { tickets } = this.state;
    if (value === 1 && !tickets.closed) {
      await this.getUserTickets("closed");
    }
  };

  handleChangeIndex = async (index) => {
    this.setState({ value: index });

    let { tickets } = this.state;
    if (index === 1 && !tickets.closed) {
      await this.getUserTickets("closed");
    }
  };

  handleSwitch = (index) => {
    let percent = (index / 1) * 100;
    this.setState({
      percent: percent,
    });
  };

  renderTicketError = () => {};

  handleClick = (item) => {
    this.props.history.push(
      { pathname: "conversation", search: getConfig().searchParams },
      { ticket: item }
    );
  };

  render() {
    let { tickets } = this.state;

    return (
      <Container
        // skelton={this.state.skelton}
        title="My Queries"
        noFooter
      >
        <div className="help-queries">
          <div className="nav-bar">
            <div className="tabContainer">
              <div
                className={`tab ${this.state.value === 0 ? "tabclicked" : ""}`}
                onClick={() => this.handleChange(0)}
              >
                Open queries
              </div>
              <div
                className={`tab ${this.state.value === 1 ? "tabclicked" : ""}`}
                onClick={() => this.handleChange(1)}
              >
                Closed queries
              </div>
            </div>
            <div className="generic-hr"></div>
            <div
              className="generic-hr hr"
              style={{ left: `${this.state.percent / 2}%` }}
            ></div>

            <SwipeableViews
              // axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={this.state.value}
              onChangeIndex={this.handleChangeIndex}
              onSwitching={this.handleSwitch}
              enableMouseEvents
            >
              <TabContainer dir={"ltr"}>
                {tickets.open && tickets.open.length > 0 && (
                  <Tickets tickets={tickets.open} onClick={this.handleClick} />
                )}
                {tickets.open && tickets.open.length === 0 && (
                  <div className="no-tickets">
                    <Imgc
                      src={require(`assets/${this.state.productName}/Group 9998.svg`)}
                      className="img"
                      alt=""
                    />
                    You don't have any open tickets
                  </div>
                )}
                {!tickets.open && (
                  <SkeltonRect
                    className="balance-skelton"
                    hide={!this.state.skelton}
                  />
                )}
              </TabContainer>
              <TabContainer dir={"ltr"}>
                {tickets.closed && tickets.closed.length > 0 && (
                  <Tickets tickets={tickets.open} onClick={this.handleClick} />
                )}
                {tickets.closed && tickets.closed.length === 0 && (
                  <div className="no-tickets">
                    <Imgc
                      src={require(`assets/${this.state.productName}/Group 9998.svg`)}
                      className="img"
                      alt=""
                    />
                    You don't have any open tickets
                  </div>
                )}
                {!tickets.closed && (
                  <SkeltonRect
                    className="balance-skelton"
                    hide={!this.state.skelton}
                  />
                )}
              </TabContainer>
            </SwipeableViews>
          </div>
        </div>
      </Container>
    );
  }
}

export default Queries;
