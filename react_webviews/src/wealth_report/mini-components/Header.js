import React, { Component } from "react";
import { Link } from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdown_clicked: false,
      pans: [1,2],
    };
  }

  handleClick = () => {
    this.setState({
        dropdown_clicked: !this.state.dropdown_clicked
    })
  };

  render() {
    let { params } = this.props;
    let { dropdown_clicked, pans } = this.state;

    return (
      <div className="wr-header">
        <div id="wr-header-bar">
          <div>
            <div className="wr-header-pan-select">
              <div className="wr-pan-content">
                <img
                  src={require(`assets/fisdom/ic-added-pans.svg`)}
                  alt=""
                  style={{ paddingLeft: "17px" }}
                />

                <div style={{ paddingLeft: "16px" }}>
                  <div style={{ fontSize: "15px" }}>Showing report for</div>
                  <div className="wr-pan">BXRPR87008N</div>
                </div>

                <img
                  src={require("assets/fisdom/ic-dropdown.svg")}
                  alt=""
                  className="wr-dropdown"
                  onClick={this.handleClick}
                />
              </div>
              <div style={{display: dropdown_clicked ? 'inherit' : 'none'}}>
                  {pans.map(pan => (
                          <div>
                              <div className="hr"></div>
                                <div className="wr-pan-content">
                                    <img
                                      src={require(`assets/fisdom/ic-added-pans.svg`)}
                                      alt=""
                                      style={{ paddingLeft: "17px" }}
                                    />

                                    <div style={{ paddingLeft: "16px"}}>
                                      <div style={{ fontSize: "15px" }}>PAN 2</div>
                                      <div className="wr-pan">QWCTE6223N</div>
                                    </div>
                                </div>
                          </div>
                      )
                  )}
              </div>
              {/* <div className="hr"></div>
              <div className="wr-pan-content">
                  <img
                    src={require(`assets/fisdom/ic-added-pans.svg`)}
                    alt=""
                    style={{ paddingLeft: "17px" }}
                  />
  
                  <div style={{ paddingLeft: "16px"}}>
                    <div style={{ fontSize: "15px" }}>PAN 2</div>
                    <div className="wr-pan">QWCTE6223N</div>
                  </div>
              </div>
              <div className="hr"></div>
              <div className="wr-pan-content">
                  <img
                    src={require(`assets/fisdom/ic-added-pans.svg`)}
                    alt=""
                    style={{ paddingLeft: "17px" }}
                  />
  
                  <div style={{ paddingLeft: "16px"}}>
                    <div style={{ fontSize: "15px" }}>PAN 3</div>
                    <div className="wr-pan">TRQEW2995K</div>
                  </div>
              </div> */}
            </div>
          </div>

          <Link to="/wealth-report/main/overview" className="wr-header-tab">
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
            <div
              className="generic-hr"
              style={{ display: params === "overview" ? "inherit" : "none" }}
            ></div>
          </Link>

          <Link to="/wealth-report/main/analysis" className="wr-header-tab">
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
            <div
              className="generic-hr"
              style={{ display: params === "analysis" ? "inherit" : "none" }}
            ></div>
          </Link>

          <Link to="/wealth-report/main/holdings" className="wr-header-tab">
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
            <div
              className="generic-hr"
              style={{ display: params === "holdings" ? "inherit" : "none" }}
            ></div>
          </Link>

          <Link to="/wealth-report/main/taxation" className="wr-header-tab">
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
            <div
              className="generic-hr"
              style={{ display: params === "taxation" ? "inherit" : "none" }}
            ></div>
          </Link>
        </div>
      </div>
    );
  }
}

export default Header;
