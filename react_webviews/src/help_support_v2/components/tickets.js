import React, { Component } from "react";
import { initialize } from "../common/functions";

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
          <div className="ticket" key={index}>
            <div className="title">Ticket ID: {item.ticket_id}</div>
            <div className="sub-title">{item.subject}</div>
            <div className="bottom-title">Last updated: 12-11-2020 11:30pm</div>
          </div>
        ))}
        {/* <div className="ticket">
          <div className="title">Ticket ID: 0111</div>
          <div className="sub-title">I want to know the different.......</div>
          <div className="bottom-title">Last updated: 12-11-2020 11:30pm</div>
        </div>
        <div className="ticket">
          <div className="title">Ticket ID: 0111</div>
          <div className="sub-title">I want to know the different.......</div>
          <div className="bottom-title">Last updated: 12-11-2020 11:30pm</div>
        </div> */}
      </div>
    );
  }
}

export default OpenTickets;
