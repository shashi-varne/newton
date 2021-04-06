import React, { Component } from "react";
import "../Style.scss";
import { getConfig } from "utils/functions";
import { initialize, getRedirectionUrlWebview } from "../common/functions";
import Container from "../common/Container";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
      showLoader: false,
      notifications: [],
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    this.getNotifications();
  };

  handleClick = (target) => {
    this.setState({ showLoader: true });
    let campLink = "";
    if (target.campaign_name === "whatsapp_consent") {
      campLink = getRedirectionUrlWebview(
        target.url,
        "notification",
        "campaigns",
        true
      );
    } else {
      campLink = getRedirectionUrlWebview(
        target.url,
        "notification",
        "campaigns"
      );
    }
    window.location.href = campLink;
  };

  render() {
    let { notifications } = this.state;
    return (
      <Container
        hidePageTitle
        noFooter={true}
        skelton={this.state.showLoader}
        title="Notification"
      >
        <div className="notification">
          {notifications.length === 0 && (
            <div className="message">
              <h4>You do not have any notifications.</h4>
            </div>
          )}

          {notifications.length !== 0 && (
            <div className="list">
              {notifications.map((target, index) => {
                return (
                  <div
                    key={index}
                    className="content"
                    onClick={() => this.handleClick(target)}
                  >
                    <div className="icon">
                      {!target.image && (
                        <img alt="icon" src={require(`assets/catchup.png`)} />
                      )}
                      {target.image && <img alt="icon" src={target.image} />}
                    </div>
                    <div className="text">
                      <h4>{target.title}</h4>
                      <p>{target.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default Notification;
