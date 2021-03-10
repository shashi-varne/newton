import React, { Component } from "react";
import { Imgc } from "common/ui/Imgc";
import Container from "../common/Container";
import { initialize } from "../common/functions";

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
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  render() {
    return (
      <Container
        // skelton={this.state.skelton}
        title="How can we Help?"
        noFooter
      >
        <div className="help-Category">
          <div className="search"></div>
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
                style={{ border: `${index === catgories.length - 1 && "0px"}` }}
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
      </Container>
    );
  }
}

export default Category;
