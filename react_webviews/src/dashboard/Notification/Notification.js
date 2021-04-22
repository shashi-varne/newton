import React, { Component } from "react";
import "./Notification.scss";
import { getConfig } from "utils/functions";
import Container from "../common/Container";
import Api from "../../utils/api";
import toast from "../../common/ui/Toast";
import { storageService } from "../../utils/validators";
import { getBasePath } from "../../utils/functions";

const genericErrorMessage = "Something went wrong!";
class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
      showLoader: false,
      notifications: [],
    };
  }

  componentDidMount() {
    this.getNotifications();
  }

  getNotifications = async () => {
    this.setState({ showLoader: true });
    try {
      const res = await Api.post(`/api/user/account/summary`, {
        campaign: ["user_campaign"],
      });
      const { result, status_code: status } = res.pfwresponse;
      if (status === 200) {
        this.setState({ showLoader: false });
        let campSections = ["notification", "profile"];
        let notifications = this.filterCampaignTargetsBySection(
          campSections,
          result.data.campaign.user_campaign.data
        );
        this.setState({ notifications: notifications });
        storageService().setObject("campaign", notifications);
      } else {
        this.setState({ showLoader: false });
        toast(result.message || result.error || genericErrorMessage);
      }
    } catch (error) {
      console.log(error);
      this.setState({ showLoader: false });
      toast(genericErrorMessage);
    }
  };

  filterCampaignTargetsBySection(sections, notifications) {
    if (!notifications) {
      notifications = storageService().get("campaign") || [];
    }

    let notificationsData = [];

    for (let i = 0; i < notifications.length; i++) {
      if (
        notifications[i].notification_visual_data &&
        notifications[i].notification_visual_data.target
      ) {
        for (
          let j = 0;
          j < notifications[i].notification_visual_data.target.length;
          j++
        ) {
          let camTarget = notifications[i].notification_visual_data.target[j];
          if (sections.indexOf(camTarget.section) !== -1) {
            camTarget.campaign_name = notifications[i].campaign.name;
            notificationsData.push(camTarget);
            break;
          }
        }
      }
    }
    return notificationsData;
  }

  getRedirectionUrlWebview = (url, type) => {
    let webRedirectionUrl = url;
    webRedirectionUrl +=
      (webRedirectionUrl.match(/[\?]/g) ? "&" : "?") +
      "generic_callback=true";

    if (type === "campaigns") {
      webRedirectionUrl += "&campaign_version=1";
    }

    return webRedirectionUrl;
  };

  handleClick = (target) => {
    this.setState({ showLoader: true });
    let campLink = "";
    campLink = this.getRedirectionUrlWebview(
      target.url,
      "campaigns"
    );
    window.location.href = campLink;
  };

  render() {
    let { notifications } = this.state;
    return (
      <Container
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
