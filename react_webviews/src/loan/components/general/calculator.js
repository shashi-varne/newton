import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import SliderWithValues from "../../../common/ui/SilderWithValues"
import "../Style.scss";
import { formatAmountInr } from "../../../utils/validators";
// import Button from '../../../common/ui/Button';

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      Net_monthly_Income: 90000,
      Tenor: 3,
      Other_EMIs: 10000,
      Monthly_expenses: 30000
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    // ****************************************************
    // code goes here
    // common things can be added inside initialize
    // use/add common functions from/to  ../../common/functions

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'introduction'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
      this.sendEvents('next');
      this.navigate('home');
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
    if(Loan_Eligibility <=0 || Loan_Eligibility > 100000) {
      Loan_Eligibility = 100000;
    }
   

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Loan eligibility calculator"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="APPLY NOW"
        // noFooter={true}
      >
        <div className="loan-calculator">
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
              { formatAmountInr(Loan_Eligibility)}
            </div>
            {/* <Button 
              type="default"
              buttonTitle="APPLY NOW"
            /> */}
          </div>

          
        </div>
      </Container>
    );
  }
}

export default Calculator;
