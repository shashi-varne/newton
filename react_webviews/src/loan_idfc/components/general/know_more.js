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

    if (!params) {
      this.navigate('home')
      return
    }

    this.setState({
      ...params
    })
  }

  onload = async () => {};

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

  handleTab = (e) => {
    let id = e.target.id;

    this.setState({
      tab_clicked: id
    })
  };

  handleClick = () => {
    let params = {
      create_new:
        this.state.application_exists && this.state.otp_verified ? false : true,
    };

    let { vendor_application_status, pan_status, ckyc_status, is_dedupe } = this.state;

    let rejection_cases = [
      "idfc_null_rejected",
      "idfc_0.5_rejected",
      "idfc_1.0_rejected",
      "idfc_1.7_rejected",
      "idfc_4_rejected",
    ];

    if (this.state.cta_title === "RESUME") {
      if (rejection_cases.indexOf(vendor_application_status) !== -1 || is_dedupe) {
        this.navigate("loan-status");
      }

      if (pan_status === "" || ckyc_status === "") {
        this.navigate("basic-details");
      } else if (rejection_cases.indexOf(vendor_application_status) === -1 && !is_dedupe) {
        this.navigate("journey");
      }

    } else {
      this.getOrCreate(params);
    }
  };

  render() {
    let { features, eligibility, documentation } = this.state.screenData;
    let { tab_clicked } = this.state;

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Know More"
        buttonTitle={this.state.cta_title}
        handleClick={this.handleClick}
      >
        <div className="know-more">
          <div className="nav-bar">
            <div id="tab-1" className={`nav-tab ${tab_clicked === 'tab-1' ? 'clicked' : 'unclicked'}`} onClick={this.handleTab}>Features</div>
            <div id="tab-2" className={`nav-tab ${tab_clicked === 'tab-2' ? 'clicked' : 'unclicked'}`} onClick={this.handleTab}>Eligibility</div>
            <div id="tab-3" className={`nav-tab ${tab_clicked === 'tab-3' ? 'clicked' : 'unclicked'}`} onClick={this.handleTab}>Documentation</div>
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
