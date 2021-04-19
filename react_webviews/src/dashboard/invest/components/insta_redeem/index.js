import React, { Component } from "react";
import Container from "../../../common/Container";
import { getConfig } from "utils/functions";
import { navigate } from "../../landingFunctions";
import Faqs from "common/ui/Faqs";
import SecureInvest from "../../mini-components/SecureInvest";
import { apiConstants, investRedeemData } from "../../constants";
import Button from "material-ui/Button";
import Dialog, { DialogActions, DialogContent } from "material-ui/Dialog";
import HowToSteps from "common/ui/HowToSteps";
import { SkeltonRect } from "../../../../common/ui/Skelton";
import { isEmpty, storageService } from "../../../../utils/validators";
import Api from "../../../../utils/api";
import toast from "../../../../common/ui/Toast";

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
    this.navigate = navigate.bind(this);
  }

  componentDidMount() {
    this.initializeInstaRedeem();
  }

  handleClick = () => {
    this.navigate("instaredeem/type");
  };

  handleClose = () => {
    this.setState({
      openDialog: false,
    });
  };

  showFundInfo(data) {
    let recommendation = { mf: data };
    let dataCopy = Object.assign({}, recommendation);
    dataCopy.diy_type = "recommendation";
    dataCopy.invest_type_from = "instaredeem";
    storageService().setObject("diystore_fundInfo", dataCopy);
    this.navigate("/fund-details", {
      searchParams: `${getConfig().searchParams}&isins=${data.isin}`,
    });
  }

  initializeInstaRedeem = () => {
    const instaRecommendations =
      storageService().get("instaRecommendations") || [];
    if (!isEmpty(instaRecommendations)) {
      this.setState({
        instaRecommendation: instaRecommendations[0],
      });
    } else {
      this.getInstaRecommendation();
    }
  };

  getInstaRecommendation = async () => {
    this.setState({ show_loader: true });
    try {
      const res = await Api.get(apiConstants.getInstaRecommendation);
      const { result, status_code: status } = res.pfwresponse;
      if (status === 200) {
        storageService().setObject("instaRecommendations", result.mfs);
        storageService().setObject("goalRecommendations", result.itag);
        let instaRecommendation = result.mfs[0];
        this.setState({
          show_loader: false,
          instaRecommendation: instaRecommendation,
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({ show_loader: false });
      toast("Something went wrong!");
    }
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
    let { partner, productName, instaRecommendation, show_loader } = this.state;
    let { benefits, faqData } = investRedeemData;
    return (
      <Container
        buttonTitle="START INVESTING"
        handleClick={this.handleClick}
        title={
          partner.code === "bfdlmobile" ? "Money +" : "Insta redemption fund"
        }
      >
        <div className="invest-redeem">
          <div className="generic-page-subtitle">
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
          <div className="title">Money will be deposited in</div>
          {!isEmpty(instaRecommendation) && !show_loader && (
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
          )}
          {show_loader && <SkeltonRect className="skelton-loader" />}
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
