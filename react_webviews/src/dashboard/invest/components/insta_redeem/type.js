import React, { Component } from "react";
import Container from "../../../../fund_details/common/Container";
import { getConfig } from "utils/functions";
import { initialize } from "../../functions";
import InvestType from "../mini_components/InvestType";
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
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

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
        hideInPageTitle
      >
        <div className="insta-redeem-invest-type">
          <InvestType
            baseData={investRedeemData.investTypeData}
            selected={investType}
            handleChange={this.handleChange}
          />
        </div>
      </Container>
    );
  }
}

export default Type;
