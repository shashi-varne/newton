import React, { Component } from "react";
import WrSelect from "../common/Select";
import WrButton from "../common/Button";
import Tooltip from "common/ui/Tooltip";

export default class Taxation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabSelected: "stcg",
    };
  }

  renderTaxDetailRow = () => {
    return (
      <div className="wr-taxation-detail-row">
        <div className="wr-tdr-title">
          Overall STCG
          <hr></hr>
        </div>
        <div className="wr-small-col">
          <span className="wr-small-col-val">₹ 12,421</span>
          <span className="wr-small-col-title">Overall Tax</span>
        </div>
        <div className="wr-small-col">
          <span className="wr-small-col-val">₹ 12,421</span>
          <span className="wr-small-col-title">Overall Tax</span>
        </div>
        <div className="wr-small-col">
          <span className="wr-small-col-val">₹ 12,421</span>
          <span className="wr-small-col-title">Overall Tax</span>
        </div>
      </div>
    );
  };

  render() {
    const { tabSelected } = this.state;
    const tipcontent = (
      <div className="wr-estd-tax">
        <div className="head">Estimated Tax</div>
        <div className="content">
          Disclaimer: Calculation is solely based <br />₹ 2,848
          Estimated Tax on the statement provided by
          you.
        </div>
      </div>
    );

    return (
      <div id="wr-taxation" className="wr-card-template">
        <div id="wr-taxation-filter">
          <WrSelect style={{ marginRight: "24px" }}></WrSelect>
          <WrSelect></WrSelect>
        </div>
        <div id="wr-taxation-summary">
          <div className="wr-taxation-summary-col">
            <span className="wr-tsc-value">₹ 2,848</span>
            <span className="wr-tsc-label">
              Estimated Tax
              <span style={{ marginLeft: "6px" }}>
                <Tooltip
                  content={tipcontent}
                  direction="down"
                >
                  <img
                    src={require(`assets/fisdom/ic-info-xirr-overview.svg`)}
                    style={{ cursor: "pointer" }}
                    alt=""
                  />
                </Tooltip>
              </span>
            </span>
          </div>
          <div className="wr-vertical-divider"></div>
          <div className="wr-taxation-summary-col">
            <span className="wr-tsc-value">₹ 720</span>
            <span className="wr-tsc-label">Total realized gains</span>
          </div>
          <div className="wr-vertical-divider"></div>
          <div className="wr-taxation-summary-col">
            <span className="wr-tsc-value">₹ 1,536</span>
            <span className="wr-tsc-label">Taxable gains</span>
          </div>
        </div>
        <div id="wr-taxation-detail">
          {["stcg", "ltcg"].map((tab) => (
            <WrButton
              classes={{
                root: tabSelected === tab ? "" : "wr-outlined-btn",
              }}
              style={{ marginRight: "16px", textTransform: "uppercase" }}
              onClick={() => this.setState({ tabSelected: tab })}
              disableRipple
            >
              {tab}
            </WrButton>
          ))}
          {this.renderTaxDetailRow()}
        </div>
      </div>
    );
  }
}
