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

  renderList = (options, index) => {
    return (
      <div className="journey-steps-count" key={index}>
        <div className="circle-count">
          <div className="count">{options.step}</div>
        </div>
        <div className="steps-content">
          <div className="title">
            {options.title}
          </div>
          <div className="subtitle">
            {options.subtitle}
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="journey-steps" style={{...this.props.style}}>
        {this.state.baseData.title && <div className="top-title">
            {this.state.baseData.title}
          </div>}

        <div className='steps-count'>
          {this.state.baseData.options.map(this.renderList)}
          {/* {this.renderList()} */}
        </div>
      </div>
    )
  }
}

const JourneySteps = (props) => <JourneyStepsClass {...props} />;

export default JourneySteps;
