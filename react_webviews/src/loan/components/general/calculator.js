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
      show_loader: false
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

  render() {
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
            value="90000"
            min="0"
            max="2500000"
            minValue="0"
            maxValue="₹ 25 Lacs"
          />

          <Items
            name="Loan tenor"
            value="3"
            min="3"
            max="24"
            minValue="3 MONTHS"
            maxValue="24 MONTHS"
          />

          <Items
            name="Other EMIs"
            value="10000"
            min="0"
            max="2500000"
            minValue="0"
            maxValue="₹ 25 Lacs"
          />

          <Items
            name="Monthly expenses"
            value="30000"
            min="0"
            max="2500000"
            minValue="0"
            maxValue="₹ 25 Lacs"
          />

          <div className="total-amount">
            <div>You are elgible for upto</div>
            <div className="total">
              {'₹ '+formatAmount(300000)}
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
