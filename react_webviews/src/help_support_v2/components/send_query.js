import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
import { getConfig } from "utils/functions";

class SendQuery extends Component {
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

  handleChange = () => {};

  render() {
    return (
      <Container // skelton={this.state.skelton}
        title="Write to us"
        buttonTitle="PROCEED"
        // skelton={this.state.skelton}
      >
        <div className="send-query">
          <div className="sub-title">Insurance {">"} Health insurance</div>
          <div
            className="input"
            style={{
              border: `1px solid ${
                getConfig().productName === "finity" ? "#CBDEF6" : "#D5CCE9"
              }`,
            }}
          >
            <textarea
              rows="8"
              placeholder="Write your query here"
            //   value={this.state.query}
            //   onChange={this.handleChange()}
            ></textarea>
          </div>
        </div>
      </Container>
    );
  }
}

export default SendQuery;
