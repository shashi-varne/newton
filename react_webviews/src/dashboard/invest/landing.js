import React, { Component } from "react";
import Container from "../../fund_details/common/Container";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      recommendations: [
        {
          title: "Insta redemption funds",
          subtitle: "Superior return and money available 24x7",
          button_text: "Invest",
          icon: "ic_invest_build_wealth.svg",
        },
        {
          title: "High growth funds (Build Wealth)",
          subtitle: "Start SIP or One-time investment",
          button_text: "Start Now",
          icon: "ic_invest_build_wealth.svg",
        },
        {
          title: "Insurance",
          subtitle: "Starting from Rs. 50 per year",
          button_text: "GET INSURED",
          icon: "ic_invest_insurance.svg",
        },
      ],
      diy: [
        {
          title: "Insta redemption funds",
          subtitle: "Superior return and money available 24x7",
          button_text: "Explore Now",
          icon: "ic_invest_build_wealth.svg",
        },
        {
          title: "High growth funds (Build Wealth)",
          subtitle: "Start SIP or One-time investment",
          button_text: "Buy Now",
          icon: "ic_invest_build_wealth.svg",
        },
      ],
      bottom_scroll_cards: [
        {
          title: "Short term investments",
          subtitle: "",
          button_text: "",
          icon: "ic_short_term_inv.svg",
          icon_line: "ic_line.svg",
        },
        {
          title: "Invest for a goal",
          subtitle: "",
          button_text: "",
          icon: "ic_save_for_goal.svg",
          icon_line: "ic_line.svg",
        },
      ],
      bottom_cards: [
        {
          title: "New funds offer (NFO)",
          subtitle: "Subscribe early at lowest price for maximum gains",
          button_text: "Explore Funds",
          icon: "ic_invest_nfo.svg",
        },
      ],
      financial_tools: [
        {
          title: "Financial health check",
          subtitle: "Get an expert financial advice",
          button_text: "CHECK NOW",
          icon: "ic_fin_tools_fhc.svg",
        },
        {
          title: "Invest for a goal",
          subtitle: "Invest as per your risk appetite",
          button_text: "START NOW",
          icon: "ic_fin_tools_risk.svg",
        },
      ],
    };
  }

  render() {
    let {
      isReadyToInvestBase,
      productName,
      recommendations,
      diy,
      bottom_scroll_cards,
      bottom_cards,
      financial_tools,
    } = this.state;
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
          {!isReadyToInvestBase && (
            <div
              className="kyc"
              style={{
                backgroundImage: `url(${require(`assets/${productName}/ic_card_kyc_default.svg`)})`,
              }}
            >
              <div className="title">Create investment profile</div>
              <div className="subtitle">Paperless KYC in two minutes</div>
              <Button>CREATE NOW</Button>
            </div>
          )}
          <div className="main-top-title">Our recommendations</div>
          {recommendations &&
            recommendations.map((item, index) => {
              return (
                <div key={index} className="card invest-card">
                  <div className="content">
                    <div className="title">{item.title}</div>
                    <div className="subtitle">{item.subtitle}</div>
                    <Button>{item.button_text}</Button>
                  </div>
                  <div className="image-wrapper">
                    <img
                      src={require(`assets/${productName}/${item.icon}`)}
                      alt=""
                    />
                  </div>
                </div>
              );
            })}
          <div className="main-top-title">Do it yourself</div>
          {diy &&
            diy.map((item, index) => {
              return (
                <div key={index} className="card invest-card">
                  <div className="content">
                    <div className="title">{item.title}</div>
                    <div className="subtitle">{item.subtitle}</div>
                    <Button>{item.button_text}</Button>
                  </div>
                  <div className="image-wrapper">
                    <img
                      src={require(`assets/${productName}/${item.icon}`)}
                      alt=""
                    />
                  </div>
                </div>
              );
            })}
          {bottom_scroll_cards && (
            <div className="bottom-scroll-cards">
              {bottom_scroll_cards.map((item, index) => {
                return (
                  <div key={index} className="card scroll-card">
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
          )}
          {bottom_cards &&
            bottom_cards.map((item, index) => {
              return (
                <div key={index} className="card invest-card">
                  <div className="content">
                    <div className="title">{item.title}</div>
                    <div className="subtitle">{item.subtitle}</div>
                    <Button>{item.button_text}</Button>
                  </div>
                  <div className="image-wrapper">
                    <img
                      src={require(`assets/${productName}/${item.icon}`)}
                      alt=""
                    />
                  </div>
                </div>
              );
            })}
          {financial_tools && (
            <>
              <div className="main-top-title">Financial tools</div>
              <div className="bottom-scroll-cards">
                <div className="list">
                  {financial_tools.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="card invest-card financial-card"
                      >
                        <div className="content">
                          <div className="title">{item.title}</div>
                          <img
                            src={require(`assets/${productName}/${item.icon}`)}
                            alt=""
                            className="icon"
                          />
                        </div>
                        <div className="subtitle">{item.subtitle}</div>
                        <Button>{item.button_text}</Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          <div class="secure-invest-bottom">
            <div class="content">
              Investments with {productName} are 100% secure
            </div>
            <img
              class="trust-icons-invest"
              alt=""
              src={require(`assets/${productName}/trust_icons.svg`)}
            />
          </div>
          {productName !== "fisdom" &&
            productName !== "finity" &&
            productName !== "ktb" && (
              <div class="contact-us">
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
