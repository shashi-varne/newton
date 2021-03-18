import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
import scrollIntoView from "scroll-into-view-if-needed";
import RenderAttachment from "./attachments";

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
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    await this.getTicketConversations();
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

  handleScroll = (value) => {
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

  render() {
    let { splitConversation, sortedConverstations, index } = this.state;

    return (
      <Container
        skelton={this.state.skelton}
        title="Ticket ID: 0111"
        buttonTitle="REPLY"
        event={""}
      >
        <div className="ticket-details">
          <div className="sub-title">insurance {">"} Health Insurance</div>
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
                        <div className="date">12-11-2020 11:30pm</div>
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
                        <div className="date">12-11-2020 11:30pm</div>
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
          <div id="viewScroll"></div>
          <RenderAttachment row={4} />
        </div>
      </Container>
    );
  }
}

export default TicketConversations;
