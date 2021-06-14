import React, { Component } from "react";
import Container from "../../../common/Container";
import { getConfig } from "utils/functions";
import { nfoData } from "../../constants";
import './NFO.scss';

class NfoInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screenName: "nfo_info",
    };
  }

  handleClick = () => {
    this.props.history.push({
      pathname: "/advanced-investing/new-fund-offers/scheme",
      search: getConfig().searchParams,
    });
  };

  render() {
    return (
      <Container
        data-aid='nfo-invest-screen'
        skelton={this.state.show_loader}
        buttonTitle="CONTINUE"
        handleClick={this.handleClick}
        title='Invest in NFO'
      >
        <div className="nfo-info" data-aid='nfo-info'>
          <div
            style={{
              backgroundImage: `url(${require(`assets/nfo_info_cover.png`)})`,
            }}
            className="bg-image"
          ></div>
          <div className="info nfo-data" data-aid='nfo-data'>
            {nfoData.info.map((data, index) => {
              return (
                <div key={index} className="content" data-aid={`nfo-nfoData-${index+1}`}>
                  <img alt="" src={require(`assets/${data.icon}`)} />
                  <div className="text">
                    <div className="title">{data.title}</div>
                    <div className="subtitle">{data.subtitle}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    );
  }
}

export default NfoInfo;
