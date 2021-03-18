import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
import scrollIntoView from "scroll-into-view-if-needed";
import RenderAttachment from "./attachments";
import { getConfig } from "utils/functions";

const moment = require('moment');
class TicketConversations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
      ticket_status: "",
      conversations: "",
      sortedConverstations: "",
      index: 0,
      ticket: {},
      category: "",
      sub_category: "",
      openTextBox: false,
      documents: [],
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    let ticket = this.props.location.state.ticket;
    this.setState({
      ticket: ticket,
    });

    await this.getTicketConversations(ticket.ticket_id);
    let { conversations } = this.state;

    let sortedConverstations = [];
    while (conversations.length) {
      sortedConverstations.push(conversations.splice(0, 3));
    }

    let splitConversation = sortedConverstations[0];

    this.setState({
      conversations: conversations,
      sortedConverstations: sortedConverstations,
      splitConversation: splitConversation,
    });
    // console.log([].concat(...sortedConverstations))
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

  handleView = () => {
    let { sortedConverstations, splitConversation, index } = this.state;
    index += 1;

    if (sortedConverstations[index]) {
      splitConversation.push(...sortedConverstations[index]);

      this.setState(
        {
          index: index,
          splitConversation: splitConversation,
        },
        () => this.handleScroll()
      );
    }
  };

  handleClick = () => {
    let {
      ticket,
      category,
      index,
      sub_category,
      splitConversation,
      sortedConverstations,
      openTextBox
    } = this.state;

    if (this.state.ticket_status === "Closed") {
      this.props.history.push(
        { pathname: "send-query", search: getConfig().searchParams },
        { ticket: ticket, category: category, sub_category: sub_category }
      );
    } else if (!openTextBox) {
      splitConversation = [].concat(...sortedConverstations);
      index = sortedConverstations.length + 1;
      this.setState(
        {
          openTextBox: true,
          splitConversation: splitConversation,
          index: index,
        },
        () => this.handleScroll()
      );
    } else {
      this.setState({
        show_loader: 'button'
      })
    }
  };

  handleChange = (e) => {
    let value = e.target.value;

    this.setState({
      value: value,
    });
  };

  handleDelete = (index) => {
    let { documents } = this.state;

    documents.splice(index, 1)
    this.setState({
      documents: documents
    })
  }

  render() {
    let {
      splitConversation,
      sortedConverstations,
      ticket,
      category,
      sub_category,
      index,
      openTextBox,
      ticket_status,
      documents
    } = this.state;
    
    return (
      <Container
        skelton={this.state.skelton}
        title={`Ticket ID: ${ticket.ticket_id}`}
        buttonTitle={ticket_status === "Closed" ? "REOPEN" : openTextBox ? "SUBMIT" : "REPLY"}
        handleClick={this.handleClick}
        headerStatus={ticket_status}
        disable={openTextBox && (!this.state.value && documents.length === 0)}
        showLoader={this.state.show_loader}
        event={""}
      >
        <div className="ticket-details">
          <div className="sub-title">
            {category} {">"} {sub_category}
          </div>
          {!this.state.skelton &&
            splitConversation &&
            splitConversation.map((item, index) => (
              <div className="fade-in" key={index}>
                {item.message_from === "user" && (
                  <div className="ticket-reply">
                    <div style={{ marginRight: "10%" }}>
                      <div className="chat-box">
                        <div className="chat">{item.description}</div>
                        {item.attachment.length > 0 &&
                          item.attachment.map((el, index) => (
                            <div className="download" key={index}>
                              <img
                                src={require(`assets/${this.state.productName}/download.svg`)}
                                alt=""
                              />
                              <div>{el.name}</div>
                            </div>
                          ))}
                        <div className="date">{moment(item.dt_updated).format('DD-MM-YYYY hh:mma')}</div>
                      </div>
                      <div className="user-tag">
                        <img src={require(`assets/ic_user.svg`)} alt="" />
                        You
                      </div>
                    </div>
                  </div>
                )}
                {item.message_from === "agent" && (
                  <div className="ticket-reply">
                    <div
                      style={{ marginLeft: "20%", textAlign: "-webkit-right" }}
                    >
                      <div className="chat-box agent">
                        <div className="chat">{item.description}</div>
                        {item.attachment.length > 0 &&
                          item.attachment.map((el, index) => (
                            <a
                              href={el.thumb_url}
                              className="download"
                              key={index}
                              download
                            >
                              <img
                                src={require(`assets/${this.state.productName}/download.svg`)}
                                alt=""
                              />
                              <div>{el.name}</div>
                            </a>
                          ))}
                        <div className="date">{moment(item.dt_updated).format('DD-MM-YYYY hh:mma')}</div>
                      </div>
                      <div className="user-tag agent-tag">
                        <div>Team {this.state.productName}</div>
                        <div className="product-tag">
                          T{this.state.productName[0].toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          {sortedConverstations[index + 1] && (
            <div className="view-more" onClick={() => this.handleView()}>
              View more <img src={require(`assets/down_nav.svg`)} alt="" />
            </div>
          )}
          {openTextBox && (
            <RenderAttachment
              row={4}
              handleChange={this.handleChange}
              getPdf={this.getPdf}
              documents={this.state.documents}
              handleDelete={this.handleDelete}
            />
          )}
          <div id="viewScroll"></div>
        </div>
      </Container>
    );
  }
}

export default TicketConversations;
