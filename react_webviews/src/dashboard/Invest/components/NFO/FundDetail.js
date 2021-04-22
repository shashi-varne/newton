import React, { Component } from "react";
import Container from "../../../common/Container";
import { storageService } from "utils/validators";
import { navigate } from "../../functions";
import { getFormattedDate, getSchemeOption } from "./nfoFunctions";
import Button from "common/ui/Button";
import "./FundDetail.scss";

class FundDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screenName: "nfo_fund_detail",
    };
    this.navigate = navigate.bind(this);
  }

  componentDidMount() {
    this.onload();
  }

  onload = () => {
    let { state } = this.props.location || {};
    let fund = storageService().getObject("nfo_detail_fund");
    if (state && state.mfid && fund) {
      this.setState({ fund: fund });
    } else {
      this.props.history.goBack();
      return;
    }
  };

  handleClick = () => {
    this.navigate("/advanced-investing/new-fund-offers/funds/checkout");
  };

  render() {
    let { fund } = this.state;
    return (
      <Container
        showLoader={this.state.show_loader}
        noFooter={true}
        title="Fund Details"
      >
        {fund && (
          <div className="nfo-fund-detail">
            <img
              className="icon"
              alt={fund.friendly_name}
              src={fund.amc_logo_small}
            />
            {fund.nfo_recommendation && (
              <span className="recommended">RECOMMENDED</span>
            )}
            <h3>{fund.friendly_name}</h3>
            <div className="duration">
              <b>Launch: </b> {getFormattedDate(fund.start_date, true)} /{" "}
              <b>Closure: </b>
              {getFormattedDate(fund.end_date, true)}
            </div>
            <div className="tags">
              <span className="text-capitalize">
                {getSchemeOption(fund.scheme_option)}
              </span>
              {fund.tax_plan === "elss" && <span>Tax saving</span>}
            </div>
            <Button
              onClick={this.handleClick}
              buttonTitle="INVEST"
              classes={{ button: "nfo-invest-button" }}
            />
            <div className="risk">
              <div className="text">
                <b>Risk</b>
                <div className="subtitle">{fund.riskometer}</div>
              </div>
              {fund.risk_value && (
                <img
                  alt=""
                  src={require(`assets/risk_value_${fund.risk_value}.png`)}
                />
              )}
            </div>
            <p className="overview">
              <b>Overview: </b>
              {fund.overview}
            </p>
            <p className="date">
              <b>Allotment date: </b>
              {fund.allotment_date}
            </p>
            <p className="lock-in">
              <b>Lock-in: </b>
              {getFormattedDate(fund.lockin_in)}
            </p>
            <p className="load">
              <b>Exit load: </b>
              {fund.exit_load === 0 ? "Nil" : fund.exit_load}
            </p>
            <p className="disclosure">
              <b>Redemption disclosure: </b>
              {fund.redemption_disclosure}
            </p>
            <p className="more">
              <b>Read more: </b>{" "}
              <a target="_blank" href={fund.sid_link}>
                {fund.sid_link}
              </a>
            </p>
          </div>
        )}
      </Container>
    );
  }
}

export default FundDetail;
