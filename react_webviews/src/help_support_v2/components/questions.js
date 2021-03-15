import React, { Component } from "react";
import { initialize } from "../common/functions";

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
      sub_category_id: "",
      faqs: '',
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    this.setState({
      faqs: this.props.faqs,
      sub_category_id: this.props.id
    });
  };

  render() {
    let { faqs, sub_category_id } = this.state;

    return (
      <div className="help-questions">
        {Object.keys(faqs).length > 0 && faqs[sub_category_id].map((item, index) => (
          <div className="category" key={index}>
            <div className="cat-name">
              How to update email ID on the application ?
            </div>
            <img
              src={require(`assets/${this.state.productName}/next_arrow.svg`)}
              alt=""
            />
          </div>
        ))}
        {/* <div className="category">
          <div className="cat-name">
            How to update phone number on the application?
          </div>
          <img
            src={require(`assets/${this.state.productName}/next_arrow.svg`)}
            alt=""
          />
        </div>
        <div className="category">
          <div className="cat-name">
            How to update address detail on the application ?
          </div>
          <img
            src={require(`assets/${this.state.productName}/next_arrow.svg`)}
            alt=""
          />
        </div> */}
        <div className="help-query-btn">
          <div className="generic-page-button-small query-btn">
            Unable to find my query
          </div>
        </div>
      </div>
    );
  }
}

export default Questions;
