import React, { Component } from "react";
import Container from "../../../common/Container";
import { getConfig } from "utils/functions";
import { flowName, nfoData } from "../../constants";
import './NFO.scss';
import { nativeCallback } from "../../../../utils/native_callback";

class NfoInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screenName: "nfo_info",
    };
  }

  handleClick = () => {
    this.sendEvents('next')
    this.props.history.push({
      pathname: "/advanced-investing/new-fund-offers/scheme",
      search: getConfig().searchParams,
    });
  };

  sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "screen_name": "invest in nfo",
        "user_action": userAction || "",
        "flow": flowName['nfo']
        }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        skelton={this.state.show_loader}
        buttonTitle="CONTINUE"
        handleClick={this.handleClick}
        title='Invest in NFO'
      >
        <div className="nfo-info">
          <div
            style={{
              backgroundImage: `url(${require(`assets/nfo_info_cover.png`)})`,
            }}
            className="bg-image"
          ></div>
          <div className="info nfo-data">
            {nfoData.info.map((data, index) => {
              return (
                <div key={index} className="content">
                  <img alt="" src={require(`assets/${data.icon}`)} />
                  <div className="text">
                    <div className="title">{data.title}</div>
                    <div className="subtitle">{data.subtitle}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    );
  }
}

export default NfoInfo;
