import React, { Component } from "react";
import Container from "../../../common/Container";
import { getConfig } from "utils/functions";
import { nfoData } from "../../constants";
import './Scheme.scss';

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
        data-aid='nfo-select-scheme-screen'
        showLoader={this.state.show_loader}
        noFooter={true}
        title="Select Scheme"
      >
        <div className="nfo-scheme" data-aid='nfo-scheme'>
          <div className="info nfo-data">
            {nfoData.scheme.map((data, index) => {
              return (
                <div
                  data-aid={`nfo-nfoData-${index+1}`}
                  key={index}
                  className="content card"
                  onClick={() => this.handleClick(data.value)}
                >
                  <div className="text" data-aid={`nfo-nfoData-text-${index+1}`}>
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
