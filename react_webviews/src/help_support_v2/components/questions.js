import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import { MyQueries, CustomSkelton } from "../common/mini_components";
class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
      sub_category: "",
      faqs: {},
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    let sub_category = this.props.location.state?.sub_category || {};

    let category_name = this.props.location.state.category_name;

    this.setState({
      sub_category: sub_category,
      category_name: category_name,
    });

    let sub_category_id = sub_category.cms_category_id
    let result = await this.getAllfaqs(sub_category_id);

    let { faqs } = this.state;
    faqs[sub_category_id] = result.faqs;

    this.setState({
      faqs: faqs,
    })
  };

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "help_and_support",
      properties: {
        user_action: user_action,
        screen_name: "questions",
        question_clicked: data.id || "no",
        my_queries_clicked: data.my_queries_clicked || "no",
        unable_to_find_clicked: data.unable_to_find_query || "no",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = (index) => {
    let { sub_category, faqs, category_name } = this.state;
    this.sendEvents("next", {
      id: faqs[sub_category.cms_category_id][index].cms_faq_id,
    });

    this.props.history.push(
      { pathname: "answers", search: getConfig().searchParams },
      {
        sub_category: sub_category,
        faqs: faqs,
        index: index,
        category_name: category_name,
      }
    );
  };

  handleQuery = () => {
    this.sendEvents("next", { my_queries_clicked: "yes" });
    
    this.props.history.push(
      { pathname: "queries", search: getConfig().searchParams },
      { fromScreen: "questions" }
    );
  };

  handleCta = () => {
    this.sendEvents("next", { unable_to_find_query: "yes" });
    let { sub_category, category_name } = this.state;

    this.props.history.push(
      { pathname: "send-query", search: getConfig().searchParams },
      {
        sub_category: sub_category.cms_category_name,
        category: category_name,
      }
    );
  };

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.onload,
          title1: this.state.title1,
          button_text1: "Retry",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  render() {
    let { sub_category, faqs } = this.state;

    return (
      <Container
        title={
          <MyQueries title={sub_category.cms_category_name} onClick={this.handleQuery} />
        }
        twoTitle={true}
        events={this.sendEvents("just_set_events")}
        showError={this.state.showError}
        errorData={this.state.errorData}
        noFooter
      >
        <div className="help-questions">
          {this.state.skelton && <CustomSkelton />}
          {!this.state.skelton &&
            Object.keys(faqs).length > 0 &&
            faqs[sub_category.cms_category_id].map((item, index) => (
              <div
                className="category fade-in"
                key={index}
                onClick={() => this.handleClick(index)}
              >
                <div className="cat-name">{item.title}</div>
                <img
                  src={require(`assets/${this.state.productName}/next_arrow.svg`)}
                  alt=""
                />
              </div>
            ))}
          {!this.state.skelton && <div
            className="generic-page-button-small query-btn fade-in"
            onClick={() => this.handleCta()}
          >
            Unable to find my query
          </div>}
        </div>
      </Container>
    );
  }
}

export default Questions;
