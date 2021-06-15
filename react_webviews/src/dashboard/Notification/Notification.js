import React, { Component } from "react";
import "./Notification.scss";
import { getConfig } from "utils/functions";
import Container from "../common/Container";
import Api from "../../utils/api";
import toast from "../../common/ui/Toast";
import { storageService } from "../../utils/validators";
import { getBasePath, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";

const genericErrorMessage = "Something went wrong!";
const config = getConfig();
class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: config.productName,
      showLoader: false,
      notifications: [],
    };
    this.navigate = navigateFunc.bind(this.props);
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

  getRedirectionUrlWebview = (url, showRedirectUrl) => {
    let webRedirectionUrl = url;
    let plutusRedirectUrl = `${getBasePath()}/notification?is_secure=${storageService().get("is_secure")}`;
    // Adding redirect url for testing
    // eslint-disable-next-line
    webRedirectionUrl = `${webRedirectionUrl}${webRedirectionUrl.match(/[\?]/g) ? "&" : "?"}generic_callback=true&campaign_version=1&is_secure=${storageService().get("is_secure")}`
    return webRedirectionUrl;
  };

  handleClick = (target) => {
    this.sendEvents('next', target.campaign_name)
    this.setState({ showLoader: true });
    let campLink = "";
    const showRedirectUrl = target.campaign_name === "whatsapp_consent"
    campLink = this.getRedirectionUrlWebview(
      target.url,
      showRedirectUrl
    );
    window.location.href = campLink;
  };

  sendEvents = (userAction, data) => {
    let eventObj = {
      "event_name": 'notification',
      "properties": {
        "user_action": userAction,
        "screen_name": 'notification',
        "notification_click": data || ""
        }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  goBack = () => {
    this.navigate("/");
  }

  render() {
    let { notifications } = this.state;
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        noFooter={true}
        skelton={this.state.showLoader}
        title="Notification"
        data-aid='notification-screen'
        headerData={{ goBack: this.goBack }}
      >
        <div className="notification" data-aid='notification'>
          {notifications.length === 0 && (
            <div className="message" data-aid='message'>
              <h4>You do not have any notifications.</h4>
            </div>
          )}

          {notifications.length !== 0 && (
            <div className="list" data-aid='list'>
              {notifications.map((target, index) => {
                return (
                  <div
                    key={index}
                    className="content"
                    onClick={() => this.handleClick(target)}
                    data-aid={`notification-content-${index+1}`}
                  >
                    <div className="icon">
                      {!target.image && (
                        <img alt="icon" src={require(`assets/catchup.png`)} />
                      )}
                      {target.image && <img alt="icon" src={target.image} />}
                    </div>
                    <div className="text" data-aid={`notification-text-${index+1}`} >
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
