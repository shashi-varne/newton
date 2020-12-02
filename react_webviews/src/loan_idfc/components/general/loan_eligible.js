import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import {  formatAmountInr } from "../../../utils/validators";
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';

class LoanEligible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      get_lead: true,
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead || {};
    let application_info = lead.application_info || {};
    let vendor_info = lead.vendor_info || {};

    this.setState({
      vendor_info: vendor_info,
      application_info: application_info
    })

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'loan eligibility',
        "stage": 'eligible'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  triggerConversion= async () => {

    this.setState({
      show_loader: true
    });
    try {

      let res = await Api.get(`/relay/api/loan/dmi/accept_offer/${this.state.application_id}`);

      var resultData = res.pfwresponse.result;
      if (res.pfwresponse.status_code === 200 && !resultData.error) {
        this.navigate('journey');

      } else {
        this.setState({
          show_loader: false
        });
        toast(resultData.error || resultData.message
          || 'Something went wrong');
      }
    } catch (err) {
      console.log(err)
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }


  handleClick = () => {
    this.sendEvents('next');
    this.triggerConversion();
  }

  render() {

    let vendor_info = this.state.vendor_info || {};
    return (
      <Container
        showLoader={this.state.show_loader}
        title=''
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="CONTINUE"
        hidePageTitle={true}
        headerData={{
          icon: 'close'
        }}
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
            {formatAmountInr(vendor_info.approved_amount_decision)}
          </div>

          <div className="loan-value">
            <div>
              <div>EMI amount</div>
              <div className="values">{formatAmountInr(vendor_info.approved_emi)}</div>
            </div>
            <div>
              <div>Tenure</div>
              <div className="values">{vendor_info.tenor} months</div>
            </div>
            <div>
              <div>Rate of interest</div>
                <div className="values">{vendor_info.loan_rate}%</div>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default LoanEligible;
