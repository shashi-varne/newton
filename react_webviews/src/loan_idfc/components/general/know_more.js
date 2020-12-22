import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";

class KnowMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "know_more_screen",
      tab_clicked: 'tab-1',
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let { params } = this.props.location;

    // if (!params) {
    //   this.navigate('home')
    //   return
    // }

    this.setState({
      ...params
    })
  }

  onload = async () => { };

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "documents",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleTab = (e) => {
    let id = e.target.id;

    this.setState({
      tab_clicked: id
    })
  };

  render() {
    let { documentation } = this.state.screenData;

    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Documents"
        buttonTitle={this.state.cta_title}
        noFooter={true}
      >
        <div className="know-more">
          <div className="content">
            <div className="sub-head">{documentation.content1["sub-head"]}</div>
            <div className="points">
              {documentation.content1.points.map((item, index) => (
                <div className="sub-pts" key={index}>
                  <span className="count">{index + 1 + "."}</span>
                  <span className="subtitle">{item}</span>
                </div>
              ))}
            </div> 

            <div className="sub-head">{documentation.content2["sub-head"]}</div>
            <div className="points">
              {documentation.content2.points.map((item, index) => (
                <div className="sub-pts" key={index}>
                  <span className="count">{index + 1 + "."}</span>
                  <span className="subtitle">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default KnowMore;
