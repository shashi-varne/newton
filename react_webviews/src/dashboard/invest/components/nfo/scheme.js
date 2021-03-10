import React, { Component } from "react";
import Container from "../../../common/Container";
import { getConfig } from "utils/functions";
import { nfoData } from "../../constants";

class NfoScheme extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screenName: "nfo_scheme",
    };
  }

  handleClick = (value) => {
    this.props.history.push({
      pathname: `${value}/funds`,
      search: getConfig().searchParams,
    });
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        noFooter={true}
        hideInPageTitle
        title="Select Scheme"
      >
        <div className="nfo-scheme">
          <div className="info nfo-data">
            {nfoData.scheme.map((data, index) => {
              return (
                <div
                  key={index}
                  className="content card"
                  onClick={() => this.handleClick(data.value)}
                >
                  <div className="text">
                    <div className="title">{data.title}</div>
                    <div className="subtitle">{data.subtitle}</div>
                  </div>
                  <img alt="" src={require(`assets/${data.icon}`)} />
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    );
  }
}

export default NfoScheme;
