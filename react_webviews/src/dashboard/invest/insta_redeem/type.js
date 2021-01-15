import React, { Component } from "react";
import Container from "../../../fund_details/common/Container";
import { getConfig } from "utils/functions";
import { initialize } from "../functions";
import InvestType from "../components/InvestType";

class Type extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      screenName: "insta_redeem_invest_type",
      investType: "onetime",
      renderData: {
        title: "How would you like to invest?",
        count: "1",
        total: "2",
        options: [
          {
            text: "SIP",
            value: "sip",
            icon: "ic_sip.svg",
          },
          {
            text: "One Time",
            value: "onetime",
            icon: "ic_onetime.svg",
          },
        ],
      },
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  handleClick = () => {
    this.navigate("instaredeem/type");
  };

  handleChange = (type) => {
    this.setState({ investType: type });
  };

  render() {
    let { investType, renderData } = this.state;
    return (
      <Container
        showLoader={this.state.show_loader}
        buttonTitle="CONTINUE"
        handleClick={this.handleClick}
      >
        <div className="insta-redeem-invest-type">
          <InvestType
            baseData={renderData}
            selected={investType}
            handleChange={this.handleChange}
          />
        </div>
      </Container>
    );
  }
}

export default Type;
