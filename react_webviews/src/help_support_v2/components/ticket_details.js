import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";

class TicketDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  render() {
    return (
      <Container title="Ticket ID: 0111" noFooter>
        <div className="ticket-details">
          <div className="sub-title">insurance {">"} Health Insurance</div>
          <div className="ticket-reply">
            <div style={{marginRight: '10%'}}>
              <div className="chat-box">
                <div className="chat">
                  I want to know the different health insurance offered by
                  Fisdom.
                </div>
                <div className="date">12-11-2020 11:30pm</div>
              </div>
              <div className="user-tag">
                <img src={require(`assets/ic_user.svg`)} alt="" />
                You
              </div>
            </div>
          </div>
          <div className="ticket-reply">
            <div style={{ float: "right", marginLeft: '20%' }}>
              <div className="chat-box agent">
                <div className="chat">
                  Thank you for writing to us. Insurance provided on fisdom
                  platform are: Comprehensive, disease specific, hospital daily
                  cash and super top-up
                </div>
                <div className="date">12-11-2020 11:30pm</div>
              </div>
              <div className="user-tag agent-tag">
                Team {this.state.productName}
                <div className="product-tag">TF</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default TicketDetails;
