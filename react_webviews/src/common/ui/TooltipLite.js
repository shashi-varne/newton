import React from "react";
import Tooltip from "react-tooltip-lite";
import "./style.scss";
import { ClickAwayListener } from "material-ui";

const noop = () => { };
class Tooltips extends React.Component {
  render() {
    const { onClickAway = '' } = this.props;

    return (
      <ClickAwayListener onClickAway={onClickAway || noop}>
        <Tooltip
          padding={20}
          background={this.props.background || 'white'}
          content={this.props.content}
          tagName="span"
          zIndex={100000}
          direction={this.props.direction}
          eventToggle={this.props.eventToggle}
          isOpen={this.props.isOpen}
          className={this.props.className}
          useHover={this.props.useHover}
          arrowContent={(
            <svg className={this.props.classNameArrow} style={{ display: 'block' }} viewBox="0 0 21 11" 
            width="20px" height="10px">
              <path
                d="M0,11 L9.43630703,1.0733987 L9.43630703,1.0733987 C10.1266203,0.3284971 11.2459708,0 11.936284,1.0733987 L20,11"
                style={{ stroke: '#d3d3d3', fill: this.props.backgroundArrow }}
              />
            </svg>
          )}
        >
          {this.props.children}
        </Tooltip>
      </ClickAwayListener>
    );
  }
}

export default Tooltips;