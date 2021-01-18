import React, { Component } from "react";
import Container from "../../../fund_details/common/Container";
import { getConfig } from "utils/functions";
import { initialize } from "../functions";
import Faqs from "../../../common/ui/Faqs";
import SecureInvest from "../components/SecureInvest";
import { investRedeemData } from "../constants";
import Button from "material-ui/Button";
import Dialog, { DialogActions, DialogContent } from "material-ui/Dialog";
import HowToSteps from "../../../common/ui/HowToSteps";

class InstaRedeem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      screenName: "insta_redeem",
      partner: getConfig().partner,
      openDialog: false,
      instaRecommendation: {},
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    this.initializeInstaRedeem();
  };

  handleClick = () => {
    this.navigate("instaredeem/type");
  };

  handleClose = () => {
    this.setState({
      openDialog: false,
    });
  };

  renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
        className="invest-redeem-dialog"
      >
        <DialogContent className="dialog-content">
          <div className="head-bar">
            <div className="text-left">Instant withdrawal</div>
            <img
              src={require(`assets/${this.state.productName}/ic_instant_withdrawal.svg`)}
              alt=""
            />
          </div>
          <div className="subtitle">
            Get your money whenever you need in two easy steps
          </div>
          <HowToSteps
            baseData={investRedeemData.withdrawSteps}
            style={{ margin: "0", padding: "5px 0 0 0" }}
          />
          <div className="sub-text">
            Max limit is 50 k or 90% of folio value with redemption time of 30
            mins. Additional amount can be withdrawn from systematic/manual
            withdraw where amount is credited in 3-4 working days.
          </div>
          <div className="sub-text">
            Exit load on withdrawal amount is 0.0070% to 0.0045% before seven
            days and 0% seven days onwards
          </div>
        </DialogContent>
        <DialogActions className="action">
          <Button onClick={this.handleClose} className="button">
            OKAY
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  knowMore = () => {
    this.setState({ openDialog: true });
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
                    <div className="know-more" onClick={this.knowMore}>
                      KNOW MORE
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {instaRecommendation && (
            <>
              <div className="title">Money will be deposited in</div>
              <div
                className="card fund-card"
                onClick={() => this.showFundInfo(instaRecommendation)}
              >
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
                        <div className="value">
                          {instaRecommendation.rating}
                        </div>
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
            </>
          )}
          <div className="title">Frequently asked questions</div>
          <div className="generic-render-faqs">
            <Faqs options={faqData} />
          </div>
          <SecureInvest />
          {this.renderDialog()}
        </div>
      </Container>
    );
  }
}

export default InstaRedeem;
