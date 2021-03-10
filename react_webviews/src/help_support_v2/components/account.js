import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";

class Account extends Component {
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
      <Container title="Account" noFooter>
        <div className="help-account">
          <div className="sub-title">Your query is related to</div>
          <div className="category">
            <div className="cat-name">Personal Details</div>
            <img
              src={require(`assets/${this.state.productName}/next_arrow.svg`)}
              alt=""
            />
          </div>
          <div className="category">
            <div className="cat-name">KYC</div>
            <img
              src={require(`assets/${this.state.productName}/next_arrow.svg`)}
              alt=""
            />
          </div>
          <div className="category">
            <div className="cat-name">Referral</div>
            <img
              src={require(`assets/${this.state.productName}/next_arrow.svg`)}
              alt=""
            />
          </div>
        </div>
      </Container>
    );
  }
}

export default Account;
