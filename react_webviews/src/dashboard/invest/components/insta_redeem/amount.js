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
import { convertInrAmountToNumber, getGoalRecommendation } from "../../common/commonFunction";
import { storageService } from "../../../../utils/validators";

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
    this.setState({ show_loader: true});
    let instaRecommendations = storageService().getObject(
      "instaRecommendations"
    )[0];
    let { amount, investType, term } = this.state;
    let allocations = [{ amount: amount, mf: instaRecommendations }];
    let recommendations = {
      recommendation: allocations,
      term: term,
      investType: "insta-redeem",
      name: "Insta Redeem",
      investTypeDisplay: investType,
      bondstock: "",
      // eslint-disable-next-line
      recommendedTotalAmount: parseInt(amount),
      type: "insta-redeem",
      order_type: investType,
      subtype: "",
    };
    storageService().setObject("funnelData", recommendations);
    this.navigate(`/invest/recommendations`);
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

  validateAmount = (amount) => {
    let goal = getGoalRecommendation();
    let max = 0;
    let min = 0;
    if (this.state.investType === "sip") {
      max = goal.max_sip_amount;
      min = goal.min_sip_amount;
    } else {
      max = goal.max_ot_amount;
      min = goal.min_ot_amount;
    }
    let { amount_error } = this.state;
    if (amount > max) {
      amount_error =
        "Investment amount cannot be more than " + formatAmountInr(max);
    } else if (amount < min) {
      amount_error = "Minimum amount should be atleast " + formatAmountInr(min);
    } else {
      amount_error = "";
    }
    this.setState({ amount_error: amount_error });
  };
  
  render() {
    let { investType, amount, amount_error, tags } = this.state;
    return (
      <Container
        showLoader={this.state.show_loader}
        buttonTitle="CONTINUE"
        handleClick={this.handleClick}
        disable={amount_error ? true : false}
        title="How would you like to invest?"
        count="2"
        current="2"
        total="2"
      >
        <div className="insta-redeem-invest-amount">
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
