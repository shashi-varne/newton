/* eslint-disable */
import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import SliderWithValues from "../../../common/ui/SilderWithValues";
import { inrFormatDecimal } from "../../../utils/validators";

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
      cta_title: 'APPLY NOW'
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    let { loans_applied, dmi, idfc } = this.state;

    this.setState({
      cta_title: (loans_applied > 0 && (dmi || idfc)) ? "RESUME" : "APPLY NOW"
    })
  };

  handleClick = () => {
    this.sendEvents("next");
    let { cta_title } = this.state;
    
    if (cta_title === "RESUME") {
      this.navigate('select-loan');
    } else {
      this.navigate('edit-details');
    }
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "eligibility_calculator",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

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
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        title="Loan eligibility calculator"
        buttonTitle={this.state.cta_title}
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
            max="1000000"
            minValue="0"
            maxValue="₹ 10 Lacs"
            onChange={this.onChange}
          />

          <SliderWithValues
            label="Loan tenure"
            val="Tenure"
            value={Tenor}
            min="6"
            max="24"
            minValue="6 MONTHS"
            maxValue="24 MONTHS"
            onChange={this.onChange}
          />

          <SliderWithValues
            label="Other EMIs"
            val="Other_EMIs"
            value={Other_EMIs}
            min="0"
            max="500000"
            minValue="0"
            maxValue="₹ 5 Lacs"
            onChange={this.onChange}
          />

          <SliderWithValues
            label="Monthly expenses"
            val="Monthly_expenses"
            value={Monthly_expenses}
            min="0"
            max="1000000"
            minValue="0"
            maxValue="₹ 10 Lacs"
            onChange={this.onChange}
          />

          <div className="total-amount">
            <div>You are eligible for loan upto</div>
            <div className="total">
              {inrFormatDecimal(Math.max(parseInt(Loan_Eligibility), 0))}
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Calculator;
