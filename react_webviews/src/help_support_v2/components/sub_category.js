import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
// import Questions from "./questions";
import Answers from "./answers";

class SubCategory extends Component {
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
      <Container title="Personal Details" noFooter>
        <div className="help-sub-category">
          {/* <Questions /> */}
          <Answers />
        </div>
      </Container>
    );
  }
}

export default SubCategory;
