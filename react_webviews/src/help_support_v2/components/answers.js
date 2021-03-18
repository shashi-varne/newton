import React, { Component } from "react";
import { initialize } from "../common/functions";
import SwipeableViews from "react-swipeable-views";
import ReactHtmlParser from "react-html-parser";
import Container from "../common/Container";
import { SkeltonRect } from "common/ui/Skelton";
import { nativeCallback } from "utils/native_callback";
class Answers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
      index: 0,
      sub_category: "",
      faqs: {},
      faqDesc: {},
      headerTitle: "",
      fromScreen: "",
      sub_category_id: "",
      thumbStatus: "",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  componentDidUpdate() {
    if (Object.keys(this.state.faqs).length !== 0) {
      this.swipeableActions.updateHeight();
    }
  }

  onload = async () => {
    let fromScreen = this.props.location.state.fromScreen;

    let question = this.props.location.state.question;
    let sub_category_id = "";
    let index = 0;
    let faqs = {};
    let sub_category = "";

    this.setState({
      headerTitle: question ? question.cms_category_name : "",
      fromScreen: fromScreen || "",
    });

    if (fromScreen === "categoryList") {
      await this.getFaqDescription(question.cms_faq_id);

      faqs = this.state.faqs;
      sub_category_id = this.state.sub_category_id;
      index = this.state.index;
    } else {
      sub_category = this.props.location.state
        ? this.props.location.state.sub_category
        : {};

      faqs = this.props.location.state ? this.props.location.state.faqs : {};
      index = this.props.location.state ? this.props.location.state.index : {};
      sub_category_id = sub_category.cms_category_id;

      this.setState({
        sub_category: sub_category,
      });
    }

    this.setState({
      sub_category: sub_category,
      faqs: faqs,
      index: index,
      sub_category_id: sub_category_id,
    });

    let faq_id = faqs[sub_category.cms_category_id || sub_category_id][index].cms_faq_id;
    await this.getFaqDescription(faq_id);
  };

  handleChangeIndex = async (index) => {
    this.setState({ index: index, thumbStatus: "" });

    let { faqs, sub_category_id, faqDesc } = this.state;
    let faq_id = faqs[sub_category_id][index].cms_faq_id;

    if (!faqDesc[faq_id]) {
      await this.getFaqDescription(faq_id);
    }
  };

  handleClick = async (dir) => {
    let { index, faqs, sub_category_id, faqDesc } = this.state;

    index = dir === "next" ? index + 1 : index - 1;

    index = index === -1 || index === faqs[sub_category_id].length ? 0 : index;

    this.setState({
      index: index,
      thumbStatus: "",
    });

    let faq_id = faqs[sub_category_id][index].cms_faq_id;

    if (!faqDesc[faq_id]) {
      await this.getFaqDescription(faq_id);
    }
  };

  handleQuery = () => {
    this.navigate("queries");
  };

  handleFeedBack = (status) => {
    let { index, faqs, sub_category_id } = this.state;
    let faq_id = faqs[sub_category_id][index].cms_faq_id;
    this.setState({
      thumbStatus: status,
    });

    this.updateFeedback(status, faq_id);
  };

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "help_and_support",
      properties: {
        user_action: user_action,
        screen_name: "question_answer",
        related_questions_clicked: data.id || "",
        related_questions_id: '',
        my_queries_clicked: data.my_queries_clicked || "no",
        helpful_clicked: data.unable_to_find_query || "no",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.onload,
          title1: this.state.title1 || true,
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };


  render() {
    let {
      sub_category,
      sub_category_id,
      faqs,
      faqDesc,
      headerTitle,
      thumbStatus,
    } = this.state;

    return (
      <Container
        title={headerTitle || sub_category.cms_category_name}
        queryTitle="My queries"
        querycta={true}
        handleQuery={() => this.handleQuery()}
        events={this.sendEvents("just_set_events")}
        showError={this.state.showError}
        errorData={this.state.errorData}
        noFooter
      >
        {Object.keys(faqs).length === 0 && (
          <div className="help-questions">
            {[...Array(4)].map((item, index) => (
              <div className="skelton" key={index}>
                <SkeltonRect className="balance-skelton" />
                <SkeltonRect className="balance-skelton balance-skelton2" />
              </div>
            ))}
          </div>
        )}
        {Object.keys(faqs).length !== 0 && (
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
                  faqs[sub_category_id].map((item, index) => (
                    <div key={index}>
                      <div className="question">{`${item.title}${
                        item.title[item.title.length - 1] !== "?" ? "." : ""
                      }`}</div>
                      <div className="answer">
                        {faqDesc[item.cms_faq_id] &&
                          ReactHtmlParser(faqDesc[item.cms_faq_id].description)}
                        {!faqDesc[item.cms_faq_id] && <div className="skelton">
                          <SkeltonRect className="balance-skelton" />
                          <SkeltonRect className="balance-skelton balance-skelton2" />
                        </div>}
                      </div>
                    </div>
                  ))}
              </SwipeableViews>
            </div>
            <div className="helpful-block">
              <div className="title">
                {!thumbStatus
                  ? `Was this helpful?`
                  : "Thank you for your feedback"}
              </div>
              <div className="thumb-container">
                <img
                  onClick={() => this.handleFeedBack("thumbs_up")}
                  src={require(`assets/${
                    thumbStatus === "thumbs_up" ? "thumb_up_fill" : "thumb_up"
                  }.svg`)}
                  alt=""
                />
                <img
                  onClick={() => this.handleFeedBack("thumbs_down")}
                  src={require(`assets/${
                    thumbStatus === "thumbs_down"
                      ? "thumb_down_fill"
                      : "thumb_down"
                  }.svg`)}
                  alt=""
                />
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
        )}
      </Container>
    );
  }
}

export default Answers;
