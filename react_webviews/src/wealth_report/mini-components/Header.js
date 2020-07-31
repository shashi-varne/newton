import React, { Component } from "react";
import { withRouter } from "react-router-dom";

const tabs = [
  {
    'name': 'overview',
    'color': '#a9a9a9',
    'image': 'ic-nav-overview-inactive.svg'
  },
  {
    'name': 'analysis',
    'color': '#a9a9a9',
    'image': 'ic-nav-overview-inactive.svg'
  },
  {
    'name': 'holdings',
    'color': '#a9a9a9',
    'image': 'ic-nav-overview-inactive.svg'
  },
  {
    'name': 'taxation',
    'color': '#a9a9a9',
    'image': 'ic-nav-overview-inactive.svg'
  }
];

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdown_open: false,
      selectedPan: 'BXRPR87008N',
      pans: ['BXRPR87008N', 'QWCTE6223N', 'TRQEW2995K'],
      // tabs: { overview: }
    };
  }

  handleClick = () => {
    this.setState({
      dropdown_open: !this.state.dropdown_open,
    });
  };

  navigate = (pathname) => {
    let searchParams = this.props.location.search;
    this.props.history.push({
      pathname: pathname,
      search: searchParams,
    });
    this.setState({
      dropdown_open: false
    })
  };

  selectPan = (pan) => {
    this.setState({
      dropdown_open: false,
      selectedPan: pan
    })
  }

  render() {
    let { params } = this.props;
    let { dropdown_open, pans, selectedPan } = this.state;
    let count = 1;

    return (
      <div id="wr-header-bar">
        <div className="wr-pan-dropdown">
          <div className="wr-header-pan-select">
            <div className="wr-pan-content" onClick={this.handleClick}>
              <img
                src={require(`assets/fisdom/ic-added-pans.svg`)}
                alt=""
                style={{ paddingLeft: "17px" }}
              />

              <div style={{ paddingLeft: "16px" }}>
                <div style={{ fontSize: "15px", color:'#a9a9a9' }}>Showing report for</div>
                <div className="wr-pan">{selectedPan}</div>
              </div>

              <img
                src={require("assets/fisdom/ic-dropdown.svg")}
                alt=""
                className="wr-dropdown"
              />
            </div>

            <div style={{ display: dropdown_open ? "inherit" : "none" }}>
              {pans.map((pan, index) => pan !== selectedPan && (
                <div onClick={() => this.selectPan(pan)}>
                  <div className="hr"></div>
                  <div className="wr-pan-content">
                    <img
                      src={require(`assets/fisdom/ic-added-pans.svg`)}
                      alt=""
                      style={{ paddingLeft: "17px" }}
                    />
                    <div style={{ paddingLeft: "16px" }}>
                      <div style={{ fontSize: "15px", color:'#a9a9a9' }}>{`PAN ${++count}`}</div>
                      <div className="wr-pan">{pan}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div>
          {}
        </div>

        <div
          onClick={() => this.navigate("overview")}
          className="wr-header-tab"
        >
          <img
            src={require(`assets/fisdom/${
              params === "overview"
                ? "ic-nav-overview-active.svg"
                : "ic-nav-overview-inactive.svg"
            }`)}
            alt=""
          />
          <div
            className="wr-select"
            style={{ color: params === "overview" ? "#000" : "#a9a9a9" }}
          >
            Overview
          </div>
        </div>

        {/* <div
          onClick={() => this.navigate("analysis")}
          className="wr-header-tab"
        >
          <img
            src={require(`assets/fisdom/${
              params === "analysis"
                ? "ic-nav-analysis-active.svg"
                : "ic-nav-analysis-inactive.svg"
            }`)}
            alt=""
          />
          <div
            className="wr-select"
            style={{ color: params === "analysis" ? "#000" : "#a9a9a9" }}
          >
            Analysis
          </div>
        </div>

        <div
          onClick={() => this.navigate("holdings")}
          className="wr-header-tab"
        >
          <img
            src={require(`assets/fisdom/${
              params === "holdings"
                ? "ic-nav-holdings-active.svg"
                : "ic-nav-holdings-inactive.svg"
            }`)}
            alt=""
          />
          <div
            className="wr-select"
            style={{ color: params === "holdings" ? "#000" : "#a9a9a9" }}
          >
            Holdings
          </div>
        </div>

        <div
          onClick={() => this.navigate("taxation")}
          className="wr-header-tab"
        >
          <img
            src={require(`assets/fisdom/${
              params === "taxation"
                ? "ic-nav-taxation-active.svg"
                : "ic-nav-taxation-inactive.svg"
            }`)}
            alt=""
          />
          <div
            className="wr-select"
            style={{ color: params === "taxation" ? "#000" : "#a9a9a9" }}
          >
            Taxation
          </div>
        </div> */}
      </div>
    );
  }
}

export default withRouter(Header);
