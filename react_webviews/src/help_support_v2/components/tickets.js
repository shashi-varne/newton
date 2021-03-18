import React, { Component } from "react";
import { initialize } from "../common/functions";

const moment = require('moment');
class OpenTickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
      tickets: "",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    this.setState({
      tickets: this.props.tickets,
    });
  };

  render() {
    let { tickets } = this.state;

    return (
      <div className="help-tickets">
        {tickets.map((item, index) => (
          <div className="ticket" key={index} onClick={() => this.props.onClick(item)}>
            <div className="title">Ticket ID: {item.ticket_id}</div>
            <div className="sub-title">{item.subject}</div>
            <div className="bottom-title">Last updated: {moment(item.dt_updated).format('DD-MM-YYYY hh:mma')}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default OpenTickets;
