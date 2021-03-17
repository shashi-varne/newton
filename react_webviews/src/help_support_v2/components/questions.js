import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
import { getConfig } from "utils/functions";
import { SkeltonRect } from "common/ui/Skelton";
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
    let sub_category = this.props.location.state
      ? this.props.location.state.sub_category
      : {};

    this.setState({
      sub_category: sub_category,
    });

    await this.getAllfaqs(sub_category.cms_category_id);
  };

  handleClick = (index) => {
    let { sub_category, faqs } = this.state;

    this.props.history.push(
      { pathname: "answers", search: getConfig().searchParams },
      { sub_category: sub_category, faqs: faqs, index: index }
    );
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
          {this.state.skelton &&
            [...Array(2)].map(() => (
              <div className="skelton">
                <SkeltonRect className="balance-skelton text" />
                <SkeltonRect className="balance-skelton" />
              </div>
            ))}
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
        </div>
      </Container>
    );
  }
}

export default Questions;
