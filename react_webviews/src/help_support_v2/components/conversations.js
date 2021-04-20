import React, { Component } from "react";
import Container from "../common/Container";
import {
  initialize,
  getTicketConversations,
  ticketReply,
  handleScroll
} from "../common/functions";
import RenderAttachment from "./attachments";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import { TicketStatus } from "../common/mini_components";
import SVG from "react-inlinesvg";

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
      splitIndex: 5,
      old_ticket_reference_id: '',
      fromTicket: '',
    };
    this.initialize = initialize.bind(this);
    this.getTicketConversations = getTicketConversations.bind(this);
    this.ticketReply = ticketReply.bind(this);
    this.handleScroll = handleScroll.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    let ticket = this.props.location.state.ticket;

    this.setState({
      ticket: ticket,
      skelton: true,
    });

    let result = await this.getTicketConversations(ticket.ticket_id);

    if (result) {
      this.setState({
        category: result.category || "",
        sub_category: result.sub_category || "",
        ticket_status: result.status || "",
        old_ticket_reference_id: result.old_ticket_reference_id || ""
      });
      this.sortConversations(result);
    }
  };

  sendEvents(user_action, data = {}) {
    let { category, sub_category, ticket_status } = this.state;
    let eventObj = {
      event_name: "help_and_support",
      properties: {
        user_action: user_action,
        screen_name: "ticket_details",
        category: category,
        sub_category: sub_category,
        ticket_closed: ticket_status,
        reopen: data.reopen || "no",
        reply: data.reply || "no",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  sortConversations = async (result, reply = false) => {
    let conversations = [];

    let description = {
      description: result.description,
      created_at: result.created_at,
      attachment: result.attachments,
      message_from: "user",
    };

    if (result.conversations?.length > 0) {
      conversations = [description, ...result.conversations];
    } else {
      conversations = [description];
    }

    this.setState({
      conversations: conversations,
      length: conversations.length,
      openTextBox: false,
      value: "",
      documents: [],
    });

    if (reply) {
      this.handleScroll();

      this.setState({
        splitIndex: conversations.length
      })
    } 
  };

  handleView = () => {
    this.setState(
      {
        splitIndex: this.state.splitIndex + 5,
      },
      () => this.handleScroll('smooth')
    );
  };

  handleClick = async () => {
    let { ticket, openTextBox, length, documents } = this.state;

    if (this.state.ticket_status === "Closed") {
      this.sendEvents("next", { reopen: "yes" });
      ticket.category = this.state.category;
      ticket.sub_category = this.state.sub_category;
      this.props.history.push(
        { pathname: "send-query", search: getConfig().searchParams },
        { ticket: ticket }
      );

    } else if (!openTextBox) {
      this.setState(
        {
          openTextBox: true,
          splitIndex: length,
        },
        () => this.handleScroll('smooth')
      );
    } else {
      this.sendEvents("next", { reply: "yes" });
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

      if (result && result.message === "success") {
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

  goBack = () => {
    this.sendEvents("back");

    let { fromTicket, ticket, oldReferenceClicked } = this.state;

    if (oldReferenceClicked) {
      ticket.ticket_id = fromTicket;

      this.setState({
        ticket: ticket,
        skelton: true,
        oldReferenceClicked: false,
        ticket_status: ''
      })
      this.onload();
    } else {
      // this.navigate("queries");

      this.props.history.push(
        { pathname: "queries", search: getConfig().searchParams },
        { status: ticket.status }
      );
    }
  };

  redirectOldTicket = () => {
    let { ticket, old_ticket_reference_id } = this.state;
    let fromTicket = ticket.ticket_id;

    ticket.ticket_id = old_ticket_reference_id;

    this.setState({
      ticket: ticket,
      old_ticket_reference_id: "",
      ticket_status: "",
      skelton: true,
      oldReferenceClicked: true,
      fromTicket: fromTicket,
    })

    this.onload();
  }

  render() {
    let {
      ticket,
      category,
      sub_category,
      old_ticket_reference_id,
      openTextBox,
      ticket_status,
      documents,
      skelton,
      conversations,
      splitIndex,
      length,
    } = this.state;

    return (
      <Container
        skelton={skelton}
        events={this.sendEvents("just_set_events")}
        showError={this.state.showError}
        errorData={this.state.errorData}
        buttonTitle={
          ticket_status === "Closed"
            ? "REOPEN"
            : openTextBox
            ? "SUBMIT"
            : "REPLY"
        }
        handleClick={this.handleClick}
        headerData={{
          goBack: this.goBack,
        }}
        title={
          <TicketStatus
            title={`Ticket ID: ${ticket.ticket_id}`}
            headerStatus={ticket_status}
          />
        }
        disable={openTextBox && !this.state.value && documents.length === 0}
        showLoader={this.state.show_loader}
      >
        <div className="ticket-details">
          <div className="sub-title">
            {category} {">"} {sub_category}
          </div>
          {old_ticket_reference_id && (
            <div
              className="ticket-id"
              onClick={() => this.redirectOldTicket()}
            >
              Old Ticket: {old_ticket_reference_id}
            </div>
          )}
          {!this.state.skelton &&
            conversations &&
            conversations.slice(0, splitIndex).map((item, index) => (
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
                          T{this.state.productName[0]}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          {conversations.slice(0, splitIndex).length !== length && (
            <div className="view-more" onClick={() => this.handleView()}>
              View more
              <SVG
                preProcessor={(code) =>
                  code.replace(
                    /stroke=".*?"/g,
                    "stroke=" + getConfig().secondary
                  )
                }
                src={require(`assets/down_nav.svg`)}
              />
            </div>
          )}
          {openTextBox && (
            <RenderAttachment
              row={4}
              handleChange={this.handleChange}
              getPdf={this.getPdf}
              save={this.save}
              value={this.state.value}
              documents={this.state.documents}
              onDelete={this.handleDelete}
            />
          )}
          <div id="viewScroll"></div>
        </div>
      </Container>
    );
  }
}

export default TicketConversations;
