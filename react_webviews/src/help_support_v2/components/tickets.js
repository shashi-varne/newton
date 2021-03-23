import React, { Component } from "react";
import { initialize } from "../common/functions";
import scrollIntoView from "scroll-into-view-if-needed";

const moment = require("moment");
class OpenTickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
      tickets: "",
      index: 0,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let tickets = [...this.props.tickets];

    let sortedTickets = [];
    while (tickets.length) {
      sortedTickets.push(tickets.splice(0, 5));
    }

    let splitTickets = sortedTickets[0] || [];

    this.setState({
      tickets: tickets,
      sortedTickets: sortedTickets,
      splitTickets: splitTickets,
    });
  };

  handleScroll = () => {
    setTimeout(function () {
      let element = document.getElementById("viewScroll");
      if (!element || element === null) {
        return;
      }

      scrollIntoView(element, {
        block: "start",
        inline: "nearest",
        behavior: "smooth",
      });
    }, 50);
  };

  handleCta = () => {
    let { sortedTickets, splitTickets, index } = this.state;
    index += 1;

    if (sortedTickets[index]) {
      splitTickets.push(...sortedTickets[index]);

      this.setState(
        {
          index: index,
          splitTickets: splitTickets,
        },
        () => this.handleScroll()
      );
    }
  };

  render() {
    let { sortedTickets, splitTickets, index } = this.state;

    return (
      <div className="help-tickets">
        {splitTickets.map((item, index) => (
          <div
            className="ticket fade-in"
            key={index}
            onClick={() => this.props.onClick(item)}
          >
            <div className="title">Ticket ID: {item.ticket_id}</div>
            <div className="sub-title">{item.subject}</div>
            <div className="bottom-title">
              Last updated:{" "}
              {moment(item.dt_updated).format("DD-MM-YYYY hh:mma")}
            </div>
          </div>
        ))}
        {sortedTickets[index + 1] && (
          <div
            className="generic-page-button-small query-btn fade-in"
            onClick={() => this.handleCta()}
          >
            Load more tickets
          </div>
        )}
        <div id="viewScroll"></div>
      </div>
    );
  }
}

export default OpenTickets;
