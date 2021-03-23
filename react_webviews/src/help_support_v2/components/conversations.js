import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
import scrollIntoView from "scroll-into-view-if-needed";
import RenderAttachment from "./attachments";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import { TicketStatus } from "../common/mini_components";

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
    this.setState({
      ticket: ticket,
      skelton: true,
    });

    let result = await this.getTicketConversations(ticket.ticket_id, "1");

    if (result) {
      this.setState({
        category: result.category || "",
        sub_category: result.sub_category || "",
        ticket_status: result.status || "",
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
    let sortedConverstations = [];
    let splitConversation = [];

    let description = {
      description: result.description,
      dt_updated: result.created_at,
      attachment: result.attachments,
      message_from: "user",
    };

    if (result.conversations) {
      if (result.conversations && result.conversations.length === 30) {
        this.setState({
          skelton: true,
        });

        let details = await this.getTicketConversations(
          this.state.ticket.ticket_id,
          "2"
        );

        conversations = [...result.conversations, ...details.conversations];
      } else {
        conversations = [...result.conversations];
      }

      conversations = [description, ...conversations];
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
      this.sendEvents("next", { reopen: "yes" });
      ticket.category = this.state.category;
      ticket.sub_category = this.state.sub_category;
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
        let result = await this.getTicketConversations(ticket.ticket_id, "1");

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

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.onload,
          title1: this.state.title1,
          button_text1: "Retry",
        },
        submit: {
          handleClick1: this.handleClick,
          button_text1: "Retry",
          title1: this.state.title1,
          handleClick2: () => {
            this.setState({
              showError: false,
            });
          },
          button_text2: "Edit",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  goBack = () => {
    this.sendEvents("back");
    this.navigate("queries");
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
      skelton,
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
        twoTitle={true}
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
                          T{this.state.productName[0]}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          {sortedConverstations[index + 1] && (
            <div className="view-more" onClick={() => this.handleView()}>
              View more
              {/* <SVG
                preProcessor={code => code.replace(/stroke=".*?"/g, 'stroke=' + (getConfig().secondary))}
                src={require(`assets/down_nav.svg`)}
              /> */}
              <img src={require(`assets/down_nav.svg`)} alt="" />
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
