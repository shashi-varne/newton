import React, { Component } from "react";
import { Imgc } from "common/ui/Imgc";
import Container from "../common/Container";
import { initialize } from "../common/functions";
import Search from "./search";

const catgories = [
  {
    category: "Mutual Fund",
    icon: "mutual_fund",
    name: "Mutual Funds",
  },
  {
    category: "Digital Gold",
    icon: "gold",
    name: "Gold",
  },
  {
    category: "Insurance",
    icon: "term_insurance",
    name: "Insurance",
  },
  {
    category: "Digital Gold",
    icon: "nps",
    name: "National Pensing Scheme",
  },
  {
    category: "Lending",
    icon: "loan_icon",
    name: "Loans",
  },
  {
    category: "Accounts",
    icon: "account",
    name: "Account",
  },
  {
    category: "payments",
    icon: "payment_transaction",
    name: "Payments/transactions",
  },
];

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
      value: "",
      faqList: [],
      sortedList: "",
      showCategory: true,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

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

  headerWithquery = () => {
    return (
      <div className="help-header">
        <div className="title">How can we Help?</div>
        <div className="my-query">My queries</div>
      </div>
    );
  };

  render() {
    let { sortedList, value } = this.state;
    return (
      <Container
        // skelton={this.state.skelton}
        // title="How can we Help?"
        title={this.headerWithquery()}
        styleHeader={{
          width: '100%'
        }}
        noFooter
      >
        <div className="help-Category">
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
                <div className="tag">Mutual funds</div>
              </div>
            ))}
          {value.length !== 0 && sortedList.length === 0 && (
            <div className="no-result">Sorry! No results.</div>
          )}
          {value.length === 0 && (
            <div className="fade-in">
              <div className="title">Category</div>
              {catgories.map((el, index) => (
                <div className="category" key={index}>
                  <Imgc
                    src={require(`assets/${this.state.productName}/${el.icon}.svg`)}
                    className="img"
                    alt=""
                  />
                  <div
                    className="name"
                    style={{
                      border: `${index === catgories.length - 1 && "0px"}`,
                    }}
                  >
                    {el.name}
                  </div>
                </div>
              ))}
              <div className="title">Need more help?</div>
              <div className="generic-hr"></div>
              <div className="category contact-category">
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

export default Category;
