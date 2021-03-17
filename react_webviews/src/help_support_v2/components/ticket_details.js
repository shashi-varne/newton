import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";

class TicketDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
      ticket_status: "",
      conversations: "",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    await this.getTicketConversations();
  };

  render() {
    let { conversations } = this.state;
    console.log(conversations);
    return (
      <Container title="Ticket ID: 0111" noFooter>
        <div className="ticket-details">
          <div className="sub-title">insurance {">"} Health Insurance</div>
          {!this.state.skelton &&
            conversations &&
            conversations.map((item, index) => (
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
                            <a href={el.thumb_url} className="download" key={index} download>
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
            <div className="view-more">View more <img src={require(`assets/down_nav.svg`)} alt='' /></div>
        </div>
      </Container>
    );
  }
}

export default TicketDetails;
