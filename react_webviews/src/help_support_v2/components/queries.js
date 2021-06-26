import React, { Component } from "react";
import Container from "../common/Container";
import { initialize, getUserTickets } from "../common/functions";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import Typography from "@material-ui/core/Typography";
import Tickets from "./tickets";
import { Imgc } from "common/ui/Imgc";
import { SkeltonRect } from "common/ui/Skelton";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";

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
      tickets: {},
      fromScreen: "",
    };
    this.initialize = initialize.bind(this);
    this.getUserTickets = getUserTickets.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  componentDidUpdate() {
    this.swipeableActions.updateHeight();
  }

  onload = () => {
    let fromScreen = this.props.location.state?.fromScreen || "/help";

    let status = this.props.location?.state?.status;

    this.setState({
      fromScreen: fromScreen,
      value: status === "closed" ? 1 : 0,
    });

    if (status === "closed") {
      this.getTickets("closed");
    } else {
      this.getTickets("open");
    }
  };

  getTickets = async (value) => {
    let result = await this.getUserTickets(value);

    let { tickets } = this.state;

    tickets[value] = result.tickets;
    this.setState({
      tickets: tickets,
    });
  };

  handleChangeIndex = (index) => {
    this.setState({ value: index });

    let { tickets } = this.state;
    if (index === 1 && !tickets.closed) {
      !tickets.closed && this.getTickets("closed");
    } else {
      !tickets.open && this.getTickets("open");
    }
  };

  renderTicketError = () => {};

  handleClick = (item) => {
    this.sendEvents("next", { ticket_id: item.ticket_id });
    this.props.history.push(
      { pathname: "conversation", search: getConfig().searchParams },
      { ticket: item }
    );
  };

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "help_and_support",
      properties: {
        user_action: user_action,
        screen_name: "my_queries",
        open_queries: this.state.tickets.open
          ? this.state.tickets.open.length > 0
            ? "yes"
            : "no"
          : "no",
        ticket_clicked: data.ticket_id || "",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  goBack = () => {
    this.sendEvents("back");
    let { fromScreen } = this.state;
    if (fromScreen === "send_query" || fromScreen === "/help") {
      this.navigate("/help");
    } else {
      this.props.history.goBack();
    }
  };

  render() {
    let { tickets, value } = this.state;

    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showError={this.state.showError}
        errorData={this.state.errorData}
        title="My Queries"
        headerData={{
          goBack: this.goBack,
        }}
        noFooter
      >
        <div className="help-queries">
          <div className="nav-bar">
            <div className="tabContainer">
              <div
                className={`tab ${this.state.value === 0 ? "tabclicked" : ""}`}
                onClick={() => this.handleChangeIndex(0)}
              >
                Open queries
              </div>
              <div
                className={`tab ${this.state.value === 1 ? "tabclicked" : ""}`}
                onClick={() => this.handleChangeIndex(1)}
              >
                Closed queries
              </div>
            </div>
            <div className="generic-hr"></div>
            <div
              className="generic-hr hr"
              style={{ left: `${value === 1 ? "50" : "0"}%` }}
            ></div>

            <SwipeableViews
              // axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={this.state.value}
              onChangeIndex={this.handleChangeIndex}
              action={(actions) => {
                this.swipeableActions = actions;
              }}
              style={{ height: "80vh" }}
              enableMouseEvents
            >
              <TabContainer dir={"ltr"}>
                <div id="viewScroll"></div>
                {tickets.open && tickets.open.length > 0 && (
                  <Tickets tickets={tickets.open} onClick={this.handleClick} />
                )}
                {!tickets.open && (
                  <SkeltonRect
                    className="balance-skelton"
                    hide={!this.state.skelton}
                  />
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
              </TabContainer>
              <TabContainer dir={"ltr"}>
                <div id="viewScroll"></div>
                {tickets.closed && tickets.closed.length > 0 && (
                  <Tickets
                    tickets={tickets.closed}
                    onClick={this.handleClick}
                  />
                )}
                {tickets.closed && tickets.closed.length === 0 && (
                  <div className="no-tickets">
                    <Imgc
                      src={require(`assets/${this.state.productName}/Group 9998.svg`)}
                      className="img"
                      alt=""
                    />
                    You don't have any closed tickets
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
