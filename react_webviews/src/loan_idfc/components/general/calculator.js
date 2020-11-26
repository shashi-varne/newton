import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import SliderWithValues from "../../../common/ui/SilderWithValues"
import { inrFormatDecimal } from "../../../utils/validators";

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      Net_monthly_Income: 75000,
      Tenor: 18,
      Other_EMIs: 0,
      Monthly_expenses: 30000,
      screen_name: "calculator"
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let { params } = this.props.location;

    if (!params) {
      this.navigate('home')
      return
    }

    this.setState({
      ...params
    })
  }

  onload = async () => {};

  handleClick = () => {
    this.navigate(this.state.next_state)
  };

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "know_more",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  onChange = (val, key) => {
    this.setState({[key]: val})
  }

  render() {
    const {
        Net_monthly_Income,
        Tenor,
        Other_EMIs,
        Monthly_expenses
      } = this.state;
  
      let Loan_Eligibility = (Net_monthly_Income - Other_EMIs - Monthly_expenses) * 40/100 * Tenor;
  
      if(Net_monthly_Income < 30000) {
        Loan_Eligibility = 0;
      } else if(Loan_Eligibility > 100000) {
        Loan_Eligibility = 100000;
      } else if(Loan_Eligibility <=0) {
        Loan_Eligibility = 0;
      }

      return (
      <Container
        showLoader={this.state.show_loader}
        title="Loan eligibility calculator"
        buttonTitle={this.state.cta_title}
        styleFooter={{
          backgroundColor: "var(--highlight)"
        }}
        styleContainer={{
          backgroundColor: "var(--highlight)"
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
            label="Loan tenor"
            val="Tenor"
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
              { inrFormatDecimal(Loan_Eligibility)}
            </div>
          </div>

          
        </div>

      </Container>
    );
  }
}

export default Calculator;
