import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import JourneySteps from "../../../common/ui/JourneySteps";

class JourneyTrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "landing_screen",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    let screenData = this.state.screenData;
    
    this.setState({
      screenData: screenData
    })
  }

  handleClick = () => {};

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "introduction",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        inPageTitle={false}
        noFooter={true}
        headerData={{
          icon: "close",
        }}
      >
          <div className="journey-track">
            <img className="center" src={require(`assets/${this.state.productName}/journey.svg`)} alt="" />
            <JourneySteps baseData={this.state.screenData.journeyData} />
          </div>
      </Container>
    );
  }
}

export default JourneyTrack;
