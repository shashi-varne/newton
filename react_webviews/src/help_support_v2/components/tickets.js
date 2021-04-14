import React, { Component } from "react";
import { initialize, handleScroll } from "../common/functions";

const moment = require("moment");
class OpenTickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
      tickets: "",
      index: 5,
    };
    this.initialize = initialize.bind(this);
    this.handleScroll = handleScroll.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let tickets = [...this.props.tickets];

    this.setState({
      tickets: tickets,
      length: tickets.length,
    });
  };

  handleCta = () => {
    let { index } = this.state;
    index += 5;

    this.setState({
      index: index,
    });
  };

  render() {
    let { tickets, index, length } = this.state;

    return (
      <div className="help-tickets">
        {tickets.slice(0, index).map((item, index) => (
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
        {tickets.slice(0, index).length !== length && (
          <div
            className="generic-page-button-small query-btn fade-in"
            onClick={() => this.handleCta()}
          >
            Load more tickets
          </div>
        )}
      </div>
    );
  }
}

export default OpenTickets;
