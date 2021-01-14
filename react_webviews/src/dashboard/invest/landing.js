import React, { Component } from "react";
import Container from "../../fund_details/common/Container";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";
import { initialize } from "./functions";
import InvestCard from "./components/invest_card";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      partner: getConfig().partner,
      screenName: "invest_landing",
      invest_show_data: {},
      render_cards: [],
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    this.setInvestCardsData();
  };

  render() {
    let {
      isReadyToInvestBase,
      productName,
      invest_show_data,
      partner,
      render_cards,
    } = this.state;
    let {
      our_recommendations,
      diy,
      bottom_scroll_cards,
      bottom_cards,
      popular_cards,
    } = invest_show_data;
    return (
      <Container
        showLoader={this.state.show_loader}
        noHeader={this.state.show_loader}
        noFooter={true}
      >
        <div className="invest-landing">
          <div className="main-top-title">Start Investing</div>
          <div className="main-top-subtitle">
            {isReadyToInvestBase
              ? " Your KYC is verified, You’re ready to invest"
              : "Invest in your future"}
          </div>
          {!isReadyToInvestBase && render_cards.includes("kyc") && (
            <div
              className="kyc"
              style={{
                backgroundImage: `url(${require(`assets/${productName}/ic_card_kyc_default.svg`)})`,
              }}
              onClick={() => this.clickCard("kyc", "Create investment profile")}
            >
              <div className="title">Create investment profile</div>
              <div className="subtitle">Paperless KYC in two minutes</div>
              <Button>CREATE NOW</Button>
            </div>
          )}
          <div className="main-top-title">Our recommendations</div>
          {render_cards.includes("our_recommendations") &&
            our_recommendations &&
            our_recommendations.map((item, index) => {
              return (
                <InvestCard
                  data={item}
                  key={index}
                  handleClick={() => this.clickCard(item.key, item.title)}
                />
              );
            })}
          <div className="main-top-title">Do it yourself</div>
          {render_cards.includes("diy") &&
            diy &&
            diy.map((item, index) => {
              return (
                <InvestCard
                  data={item}
                  key={index}
                  handleClick={() => this.clickCard(item.key, item.title)}
                />
              );
            })}
          {render_cards.includes("bottom_scroll_cards") && bottom_scroll_cards && (
            <div className="bottom-scroll-cards">
              <div className="list">
                {bottom_scroll_cards.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="card scroll-card"
                      onClick={() => this.clickCard(item.key, item.title)}
                    >
                      <div className="title">{item.title}</div>
                      <div className="icons">
                        <img
                          src={require(`assets/${productName}/${item.icon_line}`)}
                          alt=""
                        />
                        <img
                          src={require(`assets/${productName}/${item.icon}`)}
                          alt=""
                          className="icon"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {render_cards.includes("bottom_cards") &&
            bottom_cards &&
            bottom_cards.map((item, index) => {
              return (
                <InvestCard
                  data={item}
                  key={index}
                  handleClick={() => this.clickCard(item.key, item.title)}
                />
              );
            })}

          {render_cards.includes("financial_tools") && (
            <>
              {partner.invest_screen_cards &&
                partner.invest_screen_cards.risk_profile && (
                  <div className="main-top-title">Financial tools</div>
                )}
              {partner.invest_screen_cards &&
                (partner.invest_screen_cards.risk_profile ||
                  partner.invest_screen_cards.fhc) && (
                  <div className="bottom-scroll-cards">
                    <div className="list">
                      {partner.invest_screen_cards.fhc && (
                        <div
                          className="card invest-card financial-card"
                          onClick={() => this.clickCard("fhc")}
                        >
                          <div className="content">
                            <div className="title">Financial health check</div>
                            <img
                              src={require(`assets/${productName}/ic_fin_tools_fhc.svg`)}
                              alt=""
                              className="icon"
                            />
                          </div>
                          <div className="subtitle">
                            Get an expert financial advice
                          </div>
                          <Button>CHECK NOW</Button>
                        </div>
                      )}
                      {partner.invest_screen_cards.risk_profile && (
                        <div
                          className="card invest-card financial-card"
                          onClick={() => this.clickCard("risk_profile")}
                        >
                          <div className="content">
                            <div className="title">Invest for a goal</div>
                            <img
                              src={require(`assets/${productName}/ic_fin_tools_risk.svg`)}
                              alt=""
                              className="icon"
                            />
                          </div>
                          <div className="subtitle">
                            Invest as per your risk appetite
                          </div>
                          <Button>START NOW</Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </>
          )}
          {render_cards.includes("popular_cards") && popular_cards && (
            <>
              <div className="main-top-title">More investment options</div>
              <div className="bottom-scroll-cards">
                <div className="list">
                  {popular_cards.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="card popular"
                        onClick={() => this.clickCard(item.key, item.title)}
                        style={{
                          backgroundImage: `url(${require(`assets/${productName}/${item.icon}`)})`,
                        }}
                      >
                        <div className="title">{item.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          <div className="secure-invest-bottom">
            <div className="content">
              Investments with {productName} are 100% secure
            </div>
            <img
              className="trust-icons-invest"
              alt=""
              src={require(`assets/${productName}/trust_icons.svg`)}
            />
          </div>
          {productName !== "fisdom" &&
            productName !== "finity" &&
            productName !== "ktb" && (
              <div className="contact-us">
                In partnership with
                <span>
                  {productName === "bfdlmobile" ||
                  this.state.isIframe ||
                  this.state.finity
                    ? " Finity"
                    : " Fisdom"}
                </span>
              </div>
            )}
        </div>
      </Container>
    );
  }
}

export default Landing;
