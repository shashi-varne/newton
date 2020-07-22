import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import ils_loan_email from 'assets/myway/ils_loan_email.svg';
import "../Style.scss";

class ScheduleDoc extends Component {
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
        title="Loan schedule document"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="CONTINUE"
        noFooter={true}
      >
        <div className="loan-schedule-doc">
          {/* {code goes here} */}
          <img style={{marginTop: '40px'}} src={ils_loan_email} alt="" />
          <div className="loan-schedule">
            Loan schedule document has been sent <br />
            to your registered email ID <br />
            ........swan@gmail.com
          </div>
          <div className="query">
            For any query, reach us at
          </div>
          <div className="contact">
            <span style={{marginRight:'40px'}}>+80-30-408363</span>
            |
            <span style={{marginLeft:'40px'}}>ask@fisdom.com</span>
          </div>
        </div>
      </Container>
    );
  }
}

export default ScheduleDoc;
