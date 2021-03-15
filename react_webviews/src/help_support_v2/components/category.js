import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
import { getConfig } from "utils/functions";
class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
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
      { pathname: 'sub-category', search: getConfig().searchParams },
      { sub_category: sub_category }
    );
  }

  render() {
    let { category, sub_categories } = this.state;

    return (
      <Container
        title={category.cms_category_name}
        queryTitle="My queries"
        querycta={true}
        noFooter
      >
        <div className="help-category">
          <div className="sub-title">Your query is related to</div>
          {sub_categories &&
            sub_categories.map((item, index) => (
              <div
                className="category"
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
