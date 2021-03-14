import React, { Component } from "react";
import { initialize } from "../common/functions";
import SwipeableViews from "react-swipeable-views";
import ReactHtmlParser from 'react-html-parser';

class Answers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
      value: 0,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  componentDidUpdate() {
    this.swipeableActions.updateHeight();
  }

  onload = () => {};

  handleChangeIndex = (index) => {
    this.setState({ value: index });
  };

  handleClick = (dir) => {
    let { value } = this.state;

    value = dir === "next" ? value + 1 : value - 1

    this.setState({
      value: value === -1 || value === 3 ? 0 : value,
    });
  };

  render() {
    return (
      <div className="help-answers">
        <div style={{margin: '0 -20px'}}>
          <SwipeableViews
            // axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
            action={(actions) => {
              this.swipeableActions = actions;
            }}
            slideStyle={{
              padding: '0 20px'
            }}
            animateHeight
          >
            <div>
              <div className="question">
                How to update email ID on the application?
              </div>
              <div className="answer">
                Cancelling is never receommended. If you are facing financial
                crunches, the best option is to reduce SIP amount and keep
                continuing with it. And in sevare financial crisis, you can
                pause it for some time and continue after that. But still you
                want to cancel the SIP, please write to us with your linked Pan
                no, SIP fund name and SIP amount.
              </div>
            </div>
            <div>
              <div className="question">
                How to update email ID on the application?
              </div>
              <div className="answer">
                Cancelling is never receommended. If you are facing financial
                crunches, the best option is to reduce SIP amount and keep
                continuing with it. And in sevare financial crisis, you can
                pause it for some time and continue after that. But still you
                want to cancel the SIP, please write to us with your linked Pan
                no, SIP fund name and SIP amount.
              </div>
            </div>
            <div>
              <div className="question">
                How to update email ID on the application?
              </div>
              <div className="answer">
                {ReactHtmlParser('<p data-renderer-start-pos="130" style=\'font-size: 16px; padding: 0px; line-height: 1.714; caret-color: rgb(23, 43, 77); color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, "Droid Sans", "Helvetica Neue", sans-serif; text-align: justify;\'><span style=\'font-family: "Helvetica Neue"; font-size: 14px;\'>Digital gold is a unique offering which brings multiple benefits to customers to buy gold digitally without hassles. </span></p><ol class="ak-ol" data-indent-level="1" style=\'font-size: 16px; margin-bottom: 0px; padding-left: 24px; display: table; caret-color: rgb(23, 43, 77); color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, "Droid Sans", "Helvetica Neue", sans-serif;\'><li style="text-align: justify;"><span style="font-size: 14px;"><span style="font-family: Helvetica Neue;"><strong>Affordability:</strong> You can buy gold as low as Rs 100/- and sell anytime you want.</span></span></li><li style="text-align: justify;"><span style="font-size: 14px;"><span style="font-family: Helvetica Neue;"><strong>Security:</strong> Gold purchased is 100% insured against all eventualities. </span></span></li><li style="text-align: justify;"><span style="font-size: 14px;"><span style="font-family: Helvetica Neue;"><strong>Purity:</strong> Gold purchased is 99.99% pure 24 karat gold. </span></span></li><li style="text-align: justify;"><span style="font-size: 14px;"><span style=\'font-family: "Helvetica Neue";\'><strong>Delivery:</strong> Get home delivery of BIS certified coins and bars with secure ID validated delivery. </span></span></li></ol>')}
              </div>
            </div>
          </SwipeableViews>
        </div>
        <div className="helpful-block">
          <div className="title">Was this helpful?</div>
          <div className="thumb-container">
            <img src={require("assets/thumb_up_fill.svg")} alt="" />
            {/* thumb_up_fill || thumb_down_fill */}
            <img src={require("assets/thumb_down.svg")} alt="" />
          </div>
        </div>
        <div className="generic-hr hr"></div>
        <div className="navigation">
          <div className="nav" onClick={() => this.handleClick("prev")}>
            <img src={require(`assets/back_nav_bar_icon.svg`)} alt="" />
            Prev
          </div>
          <div className="nav" onClick={() => this.handleClick("next")}>
            Next
            <img src={require(`assets/next_nav_bar_icon.svg`)} alt="" />
          </div>
        </div>
      </div>
    );
  }
}

export default Answers;
