import React, { Component } from "react";
// import {SkeltonRect} from 'common/ui/Skelton';
import { Imgc } from "common/ui/Imgc";
import Container from "../common/Container";
import { categories } from "../constants";
import { initialize } from "../common/functions";
import Search from "./search";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import { SkeltonRect } from "common/ui/Skelton";
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
      value: "",
      faqList: [],
      sortedList: "",
      showCategory: true,
      categoryList: "",
      screen_name: "category-list",
      isApiRunning: false,
    };
    this.initialize = initialize.bind(this);
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

      return item;
    });
    
    this.setState({
      categoryList: categoryList,
    });
  };

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "help_and_support",
      properties: {
        user_action: user_action,
        screen_name: "category",
        category_clicked: data.card_name || '',
        my_queries_clicked: data.my_queries_clicked || "no",
        initial_kyc: "",
        invested: "",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = (event) => {
    let value = event.target ? event.target.value : event;
    this.setState(
      {
        value: value,
      },
      () => {
        this.Searching();
      }
    );

    if (value.length === 3) {
      this.handleSearch(value);
    }
  };

  handleSearch = async (value) => {
    const result = await this.SearchFaq(value);

    let list = result.faqs;

    this.setState(
      {
        faqList: result ? list : [],
      },
      () => {
        this.Searching();
      }
    );
  };

  Searching = () => {
    let { value, faqList } = this.state;

    let len = value.length;
    let sortedList = faqList.filter(
      (item) => value.toLowerCase() === item.title.slice(0, len).toLowerCase()
    );

    if (sortedList.length === 0) {
      sortedList = faqList
    }

    this.setState({
      sortedList: sortedList,
    });
  };

  handleClick = (category) => {
    this.sendEvents("next", { card_name: category.cms_category_name });
    this.props.history.push(
      { pathname: "help/category", search: getConfig().searchParams },
      { category: category }
    );
  };

  handleQuery = () => {
    this.sendEvents("next", { my_queries_clicked: "yes" });
    this.navigate("help/queries");
  };

  handleSearchItem = (item) => {
    this.sendEvents("search");

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

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.onload,
          title1: this.state.title1 || true
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  handleContact = () => {
    if (getConfig().Web) {
      this.setState({
        open: true
      })
    } else {
        nativeCallback({
          action: "open_in_browser",
          message: {
            url: `tel:${getConfig().mobile}`,
          },
        });
    }
  }

  render() {
    let { sortedList, value, categoryList, isApiRunning } = this.state;

    return (
      <Container
        // skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
        events={this.sendEvents("just_set_events")}
        title="How can we Help?"
        queryTitle="My queries"
        querycta={true}
        handleQuery={() => this.handleQuery()}
        noFooter
      >
        <div className="help-CategoryList">
          <Search value={this.state.value} onChange={this.handleChange} />
          {sortedList &&
            value.length !== 0 &&
            sortedList.map((item, index) => (
              <div
                className="search-inputs"
                key={index}
                onClick={() => this.handleSearchItem(item)}
              >
                <div className="faq">
                  <span style={{ color: "var(--primary)" }}>
                    {item.title.slice(0, value.length)}
                  </span>
                  {item.title.slice(value.length)}
                </div>
                <div className="tag">
                  {item.cms_category_name}
                  {" > "}
                  {item.cms_sub_category_name}
                </div>
              </div>
            ))}
          {value.length !== 0 && sortedList.length === 0 && !isApiRunning && (
            <div className="no-result">No result found</div>
          )}

          {value.length !== 0 && isApiRunning && (
            <div className="skelton">
              <SkeltonRect className="balance-skelton" />
              <SkeltonRect className="balance-skelton balance-skelton2" />
            </div>
          )}

          {this.state.skelton &&
            [...Array(4)].map((item, index) => (
              <div className="skelton" key={index}>
                <SkeltonRect className="balance-skelton" />
                <SkeltonRect className="balance-skelton balance-skelton2" />
              </div>
            ))}

          {!this.state.skelton && value.length === 0 && categoryList && (
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
