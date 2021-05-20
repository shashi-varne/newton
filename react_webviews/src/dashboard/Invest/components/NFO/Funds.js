import React, { Component } from "react";
import Container from "../../../common/Container";
import Button from "common/ui/Button";
import { navigate } from "../../functions";
import {
  getFormattedDate,
  getNfoRecommendation,
  getSchemeOption,
} from "./nfoFunctions";
import { storageService } from "utils/validators";
import { getConfig } from "../../../../utils/functions";
import toast from "../../../../common/ui/Toast";
import { isEmpty } from "../../../../utils/validators";
import "./Funds.scss";

class NfoFunds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screenName: "nfo_funds",
      showFunds: false,
    };
    this.navigate = navigate.bind(this);
  }

  componentDidMount() {
    let scheme = this.props.match.params.scheme || "";
    let availableSchemes = ["growth", "dividend"];
    if (!scheme || !availableSchemes.includes(scheme)) {
      this.props.history.goBack();
      return;
    }
    this.setState({ scheme: scheme });
    this.onload(scheme);
  }

  onload = async (scheme) => {
    this.setState({ show_loader: true });
    const errorMessage = "Something went wrong!";
    try {
      const result = await getNfoRecommendation();
      if (!result) return;
      storageService().remove("nfo_cart");
      storageService().remove("nfo_cartCount");
      let filteredByScheme =
        result.recommendations.filter((item) => {
          return item.growth_or_dividend === scheme;
        }) || [];
      const fundList =
        filteredByScheme.map((dict) => {
          dict["addedToCart"] = false;
          dict["allow_purchase"] = true;
          return dict;
        }) || [];
      storageService().setObject("nfo_fundsList", fundList);
      this.setState({
        show_loader: false,
        nfoFunds: fundList,
      });
    } catch (error) {
      console.log(error);
      this.setState({ show_loader: false });
      toast(error.message || errorMessage);
    }
  };

  handleClick = (fund) => () => {
    storageService().setObject("nfo_detail_fund", fund);
    this.navigate("/advanced-investing/new-fund-offers/funds/checkout");
  };

  detailView = (fund) => {
    storageService().setObject("nfo_detail_fund", fund);
    this.props.history.push(
      {
        pathname: `/advanced-investing/new-fund-offers/fund`,
        search: getConfig().searchParams,
      },
      {
        mfid: fund.mfid,
      }
    );
  };

  render() {
    let { nfoFunds } = this.state;
    return (
      <Container
        data-aid='nfo-funds-screen'
        skelton={this.state.show_loader}
        noFooter={true}
        title="NFO Funds"
      >
        <div className="nfo-funds" data-aid='nfo-funds-page'>
          {isEmpty(nfoFunds) && (
            <div className="message" data-aid='nfo-message'>
              We are sorry ! There are no funds that match your requirements.
            </div>
          )}
          {!isEmpty(nfoFunds) &&
            nfoFunds.map((data, index) => {
              return (
                <div key={index} className="content" data-aid='nfo-content'>
                  <div
                    data-aid='nfo-detailview-img'
                    className="card icon"
                    onClick={() => this.detailView(data)}
                  >
                    <img alt={data.friendly_name} src={data.amc_logo_small} />
                  </div>
                  <div className="text" data-aid='nfo-text'>
                    <div
                      data-aid='nfo-detailview-text'
                      className="title"
                      onClick={() => this.detailView(data)}
                    >
                      {data.friendly_name}
                    </div>
                    <div className="item" data-aid='nfo-item'>
                      <div className="sub-item" data-aid='sub-item'>
                        <p>Type: {getSchemeOption(data.scheme_option)}</p>
                        <p>Category: {data.tax_plan}</p>
                      </div>
                      <div className="invest" data-aid='nfo-invest'>
                        <Button
                          dataAid='invest-btn'
                          onClick={this.handleClick(data)}
                          buttonTitle="INVEST"
                          classes={{ button: "nfo-funds-button" }}
                        />
                      </div>
                    </div>
                    <div className="date" data-aid='nfo-date'>
                      from {getFormattedDate(data.start_date)} - to{" "}
                      {getFormattedDate(data.end_date, true)}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </Container>
    );
  }
}

export default NfoFunds;
