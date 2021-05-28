import React, { Component } from "react";
import Container from "../../../common/Container";
import { getConfig } from "utils/functions";
import SdkInvestCard from "../../mini-components/SdkInvestCard";
import "./SdkLanding.scss";
import { sdkInvestCardMapper } from "../../constants";

const config = getConfig();
class Prepare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSkelton: false,
    };
  }

  handleCard = (path) => () => {
    if (path === "/invest") {
      this.navigate("/");
    } else {
      return;
    }
  };

  navigate = (path) => {
    this.props.history.push({
      pathname: path,
      search: config.searchParams,
    });
  };

  render() {
    return (
      <Container skelton={this.state.showSkelton} noFooter={true} title="Hello">
        <div className="sdk-landing">
          <div className="generic-page-subtitle">
            Let’s make your money work for you!
          </div>
          <div className="sdk-landing-cards">
            {sdkInvestCardMapper.map((el, idx) => {
              return (
                <SdkInvestCard
                  key={idx}
                  {...el}
                  handleCard={this.handleCard(el?.path)}
                />
              );
            })}
          </div>
        </div>
      </Container>
    );
  }
}

export default Prepare;
