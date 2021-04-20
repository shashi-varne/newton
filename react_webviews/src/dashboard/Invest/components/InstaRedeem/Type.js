import React, { Component } from "react";
import Container from "../../../common/Container";
import { getConfig } from "utils/functions";
import { navigate } from "../../functions";
import InvestType from "../../mini-components/InvestType";
import { investRedeemData } from "../../constants";

class Type extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      screenName: "insta_redeem_invest_type",
      investType: "onetime",
    };
    this.navigate = navigate.bind(this);
  }

  handleClick = () => {
    this.navigate(`amount/${this.state.investType}`);
  };

  handleChange = (type) => {
    this.setState({ investType: type });
  };

  render() {
    let { investType } = this.state;
    return (
      <Container
        showLoader={this.state.show_loader}
        buttonTitle="CONTINUE"
        handleClick={this.handleClick}
        title="How would you like to invest?"
        count="1"
        total="2"
        current="1"
      >
        <InvestType
          baseData={investRedeemData.investTypeData}
          selected={investType}
          handleChange={this.handleChange}
        />
      </Container>
    );
  }
}

export default Type;
