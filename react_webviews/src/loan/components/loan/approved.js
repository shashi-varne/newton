import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import Contact from 'common/components/contact_us';
import { getConfig } from 'utils/functions';

class LoanApprvoed extends Component {
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
        title="Loan Approved"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="CONTINUE"
      >
        <div className="loan-approved">
          <img
            src={ require(`assets/${this.state.productName}/ils_loan_approve.svg`)}
            style={{marginTop: '20px', width:"100%"}}
            alt="" 
          />
          
          <div className="content">
            Your application no <b>xxxxxx78</b> for Personal loan of <b>₹2,00,000</b> has been submitted and is under process.
          </div>

          <div className="content">
            Upon DMI Finance completing due diligence, <b>you will receive the confirmation SMS from Fisdom and DMI Finance</b> in next 2 hours on your registered Mobile number. 
          </div>

          <div className="content">
            Terms and Conditions accepted by you shall be emailed to your registered email id. Thank You.
          </div>

          <Contact />
        </div>
      </Container>
    );
  }
}

export default LoanApprvoed;
