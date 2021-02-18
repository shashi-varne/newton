import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import HowToSteps from "../../../common/ui/HowToSteps";

class Documents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "document_screen",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {};

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "document_screen",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.sendEvents("next");
    this.navigate("loan-know-more");
  };

  render() {
    let { documents } = this.state.screenData;

    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        title="Documents"
        buttonTitle="OKAY"
        handleClick={this.handleClick}
      >
        <div className="idfc-eligibility">
          {documents.map((data, index) => {
            return (
              <HowToSteps key={index} style={{ margin: 0 }} baseData={data} />
            );
          })}
        </div>
      </Container>
    );
  }
}

export default Documents;
