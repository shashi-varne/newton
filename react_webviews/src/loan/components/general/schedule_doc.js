import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import Contact from 'common/components/contact_us';
import "../Style.scss";
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';

class ScheduleDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      message: ''
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  getPaymentSchedule = async () => {
    try {
      let res = await Api.get(`/relay/api/loan/dmi/schedule/get/${this.state.application_id}`);

      let resultData  = res.pfwresponse.result;

      this.setState({
        show_loader: false
      });

      if (res.pfwresponse.status_code === 200 && !resultData.error) {
        this.setState({
          message: resultData.message
        })

      } else {
        toast(resultData.error || resultData.message
          || 'Something went wrong');
      }

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong')
    }
  }

  onload = () => {
    this.getPaymentSchedule();
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'schedule doc'
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
        classOverRide={'loanMainContainer'}
      >
        <div className="loan-schedule-doc">
          <img
            src={ require(`assets/${this.state.productName}/ils_loan_email.svg`)}
            style={{marginTop: '40px', width:"100%"}}
            alt="" 
          />
          <div className="loan-schedule">
            {this.state.message}
          </div>
          <Contact />
        </div>
      </Container>
    );
  }
}

export default ScheduleDoc;
