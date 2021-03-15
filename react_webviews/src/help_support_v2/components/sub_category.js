import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
// import Questions from "./questions";
// import Answers from "./answers";

class SubCategory extends Component {
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
    let sub_category = this.props.location.state
      ? this.props.location.state.sub_category
      : {};

    this.setState({
      sub_category: sub_category,
    });

    await this.getAllfaqs(sub_category.cms_category_id);

  };

  render() {
    let { sub_category, faqs } = this.state;

    return (
      <Container
        title={sub_category.cms_category_name}
        queryTitle="My queries"
        querycta={true}
        noFooter
      >
        <div className="help-questions">
          {Object.keys(faqs).length > 0 &&
            faqs[sub_category.cms_category_id].map((item, index) => (
              <div className="category" key={index}>
                <div className="cat-name">{item.title}</div>
                <img
                  src={require(`assets/${this.state.productName}/next_arrow.svg`)}
                  alt=""
                />
              </div>
            ))}

          {/* <Answers /> */}
        </div>
      </Container>
    );
  }
}

export default SubCategory;
