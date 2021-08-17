import React, { Component } from "react";
import qs from "qs";
import { getConfig } from "utils/functions";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { storageService } from "../../../utils/validators";
import RiskIntroContent from "./RiskIntroContent";

class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1)),
      openDialog: false,
      rpEntryParams: storageService().getObject('risk-entry-params') || {},
    };
    this.handleClose = this.handleClose.bind(this);
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
    });
  };

  handleClick = async () => {
    this.sendEvents("next");
    this.navigate("question1");
  };

  handleClose() {
    this.setState({
      openDialog: false,
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      event_name: "Risk Analyser",
      properties: {
        user_action: user_action,
        screen_name: "Intro",
        flow: this.state.rpEntryParams.flow || 'risk analyser',
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleConfirm = () => {
    this.navigate("question1");
    return;
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Risk Analyser"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Let’s get started"
        events={this.sendEvents("just_set_events")}
      >
        <RiskIntroContent />
      </Container>
    );
  }
}

export default Intro;
