import React from "react";
import Tooltip from "react-tooltip-lite";
import "./style.scss";

class Tooltips extends React.Component {

  render() {
    return (
      <Tooltip
        padding={20}
        background="white"
        content={this.props.content}
        tagName="span"
        zIndex={100000}
        direction={this.props.direction}
        eventToggle={this.props.eventToggle}
        isOpen={this.props.isOpen}
        ClassName="react-tooltip-lit"
        arrowContent={(
          <svg style={{ display: 'block' }} viewBox="0 0 21 11" width="20px" height="10px">
            <path
              d="M0,11 L9.43630703,1.0733987 L9.43630703,1.0733987 C10.1266203,0.3284971 11.2459708,0 11.936284,1.0733987 L20,11"
              style={{ stroke: '#d3d3d3', fill: 'white' }}
            />
          </svg>
        )}
      >
        {this.props.children}
      </Tooltip>
    );
  }
}

export default Tooltips;
