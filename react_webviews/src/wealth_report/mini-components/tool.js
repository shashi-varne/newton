import React, { Component } from "react";

class Tool extends Component {
  state = {};
  render() {
    return (
      <div className="wrr">
        <div id="tooltip" class="top">
          <div class="tooltip-arrow" />
          <div class="tooltip-label">ToolTip Component</div>
        </div>
      </div>
    );
  }
}

export default Tool;
