import React, { Component } from "react";
import "./style.scss";
import "../theme/Style.scss";
import { getConfig } from "utils/functions";

class JourneyStepsClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseData: this.props.baseData,
      productName: getConfig().type,
    };
  }

  renderStaticList = (options, index) => {
    return (
      <div className="journey-steps-count" key={index}>
        <div className="circle-count init">
          <div className="count">{options.step}</div>
        </div>
        <div className="steps-content init">
          <div className="title" style={{color:"#767E86"}}>{options.title}</div>
          <div className="subtitle">{options.subtitle}</div>
        </div>
      </div>
    );
  };

  renderList = (options, index) => {
    const props = this.props;

    return (
      <div className="journey-steps-count" key={index}
        onClick={() => {
          options.status !== "pending" && props.handleClick(options.id)
        }}
      >
        <div className={`circle-count ${options.status || "pending"}`}>
          {options.status !== "completed" && (
            <div className="count">{options.step}</div>
          )}
          {options.status === "completed" && (
            <div className="count">
              <img src={require(`assets/check_icon_color.svg`)} alt="" />
            </div>
          )}
        </div>
        <div className={`steps-content ${options.status || "pending"}`} style={{
          borderColor: options.status === "completed" && (getConfig().productName === "fisdom" ? "#D5CCE9" : "#CBDEF6")
        }} >
          <div className="title flex">
            {options.status === "completed" ? options.titleCompleted : options.title}
            {options.status && (
              <span className="status">
                {options.cta}
              </span>
            )}
            {options.status === "pending" && (
              <img src={require(`assets/Vector.svg`)} alt="" />
            )}
          </div>
          <div className="subtitle">{options.subtitle}</div>
        </div>
      </div>
    );
  };

  render() {
    const props = this.props;

    return (
      <div className="journey-steps" style={{ ...this.props.style }}>
        {this.state.baseData.title && (
          <div className="top-title">{this.state.baseData.title}</div>
        )}

        <div className="steps-count">
          {this.state.baseData.options.map(
            props.static ? this.renderStaticList : this.renderList
          )}
        </div>
      </div>
    );
  }
}

const JourneySteps = (props) => <JourneyStepsClass {...props} />;

export default JourneySteps;
