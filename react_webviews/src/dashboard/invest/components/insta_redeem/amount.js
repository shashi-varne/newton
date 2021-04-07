import React, { Component } from "react";
import Container from "../../../common/Container";
import { getConfig } from "utils/functions";
import { initialize } from "../../functions";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import { formatAmountInr } from "utils/validators";
import { investRedeemData } from "../../constants";
import { convertInrAmountToNumber } from "../../common/commonFunction";

class InvestAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      screenName: "insta_redeem_invest_type",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let investType = this.props.match.params.investType || "";
    let tags = investRedeemData.tagsMapper[investType];
    let amount = 50000;
    if (investType === "sip") amount = 5000;
    this.setState({
      tags: tags,
      amount: amount,
      investType: investType,
      stockReturns: 15,
      bondReturns: 8,
      term: 15,
    });
  };

  handleClick = () => {
    this.getRecommendation();
  };

  handleChange = () => (event) => {
    let value = event.target.value;
    value = convertInrAmountToNumber(value);
    let { amount_error, amount } = this.state;
    // eslint-disable-next-line
    if (!isNaN(parseInt(value))) {
      // eslint-disable-next-line
      amount = parseInt(value);
      this.validateAmount(amount);
      this.setState({ amount: amount });
    } else {
      amount_error = "This is required";
      amount = "";
      this.setState({ amount: amount, amount_error: amount_error });
    }
  };

  updateAmount = (value) => {
    let { amount } = this.state;
    if (!amount) amount = value;
    else amount += value;
    this.validateAmount(amount);
    this.setState({ amount: amount });
  };

  render() {
    let { investType, amount, amount_error, tags } = this.state;
    return (
      <Container
        showLoader={this.state.show_loader}
        buttonTitle="CONTINUE"
        handleClick={this.handleClick}
        disable={amount_error ? true : false}
        hidePageTitle
      >
        <div className="insta-redeem-invest-amount">
          <div className="invest-header">
            <div className="main-top-title">How would you like to invest?</div>
            <div className="step">
              <span className="count">2</span>
              <span className="total">/2</span>
            </div>
          </div>
          <FormControl className="form-field">
            <InputLabel htmlFor="standard-adornment-password">
              Enter amount
            </InputLabel>
            <Input
              id="amount"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={amount ? formatAmountInr(amount) : ""}
              error={amount_error ? true : false}
              onChange={this.handleChange("amount")}
              autoFocus
              endAdornment={
                investType === "sip" && (
                  <InputAdornment position="end">per month</InputAdornment>
                )
              }
            />
            {amount_error && (
              <div
                className="helper-text"
                style={{
                  color: amount_error && "red",
                }}
              >
                {amount_error}
              </div>
            )}
          </FormControl>
          <div className="tags">
            {tags &&
              tags.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="tag"
                    onClick={() => this.updateAmount(data.value)}
                  >
                    +{data.name}
                  </div>
                );
              })}
          </div>
        </div>
      </Container>
    );
  }
}

export default InvestAmount;
