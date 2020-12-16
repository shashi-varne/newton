/* eslint-disable */
import React, { Component } from "react";
import Container from "./common/container";
import { initialize } from "./common/functions";
import SliderWithValues from "../common/ui/SilderWithValues";
import { inrFormatDecimal } from "../utils/validators";

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      Net_monthly_Income: 90000,
      Tenor: 5,
      Other_EMIs: 10000,
      Monthly_expenses: 30000,
      screen_name: "calculator",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  handleClick = () => {};

  onChange = (val, key) => {
    this.setState({ [key]: val });
  };

  render() {
    const {
      Net_monthly_Income,
      Tenor,
      Other_EMIs,
      Monthly_expenses,
    } = this.state;

    let Loan_Eligibility =
      (((Net_monthly_Income - Other_EMIs - Monthly_expenses) * 40) / 100) *
      Tenor;

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Loan eligibility calculator"
        buttonTitle="APPLY NOW"
        styleFooter={{
          backgroundColor: "var(--highlight)",
        }}
        styleContainer={{
          backgroundColor: "var(--highlight)",
        }}
        noPadding={true}
        handleClick={this.handleClick}
      >
        <div className="idfc-loan-calculator">
          <SliderWithValues
            label="Net monthly income"
            val="Net_monthly_Income"
            value={Net_monthly_Income}
            min="0"
            max="2500000"
            minValue="0"
            maxValue="₹ 25 Lacs"
            onChange={this.onChange}
          />

          <SliderWithValues
            label="Loan tenor"
            val="Tenor"
            value={Tenor}
            min="3"
            max="24"
            minValue="3 MONTHS"
            maxValue="24 MONTHS"
            onChange={this.onChange}
          />

          <SliderWithValues
            label="Other EMIs"
            val="Other_EMIs"
            value={Other_EMIs}
            min="0"
            max="2500000"
            minValue="0"
            maxValue="₹ 25 Lacs"
            onChange={this.onChange}
          />

          <SliderWithValues
            label="Monthly expenses"
            val="Monthly_expenses"
            value={Monthly_expenses}
            min="0"
            max="2500000"
            minValue="0"
            maxValue="₹ 25 Lacs"
            onChange={this.onChange}
          />

          <div className="total-amount">
            <div>You are eligible for loan upto</div>
            <div className="total">
              {inrFormatDecimal(
                parseInt(Loan_Eligibility) < parseInt("100000")
                  ? "0"
                  : Loan_Eligibility
              )}
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Calculator;
