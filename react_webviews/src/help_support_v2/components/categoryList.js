import React, { Component } from "react";
import { storageService } from "utils/validators";
import { Imgc } from "common/ui/Imgc";
import Container from "../common/Container";
import { categories } from "../constants";
import { initialize, getAllCategories, SearchFaq } from "../common/functions";
import scrollIntoView from "scroll-into-view-if-needed";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import ReactHtmlParser from "react-html-parser";
import debounce from "lodash/debounce";
import { MyQueries, CustomSkelton } from "../common/mini_components";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
} from "material-ui/Dialog";
import Button from "material-ui/Button";

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "p",
      searchInput: "",
      faqList: [],
      sortedList: "",
      showCategory: true,
      categoryList: "",
      screen_name: "category-list",
      isApiRunning: false,
      componentClicked: false,
    };
    this.initialize = initialize.bind(this);
    this.getAllCategories = getAllCategories.bind(this);
    this.SearchFaq = SearchFaq.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    let result = await this.getAllCategories();

    let categoryList = result ? result.categories : [];

    categoryList.map((item) => {
      item.name = categories[item.cms_category_id].tag_name;
      item.icon = categories[item.cms_category_id].icon;
      storageService().set(item.cms_category_name, item.cms_category_id);
      return item;
    });

    this.setState({
      categoryList: categoryList,
    });
  };

  sendEvents(user_action, data = {}) {
    let eventObj = {};

    if (data.screen === "search") {
      eventObj = {
        event_name: "help_and_support",
        properties: {
          user_action: user_action,
          screen_name: "search_questions",
          category: data.item.cms_category_name,
          sub_category: data.item.cms_sub_category_name,
          question_clicked: data.item.cms_faq_id,
        },
      };
    } else {
      eventObj = {
        event_name: "help_and_support",
        properties: {
          user_action: user_action,
          screen_name: "category",
          category_clicked: data.card_name || "no",
          my_queries_clicked: data.my_queries_clicked || "no",
        },
      };
    }

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = async (event) => {
    let value = event.target ? event.target.value : event;
    this.setState({
      searchInput: value,
    });

    if (!this.state.isApiRunning) {
      this.setState({ faqList: [] });
      let element = document.getElementById("categoryList");
      if (!element || element === null) {
        return;
      }

      scrollIntoView(element, {
        block: "end",
      });
    }

    if (value[value.length - 1] === " ") {
      let result = await this.SearchFaq(value);
      let list = result ? result.faqs : [];
      this.setState({
        faqList: list,
      });
    } else {
      this.handleSearch(value);
    }
  };

  handleSearch = debounce(
    async (value) => {
      let result = await this.SearchFaq(value);
      let list = result ? result.faqs : [];
      this.setState({
        faqList: list,
      });
    },
    1000,
    { trailing: true }
  );

  handleClick = (category) => {
    this.sendEvents("next", { card_name: category.cms_category_name });
    this.props.history.push(
      { pathname: "help/category", search: getConfig().searchParams },
      { category: category }
    );
  };

  handleQuery = () => {
    this.sendEvents("next", { my_queries_clicked: "yes" });

    this.props.history.push(
      { pathname: "help/queries", search: getConfig().searchParams },
      { fromScreen: "help" }
    );
  };

  handleSearchItem = (item) => {
    this.sendEvents("next", { item: item, screen: "search" });

    this.props.history.push(
      { pathname: "help/answers", search: getConfig().searchParams },
      { question: item, fromScreen: "categoryList" }
    );
  };

  renderDialog = () => {
    return (
      <Dialog
        open={this.state.open || false}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please contact us to this number {getConfig().mobile}.
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ display: "flex" }}>
          <Button onClick={() => this.handleClose()}>GOT IT</Button>
        </DialogActions>
      </Dialog>
    );
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleContact = () => {
    if (getConfig().Web) {
      this.setState({
        open: true,
      });
    } else {
      this.openInBrowser(`tel:${getConfig().mobile}`);
    }
  };

  renderHighlight = (title) => {
    let { searchInput } = this.state;
    let string = title.slice(0, title.length - 1);

    let highlight = string.split(" ").map((word) => {
      let text = searchInput.toLowerCase().split(" ");

      if (text.includes(word.toLowerCase())) {
        return `<span style='color: var(--primary)'>${word}</span>`;
      } else {
        return word;
      }
    });

    return (
      <span>
        {ReactHtmlParser(highlight.join(" ") + title[title.length - 1])}
      </span>
    );
  };

  handleBlankSearch = async (e) => {
    let { componentClicked, faqList } = this.state;
    if (!e.target.id) componentClicked = false;
    else componentClicked = true;

    this.setState({
      componentClicked: componentClicked,
    });

    if (componentClicked && faqList.length === 0) {
      let result = await this.SearchFaq("");
      let list = result ? result.faqs : [];
      this.setState({
        faqList: list,
      });
    }
  };

  render() {
    let {
      faqList,
      searchInput,
      categoryList,
      isApiRunning,
      componentClicked,
    } = this.state;

    return (
      <Container
        showError={this.state.showError}
        errorData={this.state.errorData}
        events={this.sendEvents("just_set_events")}
        styleHeader={{
          display: !this.state.showError ? "none" : "inherit",
        }}
        noFooter
      >
        <div className="help-CategoryList" style={{marginTop: `${faqList.length > 0 && componentClicked ? '106px' : '140px'}`}}>
          <div className="Header header-title-page header-title-page-text">
            <MyQueries
              title="How can we help?"
              onClick={this.handleQuery}
              search={true}
              value={this.state.searchInput}
              onChange={this.handleChange}
              onSearch={this.handleBlankSearch}
              componentClicked={componentClicked}
            />
          </div>

          <div id="categoryList"></div>
          {faqList.length > 0 &&
            !isApiRunning &&
            componentClicked &&
            // searchInput.length !== 0 &&
            faqList.map((item, index) => (
              <div
                className="search-inputs"
                key={index}
                onClick={() => this.handleSearchItem(item)}
              >
                <div className="faq">{this.renderHighlight(item.title)}</div>
                <div className="tag">
                  {item.cms_category_name}
                  {" > "}
                  {item.cms_sub_category_name}
                </div>
              </div>
            ))}
          {searchInput.length !== 0 &&
            faqList.length === 0 &&
            !isApiRunning && <div className="no-result">No result found</div>}

          {componentClicked && isApiRunning && <CustomSkelton />}

          {this.state.skelton && <CustomSkelton />}

          {!this.state.skelton && !componentClicked && categoryList && (
            <div className="fade-in">
              <div className="title">Category</div>

              {categoryList.map((el, index) => (
                <div
                  className="category"
                  key={index}
                  onClick={() => this.handleClick(el)}
                >
                  {el.icon && (
                    <Imgc
                      src={require(`assets/${this.state.productName}/${el.icon}`)}
                      className="img"
                      alt=""
                    />
                  )}
                  <div
                    className="name"
                    style={{
                      border: `${index === categoryList.length - 1 && "0px"}`,
                    }}
                  >
                    {el.cms_category_name}
                  </div>
                </div>
              ))}

              <div className="title">Need more help?</div>
              <div className="generic-hr"></div>
              <div
                className="category contact-category"
                onClick={() => this.handleContact()}
              >
                <Imgc
                  src={require(`assets/${this.state.productName}/icn_contact.svg`)}
                  className="contact-img"
                  alt=""
                />
                <div className="contact">Contact us</div>
              </div>
              <div className="generic-hr"></div>
            </div>
          )}
          {this.renderDialog()}
        </div>
      </Container>
    );
  }
}

export default CategoryList;
