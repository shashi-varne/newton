import React, { Component } from "react";
import Container from "../common/Container";
import { initialize, getSubCategories } from "../common/functions";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import { MyQueries, CustomSkelton } from "../common/mini_components";
class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "p",
      screen_name: "category",
      category: "",
      sub_categories: "",
    };
    this.initialize = initialize.bind(this);
    this.getSubCategories = getSubCategories.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    let category = this.props.location.state?.category || {};

    this.setState({
      category: category,
    });
    let result = await this.getSubCategories(category.cms_category_id);
    this.setState({
      sub_categories: result?.sub_categories || [],
    });
  };

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "help_and_support",
      properties: {
        user_action: user_action,
        screen_name: "sub_category",
        sub_category_clicked: data.card_name || "",
        my_queries_clicked: data.my_queries_clicked || "no",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = (sub_category) => {
    this.sendEvents("next", { card_name: sub_category.cms_category_name });
    this.props.history.push(
      { pathname: "questions", search: getConfig().searchParams },
      {
        sub_category: sub_category,
        category_name: this.state.category.cms_category_name,
      }
    );
  };

  handleQuery = () => {
    this.sendEvents("next", { my_queries_clicked: "yes" });

    this.props.history.push(
      { pathname: "queries", search: getConfig().searchParams },
      { fromScreen: "category" }
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
    let { category, sub_categories } = this.state;

    return (
      <Container
        events={this.sendEvents("just_set_events")}
        title={
          <MyQueries
            title={category.cms_category_name}
            onClick={this.handleQuery}
          />
        }
        twoTitle={true}
        showError={this.state.showError}
        errorData={this.state.errorData}
        noFooter
      >
        <div className="help-category">
          <div className="sub-title">Your query is related to</div>
          {this.state.skelton && <CustomSkelton />}
          {!this.state.skelton &&
            sub_categories &&
            sub_categories.map((item, index) => (
              <div
                className="category fade-in"
                key={index}
                style={{
                  borderColor: `${
                    index === sub_categories.length - 1
                      ? "#ffffff"
                      : "var(--highlight)"
                  }`,
                }}
                onClick={() => this.handleClick(item)}
              >
                <div className="cat-name">{item.cms_category_name}</div>
                <img
                  src={require(`assets/${this.state.productName}/next_arrow.svg`)}
                  alt=""
                />
              </div>
            ))}
        </div>
      </Container>
    );
  }
}

export default Category;
