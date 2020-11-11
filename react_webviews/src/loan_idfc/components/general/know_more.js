import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";

class KnowMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      cta_title: "APPLY NOW",
      screen_name: "know_more_screen",
      tab_clicked: 'tab-1'
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
  };

  handleClick = (e) => {
    let id = e.target.id;

    this.setState({
      tab_clicked: id
    })
  };

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "know_more",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    let { features, eligibility, documentation } = this.state.screenData;
    let { tab_clicked } = this.state;

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Know More"
        buttonTitle={this.state.cta_title}
      >
        <div className="know-more">
          <div className="know-more">
            <div id="tab-1" className={`nav-tab ${tab_clicked === 'tab-1' ? 'clicked' : 'unclicked'}`} onClick={this.handleClick}>Features</div>
            <div id="tab-2" className={`nav-tab ${tab_clicked === 'tab-2' ? 'clicked' : 'unclicked'}`} onClick={this.handleClick}>Eligibility</div>
            <div id="tab-3" className={`nav-tab ${tab_clicked === 'tab-3' ? 'clicked' : 'unclicked'}`} onClick={this.handleClick}>Documentation</div>
          </div>

          {tab_clicked === 'tab-1' && <div className="content">
            {features.content.map((item, index) => (
              <div className="sub-pts" key={index}>
                <span className="count">{index + 1 + "."}</span>
                <span className="subtitle">{item}</span>
              </div>
            ))}
          </div>}

          {tab_clicked === 'tab-2' && <div className="content">
            <div className="sub-head">{eligibility.content1["sub-head"]}</div>
            <div className="points">
              {eligibility.content1.points.map((item, index) => (
                <div className="sub-pts" key={index}>
                  <span className="count">{index + 1 + "."}</span>
                  <span className="subtitle">{item}</span>
                </div>
              ))}
            </div>

            <div className="sub-head">{eligibility.content2["sub-head"]}</div>
            <div className="points">
              {eligibility.content2.points.map((item, index) => (
                <div className="sub-pts" key={index}>
                  <span className="count">{index + 1 + "."}</span>
                  <span className="subtitle">{item}</span>
                </div>
              ))}
            </div>
          </div>}

          {tab_clicked === 'tab-3' && <div className="content">
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
          </div>}
        </div>
      </Container>
    );
  }
}

export default KnowMore;
