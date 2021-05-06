/* eslint-disable radix */
import React, { Component } from "react";
import Container from "../../common/Container";
import Input from "../../../common/ui/Input";
import { initialize } from "../common/commonFunctions";
import { formatAmountInr, storageService, formatAmount } from "utils/validators";

class EnterAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: "50000",
      taxsaved: "15450",
      show_loader: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  handleChange = name => (event) => {
    let value = (name === "custom-amt") ? event.target.id : event.target.value;

    if (name === 'amount') {
      let amt = (value.match(/\d+/g) || "").toString();
      if (amt) {
        value = amt.replaceAll(",", "");
      } else {
        value = amt;
      }
    }

    let taxSaved = Math.min(value * 0.309, 61800);

    this.setState({
      amount: value,
      amount_error: value < parseInt(500) ? "Minimum amount is ₹500" : value > parseInt(500000) ? "Maximum amount is ₹500000" : "",
      taxsaved: taxSaved,
    });
  };

  handleClick = async () => {
    let { amount } = this.state;

    if (amount) {
      storageService().set('npsAmount', amount);
      let res = await this.get_recommended_funds(amount);

      if (res) {
        this.navigate('recommendation/one-time', {amount: this.state.amount})
      }
    }
  };

  render() {
    return (
      <Container
        buttonTitle="SHOW FUNDS"
        showLoader={this.state.show_loader}
        title="Enter Amount"
        handleClick={this.handleClick}
        disable={this.state.amount < 500 || this.state.amount > 500000}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="enter-amount">
          <section className="page nps">
            <div className="container-padding">
              <div className="nps-card">
                <div className="inner-container">
                  <div className="title">Enter amount to invest in NPS</div>
                  <Input
                    error={!!this.state.amount_error}
                    helperText={this.state.amount_error}
                    width="40"
                    id="amount"
                    name="amount"
                    inputMode="numeric"
                    value={this.state.amount ? `₹ ${formatAmount(this.state.amount)}` : ""}
                    onChange={this.handleChange("amount")}
                  />
                </div>
                <div className="help-text">
                  Save tax upto:{" "}
                  <span style={{ fontWeight: 500 }}>
                    {formatAmountInr(this.state.taxsaved || "0")}
                  </span>
                </div>

                <div className="tags">
                  <div className="tag-container">
                    {[...Array(3)].map((value = 20000, index) => (
                      <div
                        key={index}
                        id={value + (index * 10000)}
                        onClick={this.handleChange("custom-amt")}
                        className="tag"
                      >
                        {formatAmountInr(value + (index * 10000))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="page-footer"></div>
          </section>
        </div>
      </Container>
    );
  }
}

export default EnterAmount;
