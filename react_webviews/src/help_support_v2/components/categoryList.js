import React, { Component } from "react";
// import {SkeltonRect} from 'common/ui/Skelton';
import { Imgc } from "common/ui/Imgc";
import Container from "../common/Container";
import { categories } from "../constants";
import { initialize } from "../common/functions";
import Search from "./search";
import { getConfig } from "utils/functions";
import { nativeCallback } from 'utils/native_callback';

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: 'p',
      value: "",
      faqList: [],
      sortedList: "",
      showCategory: true,
      categoryList: "",
      screen_name: "category-list",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let { categoryList } = this.state;

    categoryList.map((item) => {
      item.name = categories[item.cms_category_id].tag_name;
      item.icon = categories[item.cms_category_id].icon;

      return item;
    });
    this.setState({
      categoryList: categoryList,
    });
  };

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

    if (
      value.split(" ").length === 2 &&
      value.split("").includes(" ") &&
      value.split(" ")[1] === ""
    ) {
      this.handleSearch();
    }
  };

  handleSearch = async () => {
    let value = this.state.value.split(" ")[0];
    const result = await this.SearchFaq(value);

    this.setState(
      {
        faqList: result.faqs,
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

    console.log(sortedList);

    this.setState({
      sortedList: sortedList,
    });
  };

  handleClick = (category) => {
    this.props.history.push(
      { pathname: 'help/category', search: getConfig().searchParams },
      { category: category }
    );
  }

  render() {
    let { sortedList, value, categoryList } = this.state;
    return (
      <Container
        // skelton={this.state.skelton}
        title="How can we Help?"
        queryTitle="My queries"
        querycta={true}
        noFooter
      >
        <div className="help-CategoryList">
          <Search value={this.state.value} onChange={this.handleChange} />
          {sortedList &&
            value.length !== 0 &&
            sortedList.map((item, index) => (
              <div className="search-inputs" key={index}>
                <div className="faq">
                  <span style={{ color: "var(--primary)" }}>
                    {item.title.slice(0, value.length)}
                  </span>
                  {item.title.slice(value.length)}
                </div>
                <div className="tag">{'MUTUAL FUNDS'}</div>
              </div>
            ))}
          {value.length !== 0 && sortedList.length === 0 && (
            <div className="no-result">No result found</div>
          )}

          {value.length === 0 && categoryList && (
            <div className="fade-in">
              <div className="title">Category</div>
              {categoryList.map((el, index) => (
                <div className="category" key={index} onClick={() => this.handleClick(el)}>
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
              <div className="category contact-category" onClick={() => {
                nativeCallback({
                  action: 'open_in_browser',
                  message: {
                      url: `tel:${getConfig().mobile}`
                  }
              });
              }}>
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
        </div>
      </Container>
    );
  }
}

export default CategoryList;
