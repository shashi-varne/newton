import React, { Component } from "react";
import Container from "../../../common/Container";
import Button from "@material-ui/core/Button";
import {
  initialize,
  getFormattedEndDate,
  getFormattedStartDate,
  getSchemeOption,
} from "../../functions";
import { storageService } from "utils/validators";

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

  handleClick = (fund) => () => {
    storageService().setObject("nfo_detail_fund", fund);
    this.navigate("/advanced-investing/new-fund-offers/funds/checkout")
  };

  render() {
    let { nfoFunds, showFunds } = this.state;
    return (
      <Container
        showLoader={this.state.show_loader}
        noFooter={true}
        hideInPageTitle
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
