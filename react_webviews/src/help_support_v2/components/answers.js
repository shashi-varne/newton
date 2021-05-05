import React, { Component } from "react";
import { initialize, getFaqDescription, getAllfaqs, updateFeedback } from "../common/functions";
import SwipeableViews from "react-swipeable-views";
import ReactHtmlParser from "react-html-parser";
import Container from "../common/Container";
import { nativeCallback } from "utils/native_callback";
import { MyQueries, CustomSkelton } from "../common/mini_components";
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
      isApiRunning: false,
    };
    this.initialize = initialize.bind(this);
    this.getAllfaqs = getAllfaqs.bind(this);
    this.getFaqDescription = getFaqDescription.bind(this);
    this.updateFeedback = updateFeedback.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  componentDidUpdate() {
    if (Object.keys(this.state.faqs).length !== 0) {
      this.swipeableActions.updateHeight();
    }

    let aTags = document.getElementsByTagName('a') || [];
    for (var i = 0; i < aTags.length; i++) {
      let url = aTags[i].href;
      aTags[i].onclick = function (event) {

        event.preventDefault(); // default behaviour removed to handle our own
        nativeCallback({
          action: 'open_in_browser',
          message: {
            url: url
          }
        });
      }
    }
    let imgTags = document.getElementsByTagName('img') || [];
    for (var i = 0; i < imgTags.length; i++) {
      imgTags[i].addEventListener("load",this.updateHeight)
    }
  }

  updateHeight = () =>{
    this.swipeableActions.updateHeight()
  }

  onload = async () => {
    let fromScreen = this.props.location.state.fromScreen;

    let question = this.props.location.state.question;
    let sub_category_id = "";
    let index = 0;
    let faqs = {};
    let sub_category = "";
    let faqDesc = {};

    this.setState({
      headerTitle: question?.cms_category_name || "",
      fromScreen: fromScreen || "",
    });

    if (fromScreen === "categoryList") {
      this.setState({
        headerTitle: question?.cms_sub_category_name || "",
      });

      let res = await this.getFaqDescription(question.cms_faq_id);

      if (fromScreen === "categoryList" && Object.keys(this.state.faqs).length === 0) {
        this.setState({
          sub_category_id: res.faq.cms_sub_category_id,
          index: res.faq.sequence_no - 1,
        });

        let result = await this.getAllfaqs(res.faq.cms_sub_category_id);

        faqs[res.faq.cms_sub_category_id] = result.faqs;

        this.setState({
          faqs: faqs,
        });
      }

      faqs = this.state.faqs;
      sub_category_id = this.state.sub_category_id;
      index = this.state.index;
    } else {
      sub_category = this.props.location.state?.sub_category || {};

      faqs = this.props.location.state?.faqs || {};
      index = this.props.location.state ? this.props.location.state.index : "";
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

    let result = await this.getFaqDescription(faq_id);

    faqDesc[faq_id] = result.faq;

    this.setState({
      faqDesc: faqDesc,
    });
  };

  handleChangeIndex = async (index) => {
    this.setState({
      index: index,
      thumbStatus: "",
      related_questions_clicked: "yes",
      helpful_clicked: "no",
    });

    let { faqs, sub_category_id } = this.state;
    let faq_id = faqs[sub_category_id][index].cms_faq_id;

    this.sendEvents("next", {
      related_questions_clicked: "yes",
      related_questions_id: faq_id,
    });

    this.handleDescription(faq_id);
  };

  handleDescription = async (faq_id) => {
    let { faqDesc } = this.state;

    if (!faqDesc[faq_id]) {
      let result = await this.getFaqDescription(faq_id);
      faqDesc[faq_id] = result.faq;

      this.setState({
        faqDesc: faqDesc,
      });
    }
  }

  handleClick = async (dir) => {
    let { index, faqs, sub_category_id } = this.state;

    index = dir === "next" ? index + 1 : index - 1;

    index =
      index === -1
        ? 0
        : index === faqs[sub_category_id].length
          ? faqs[sub_category_id].length - 1
          : index;

    this.setState({
      index: index,
      thumbStatus: "",
      related_questions_clicked: "yes",
      helpful_clicked: false,
      not_helpful_clicked: false,
    });

    let faq_id = faqs[sub_category_id][index].cms_faq_id;

    if (index !== 0 && index !== faqs[sub_category_id].length - 1) {
      this.sendEvents("next", {
        related_questions_clicked: "yes",
        related_questions_id: faq_id,
      });
    }

    this.handleDescription(faq_id);
  };

  handleQuery = () => {
    this.sendEvents("next", { my_queries_clicked: "yes" });
    this.navigate("queries");
  };

  handleFeedBack = (status) => {
    let { index, faqs, sub_category_id } = this.state;
    let faq_id = faqs[sub_category_id][index].cms_faq_id;
    this.setState({
      thumbStatus: status,
      helpful_clicked: status === "thumbs_up",
      not_helpful_clicked: status === "thunbs_down",
    });

    this.updateFeedback(status, faq_id);
  };

  sendEvents(user_action, data = {}) {
    let { helpful_clicked, not_helpful_clicked } = this.state;

    let eventObj = {
      event_name: "help_and_support",
      properties: {
        user_action: user_action,
        screen_name: "question_answer",
        related_questions_clicked: data.related_questions_clicked || "no",
        related_questions_id: data.related_questions_id,
        my_queries_clicked: data.my_queries_clicked || "no",
        helpful_clicked: helpful_clicked ? "yes" : "no",
        not_helpful_clicked: not_helpful_clicked ? "yes" : "no",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    let {
      sub_category,
      sub_category_id,
      faqs,
      faqDesc,
      headerTitle,
      thumbStatus,
      isApiRunning,
    } = this.state;

    return (
      <Container
        title={
          <MyQueries
            title={headerTitle || sub_category.cms_category_name}
            onClick={this.handleQuery}
          />
        }

        events={this.sendEvents("just_set_events")}
        showError={this.state.showError}
        errorData={this.state.errorData}
        noFooter
      >
        {Object.keys(faqs).length === 0 && (
          <div className="help-questions">
            <CustomSkelton />
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
                      <div className="question">{`${item.title}${item.title[item.title.length - 1] !== "?" ? "." : ""
                        }`}</div>
                      <div className="answer">
                        {faqDesc[item.cms_faq_id] &&
                          ReactHtmlParser(faqDesc[item.cms_faq_id].description)}
                        {!faqDesc[item.cms_faq_id] && (
                          <CustomSkelton length={1} />
                        )}
                      </div>
                    </div>
                  ))}
              </SwipeableViews>
            </div>
            <div className="helpful-block">
              <div className="title">
                {!thumbStatus
                  ? `Was this helpful?`
                  : "Thank you for your feedback!"}
              </div>
              <div className="thumb-container">
                <img
                  onClick={() =>
                    !isApiRunning && this.handleFeedBack("thumbs_up")
                  }
                  src={require(`assets/${thumbStatus === "thumbs_up" ? "thumb_up_fill" : "thumb_up"
                    }.svg`)}
                  alt=""
                />
                <img
                  onClick={() =>
                    !isApiRunning && this.handleFeedBack("thumbs_down")
                  }
                  src={require(`assets/${thumbStatus === "thumbs_down"
                      ? "thumb_down_fill"
                      : "thumb_down"
                    }.svg`)}
                  alt=""
                />
              </div>
            </div>
            <div className="generic-hr hr"></div>
            <div className="navigation">
              <div
                className="nav"
                onClick={() => this.handleClick("prev")}
                style={{ opacity: this.state.index === 0 ? 0.5 : 1 }}
              >
                <img src={require(`assets/back_nav_bar_icon.svg`)} alt="" />
                Prev
              </div>
              <div
                className="nav"
                onClick={() => this.handleClick("next")}
                style={{
                  opacity:
                    this.state.index === faqs[sub_category_id].length - 1
                      ? 0.5
                      : 1,
                }}
              >
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
