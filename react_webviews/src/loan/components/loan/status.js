import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import { getConfig } from 'utils/functions';
import { formatAmount } from "../../../utils/validators";
import { formatAmountInr } from "../../../utils/validators";

class LoanStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName
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
        "screen_name": 'status'
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
        title=''
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="CONTINUE"
        hidePageTitle={true}
      >
        <div className="loan-status">
          <img
            src={ require(`assets/${this.state.productName}/ils_loan_status.svg`)}
            style={{width:"100%"}}
            alt="" 
          />

          <div className="loan-eligible">
            <b>Congratulation!</b> You are eligible for a loan of
          </div>

          <div className="loan-amount">
            {'₹ '+formatAmount(200000)}
          </div>

          <div className="loan-value">
            <div>
              <div>EMI amount</div>
              <div className="values">{'₹ '+formatAmount(33000)}</div>
            </div>
            <div>
              <div>Tenor</div>
              <div className="values">3 months</div>
            </div>
            <div>
              <div>Annual interest rate</div>
              <div className="values">24%</div>
            </div>
          </div>

          <div className="container">
            <div style={{padding:'20px 20px 19px 20px'}}>
              <div className="head" style={{paddingBottom: '22px'}}>
                Loan details
              </div>
              <div className="items">
                <div>Sanctioned Loan Amount</div>
                <div>{formatAmountInr(200000)}</div>
              </div>
              <div className="items">
                <div>Processing fee</div>
                <div>{'- '+formatAmountInr(5000)}</div>
              </div>
              <div className="items">
                <div>GST(18%)</div>
                <div>{'- '+formatAmountInr(900)}</div>
              </div>
              <hr style={{background:"#ccd3db"}} />
              <div className="credit">
                <div>Amount credited to bank a/c</div>
                <div>{formatAmountInr(198100)}</div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    );
  }
}

export default LoanStatus;
