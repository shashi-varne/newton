import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
import { getConfig } from "utils/functions";
import { SkeltonRect } from "common/ui/Skelton";
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
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  handleClick = (sub_category) => {
    this.props.history.push(
      { pathname: "questions", search: getConfig().searchParams },
      {
        sub_category: sub_category,
        category_name: this.state.category.cms_category_name,
      }
    );
  };

  handleQuery = () => {
    this.navigate("queries");
  };

  render() {
    let { category, sub_categories } = this.state;

    return (
      <Container
        title={category.cms_category_name}
        queryTitle="My queries"
        querycta={true}
        handleQuery={() => this.handleQuery()}
        // skelton={this.state.skelton}
        noFooter
      >
        <div className="help-category">
          <div className="sub-title">Your query is related to</div>
          {this.state.skelton &&
            [...Array(4)].map((item, index) => (
              <div className="skelton" key={index}>
                <SkeltonRect className="balance-skelton" />
                <SkeltonRect className="balance-skelton balance-skelton2" />
              </div>
            ))}
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
