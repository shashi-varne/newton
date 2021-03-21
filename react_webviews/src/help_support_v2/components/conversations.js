import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
import scrollIntoView from "scroll-into-view-if-needed";
import RenderAttachment from "./attachments";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";

const moment = require("moment");
class TicketConversations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
      ticket_status: "",
      conversations: [],
      sortedConverstations: "",
      splitConversation: [],
      index: 0,
      ticket: {},
      category: "",
      sub_category: "",
      openTextBox: false,
      documents: [],
      value: "",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    let ticket = this.props.location.state.ticket;
    console.log(ticket);
    this.setState({
      ticket: ticket,
      skelton: true,
    });

    let result = await this.getTicketConversations(ticket.ticket_id);

    this.setState({
      category: result.category,
      sub_category: result.sub_category,
      ticket_status: result.status,
    });
    this.sortConversations(result);
    // console.log([].concat(...sortedConverstations))
  };

  sortConversations = (result, reply = false) => {
    let conversations = [];
    let sortedConverstations = [];
    let splitConversation = [];

    let description = {
      description: result.description,
      dt_updated: result.created_at,
      attachment: result.attachments,
      message_from: "user",
    };

    if (result.conversations) {
      conversations = [description, ...result.conversations];
    } else {
      conversations = [description];
    }

    this.setState({
      length: conversations.length,
    });

    while (conversations.length) {
      sortedConverstations.push(conversations.splice(0, 5));
    }

    if (!reply) {
      splitConversation = sortedConverstations[0] || [];
    } else {
      splitConversation = [].concat(...sortedConverstations);
    }

    this.setState({
      sortedConverstations: sortedConverstations,
      splitConversation: splitConversation,
      openTextBox: false,
      value: "",
      documents: [],
    });

    if (reply) this.handleScroll();
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

  handleClick = async () => {
    let {
      ticket,
      index,
      splitConversation,
      sortedConverstations,
      openTextBox,
      length,
      documents,
    } = this.state;

    if (this.state.ticket_status === "Closed") {
      this.props.history.push(
        { pathname: "send-query", search: getConfig().searchParams },
        { ticket: ticket }
      );
    } else if (!openTextBox) {
      if (splitConversation.length !== length) {
        splitConversation = [...splitConversation].concat(
          ...sortedConverstations.slice(index + 1)
        );

        index = sortedConverstations.length + 1;
      }

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
        show_loader: "button",
      });

      let body_data = new FormData();
      body_data.set("description", this.state.value);
      if (documents.length > 0) {
        documents.forEach((item) => {
          body_data.append("res[]", item, item.name);
        });
      }

      let result = await this.ticketReply(body_data, ticket.ticket_id);

      if (result.message === "success") {
        let result = await this.getTicketConversations(ticket.ticket_id);

        this.sortConversations(result, true);
      }
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

    documents.splice(index, 1);
    this.setState({
      documents: documents,
    });
  };

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
      documents,
    } = this.state;

    return (
      <Container
        skelton={this.state.skelton}
        title={`Ticket ID: ${ticket.ticket_id}`}
        buttonTitle={
          ticket_status === "Closed"
            ? "REOPEN"
            : openTextBox
            ? "SUBMIT"
            : "REPLY"
        }
        handleClick={this.handleClick}
        headerStatus={ticket_status}
        disable={openTextBox && !this.state.value && documents.length === 0}
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
                <div className="ticket-reply">
                  <div
                    className={
                      item.message_from === "user" ? "leftTag" : "rightTag"
                    }
                  >
                    <div className={`chat-box ${item.message_from}`}>
                      <div className="chat">{item.description}</div>
                      {item.attachment.length > 0 &&
                        item.attachment.map((el, index) => (
                          <div
                            className="download"
                            key={index}
                            onClick={() => {
                              nativeCallback({
                                action: "open_in_browser",
                                message: {
                                  url: el.attachment_url,
                                },
                              });
                            }}
                          >
                            <img
                              src={require(`assets/${this.state.productName}/download.svg`)}
                              alt=""
                            />
                            <div>{el.name}</div>
                          </div>
                        ))}
                      <div className="date">
                        {moment(item.created_at).format("DD-MM-YYYY hh:mma")}
                      </div>
                    </div>
                    {item.message_from === "user" && (
                      <div className="user-tag">
                        <img src={require(`assets/ic_user.svg`)} alt="" />
                        You
                      </div>
                    )}
                    {item.message_from === "agent" && (
                      <div className="user-tag agent-tag">
                        <div>Team {this.state.productName}</div>
                        <div className="product-tag">
                          T{this.state.productName[0].toUpperCase()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
              save={this.save}
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
