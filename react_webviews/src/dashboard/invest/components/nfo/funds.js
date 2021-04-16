import React, { Component } from "react";
import Container from "../../../common/Container";
import Button from "@material-ui/core/Button";
import { initialize } from "../../functions";
import {
  getFormattedEndDate,
  getFormattedStartDate,
  getSchemeOption,
} from "./nfoFunctions";
import { storageService } from "utils/validators";
import { getConfig } from "../../../../utils/functions";
import toast from "../../../../common/ui/Toast";
import Api from "../../../../utils/api";
import { apiConstants } from "../../constants";

class NfoFunds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screenName: "nfo_funds",
      showFunds: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
    let scheme = this.props.match.params.scheme || "";
    let availableSchemes = ["growth", "dividend"];
    if (!scheme || !availableSchemes.includes(scheme)) {
      this.props.history.goBack();
      return;
    }
    this.setState({ scheme: scheme });
  }

  onload = () => {
    this.getNfoRecommendation();
  };

  getNfoRecommendation = async () => {
    this.setState({ show_loader: true });
    const errorMessage = "Something went wrong!";
    try {
      const res = await Api.get(apiConstants.getNfoRecommendation);
      const { result, status_code: status } = res.pfwresponse;
      if (status === 200) {
        storageService().remove("nfo_cart");
        storageService().remove("nfo_cartCount");
        let sortedArray = result.recommendations.filter((item) => {
          return item.growth_or_dividend === this.state.scheme;
        });
        var newArray = sortedArray.map((dict) => {
          dict["addedToCart"] = false;
          dict["allow_purchase"] = true;
          return dict;
        });
        storageService().setObject("nfo_fundsList", newArray);
        let nfoFunds = newArray;
        let cartCount = 0;
        let showFunds = nfoFunds.length > 0;
        this.setState({
          show_loader: false,
          nfoFunds: nfoFunds,
          cartCount: cartCount,
          showFunds: showFunds,
        });
      } else {
        this.setState({ show_loader: false });
        toast(result.message || result.error || errorMessage);
      }
    } catch (error) {
      console.log(error);
      this.setState({ show_loader: false });
      toast(errorMessage);
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
    let { nfoFunds, showFunds } = this.state;
    return (
      <Container
        skelton={this.state.show_loader}
        noFooter={true}
        title="NFO Funds"
      >
        <div className="nfo-funds">
          {!showFunds && (
            <div className="message">
              We are sorry ! There are no funds that match your requirements.
            </div>
          )}
          {nfoFunds &&
            showFunds &&
            nfoFunds.map((data, index) => {
              return (
                <div key={index} className="content">
                  <div
                    className="card icon"
                    onClick={() => this.detailView(data)}
                  >
                    <img alt={data.friendly_name} src={data.amc_logo_small} />
                  </div>
                  <div className="text">
                    <div
                      className="title"
                      onClick={() => this.detailView(data)}
                    >
                      {data.friendly_name}
                    </div>
                    <div className="item">
                      <div className="sub-item">
                        <p>Type: {getSchemeOption(data.scheme_option)}</p>
                        <p>Category: {data.tax_plan}</p>
                      </div>
                      <div className="invest">
                        <Button onClick={this.handleClick(data)}>INVEST</Button>
                      </div>
                    </div>
                    <div className="date">
                      from {getFormattedStartDate(data.start_date)} - to{" "}
                      {getFormattedEndDate(data.end_date)}
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
