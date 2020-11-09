import React, { Component } from "react";
import "./style.scss";

class Attention extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="attention">
        <img src={require(`assets/attention.svg`)} alt="" />
        <div className="content">
          {/* Enter correct loan requirements and double-check before you hit the
          'submit' button! Once submitted, you can't make any changes. */}
          {this.props.content}
        </div>
      </div>
    );
  }
}

export default Attention;
