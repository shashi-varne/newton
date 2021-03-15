import React, { Component } from "react";
import { initialize } from "../common/functions";
import SwipeableViews from "react-swipeable-views";
import ReactHtmlParser from "react-html-parser";
import Container from "../common/Container";
class Answers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
      index: 0,
      sub_category: "",
      faqs: "",
      faqDesc: {},
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  componentDidUpdate() {
    this.swipeableActions.updateHeight();
  }

  onload = async () => {
    let sub_category = this.props.location.state
      ? this.props.location.state.sub_category
      : {};

    let faqs = this.props.location.state ? this.props.location.state.faqs : {};
    let index = this.props.location.state
      ? this.props.location.state.index
      : {};

    this.setState({
      sub_category: sub_category,
      faqs: faqs,
      index: index,
    });

    let faq_id = faqs[sub_category.cms_category_id][index].cms_faq_id;
    await this.getFaqDescription(faq_id);
  };

  handleChangeIndex = (index) => {
    this.setState({ index: index });
  };

  handleClick = async (dir) => {
    let { index, faqs, sub_category, faqDesc } = this.state;

    index = dir === "next" ? index + 1 : index - 1;

    index =
      index === -1 || index === faqs[sub_category.cms_category_id].length
        ? 0
        : index;

    this.setState({
      index: index,
    });

    let faq_id = faqs[sub_category.cms_category_id][index].cms_faq_id;

    if (!faqDesc[faq_id]) {
      await this.getFaqDescription(faq_id);
    }
  };

  render() {
    let { sub_category, faqs, faqDesc } = this.state;

    return (
      <Container
        title={sub_category.cms_category_name}
        queryTitle="My queries"
        querycta={true}
        noFooter
      >
        <div className="help-answers">
          <div style={{ margin: "10px -20px 0" }}>
            <SwipeableViews
              // axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={this.state.index}
              onChangeIndex={this.handleChangeIndex}
              action={(actions) => {
                this.swipeableActions = actions;
              }}
              slideStyle={{
                padding: "0 20px",
              }}
              animateHeight
              enableMouseEvents
            >
              {faqs &&
                faqs[sub_category.cms_category_id].map((item, index) => (
                  <div key={index}>
                    <div className="question">{item.title}</div>
                    <div className="answer">
                      {faqDesc[item.cms_faq_id] &&
                        ReactHtmlParser(faqDesc[item.cms_faq_id].description)}
                    </div>
                  </div>
                ))}
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
      </Container>
    );
  }
}

export default Answers;
