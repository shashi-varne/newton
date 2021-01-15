import React, { Component } from "react";
import Container from "../../../fund_details/common/Container";
import { getConfig } from "utils/functions";
import { initialize } from "../functions";
import Faqs from "../../../common/ui/Faqs";
import SecureInvest from "../components/SecureInvest";
import { investRedeemData } from "../constants";

class InstaRedeem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      screenName: "insta_redeem",
      partner: getConfig().partner,
      instaRecommendation: {
        amc_logo_big:
          "https://sdk-dot-plutus-staging.appspot.com/static/img/amc-logo/high-res/icici_new.png",
        amc_logo_small:
          "https://sdk-dot-plutus-staging.appspot.com/static/img/amc-logo/low-res/icici_new.png",
        default_date: 10,
        isin: "INF109K01VQ1",
        mfamountmultiple: 100,
        mfid: "103340",
        mfname: "Icici Prudential Liquid Fund",
        mftype: "insta-redeem",
        mftype_name: "Bond",
        min_purchase: 500,
        rating: 5,
        returns: {
          five_year: 6.46647,
          isin: "INF109K01VQ1",
          lifetime: 7.55343,
          one_month: 0.24191,
          one_year: 4.18316,
          six_month: 1.56606,
          three_month: 0.74491,
          three_year: 6.02864,
        },
        sip_dates: [1, 2, 3, 4],
        the_hindu_rating: 0,
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

  render() {
    let { partner, productName, instaRecommendation } = this.state;
    let { benefits, faqData } = investRedeemData;
    return (
      <Container
        showLoader={this.state.show_loader}
        noHeader={this.state.show_loader}
        buttonTitle="START INVESTING"
        handleClick={this.handleClick}
      >
        <div className="invest-redeem">
          <div className="main-top-title">
            {partner.code === "bfdlmobile"
              ? "Money +"
              : "Insta redemption fund"}
          </div>
          <div className="main-top-subtitle">
            Instant withdrawal facility with superior return compared to savings
            bank account
          </div>
          <div className="title">Benefits</div>
          {benefits.map((data, index) => {
            return (
              <div key={index} className="benefit">
                <img
                  src={require(`assets/${productName}/${data.icon}`)}
                  alt=""
                />
                <div className="text">
                  {data.disc}
                  {data.key === "withdrawal" && (
                    <div className="know-more">KNOW MORE</div>
                  )}
                </div>
              </div>
            );
          })}
          <div className="title">Money will be deposited in</div>
          <div className="card fund-card">
            <div className="text">
              <h1>{instaRecommendation.mfname}</h1>
              <div className="flex">
                <div className="common-badge bond">
                  {instaRecommendation.mftype_name}
                </div>
                {partner.code !== "hbl" && instaRecommendation.rating > 0 && (
                  <div className="common-badge rating">
                    <div className="img">
                      <img src={require(`assets/ic_star.svg`)} alt="" />
                    </div>
                    <div className="value">{instaRecommendation.rating}</div>
                  </div>
                )}
                {partner.code === "hbl" &&
                  instaRecommendation.the_hindu_rating > 0 && (
                    <div className="common-badge rating">
                      <div className="img">
                        <img src={require(`assets/ic_star.svg`)} alt="" />
                      </div>
                      <div className="value">
                        {instaRecommendation.the_hindu_rating}
                      </div>
                    </div>
                  )}
                <div className="returns">
                  {instaRecommendation.returns &&
                    instaRecommendation.returns.five_year && (
                      <span className="highlight-return">
                        {instaRecommendation.returns.five_year.toFixed(2)}%
                      </span>
                    )}
                  in 5yrs
                </div>
              </div>
            </div>
            <img
              className="icon"
              src={instaRecommendation.amc_logo_small}
              alt="logo"
            />
          </div>
          <div className="title">Frequently asked questions</div>
          <div className="generic-render-faqs">
            <Faqs options={faqData} />
          </div>
          <SecureInvest />
        </div>
      </Container>
    );
  }
}

export default InstaRedeem;
