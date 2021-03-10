import React, { Component } from "react";
import { initialize } from "../common/functions";

class Answers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};
  render() {
    return (
      <div className="help-answers">
        <div className="question">
          How to update email ID on the application?
        </div>
        <div className="answer">
          Cancelling is never receommended. If you are facing financial
          crunches, the best option is to reduce SIP amount and keep continuing
          with it. And in sevare financial crisis, you can pause it for some
          time and continue after that. But still you want to cancel the SIP,
          please write to us with your linked Pan no, SIP fund name and SIP
          amount.
        </div>
        <div className="helpful-block">
          <div className="title">Was this helpful?</div>
          <div className="thumb-container">
            <img src={require("assets/thumb_up.svg")} alt="" />
            {/* thumb_up_fill || thumb_down_fill */}
            <img src={require("assets/thumb_down.svg")} alt="" />
          </div>
        </div>
        <div className="generic-hr hr"></div>
        <div className="navigation">
          <div className="nav">
            <img src={require(`assets/back_nav_bar_icon.svg`)} alt="" />
            Prev
          </div>
          <div className="nav">
            Next
            <img src={require(`assets/next_nav_bar_icon.svg`)} alt="" />
          </div>
        </div>
      </div>
    );
  }
}

export default Answers;
