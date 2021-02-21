import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import SliderWithValues from "../../../common/ui/SilderWithValues"
import "../Style.scss";
import { inrFormatDecimal } from "../../../utils/validators";
// import Button from '../../../common/ui/Button';
import { getConfig} from 'utils/functions';

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      Net_monthly_Income: 75000,
      Tenor: 18,
      Other_EMIs: 0,
      Monthly_expenses: 30000
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let { params } = this.props.location;
    if(!params) {
      params = {};
    }

    if(!params.next_state) {
      this.navigate('home');
    }

    this.setState({
      next_state: params.next_state,
      cta_title: params.cta_title,
      rejection_reason: params.rejection_reason
    })

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'calculator',
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

      let state = this.state.next_state;
      let rejection_reason = this.state.rejection_reason;

      if(state === 'instant-kyc-status') {
        let searchParams = getConfig().searchParams + '&status=loan_not_eligible';
        this.navigate(state, {
          searchParams: searchParams,
          params: {
            rejection_reason: rejection_reason
          }
        });

      } else {
        this.navigate(state);
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
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle={this.state.cta_title || "APPLY NOW"}
        // noFooter={true}
        classOverRide={'loanMainContainer'}
      >
        <div className="loan-calculator">
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
