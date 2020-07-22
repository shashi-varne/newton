import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import Items from "./items";
import "../Style.scss"
import { formatAmount } from "../../../utils/validators";
import Button from '../../../common/ui/Button';

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
  }

  onChange = (val, name) => {
    if(name === "Net monthly income")
      this.setState({Net_monthly_Income: val})
    else if(name === "Loan tenor")
      this.setState({Tenor: val})
    else if(name === "Other EMIs")
      this.setState({Other_EMIs: val})
    else if(name === "Monthly expenses")
      this.setState({Monthly_expenses: val})
  }

  render() {
    const {
      Net_monthly_Income,
      Tenor,
      Other_EMIs,
      Monthly_expenses
    } = this.state;

    const Loan_Eligibility = (Net_monthly_Income + Other_EMIs + Monthly_expenses) * 40/100 * Tenor;

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Loan eligibility calculator"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="APPLY NOW"
        noFooter={true}
      >
        <div className="loan-calculator">
          {/* {code goes here} */}
          <Items 
            name="Net monthly income"
            value={Net_monthly_Income}
            min="0"
            max="2500000"
            minValue="0"
            maxValue="₹ 25 Lacs"
            onChange={this.onChange}
          />

          <Items
            name="Loan tenor"
            value={Tenor}
            min="3"
            max="24"
            minValue="3 MONTHS"
            maxValue="24 MONTHS"
            onChange={this.onChange}
          />

          <Items
            name="Other EMIs"
            value={Other_EMIs}
            min="0"
            max="2500000"
            minValue="0"
            maxValue="₹ 25 Lacs"
            onChange={this.onChange}
          />

          <Items
            name="Monthly expenses"
            value={Monthly_expenses}
            min="0"
            max="2500000"
            minValue="0"
            maxValue="₹ 25 Lacs"
            onChange={this.onChange}
          />

          <div className="total-amount">
            <div>You are elgible for upto</div>
            <div className="total">
              {'₹ ' + formatAmount(Loan_Eligibility)}
            </div>
            <Button 
              type="default"
              buttonTitle="APPLY NOW"
            />
          </div>

          
        </div>
      </Container>
    );
  }
}

export default Calculator;
