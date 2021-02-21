import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import { formatAmountInr } from "../../../utils/validators";
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import Agreement from './agreement';
import scrollIntoView from 'scroll-into-view-if-needed';


class LoanSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      get_lead: true,
      fetch_all: true,
      confirm_details_check: false,
      isScrolledToBottom: false,
      vendor_info: {},
      application_info: {},
      personal_info: {},
      address_info: {},
      bank_info: {},
      current_address_data: {}
    }

    this.agreeRef = React.createRef();
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead;
    let vendor_info = lead.vendor_info || {};

    let dmi_loan_status = vendor_info.dmi_loan_status || '';
    if (dmi_loan_status === 'callback_awaited_disbursement_approval') {
      this.navigate('loan-approved');
      return;
    }
    let personal_info = lead.personal_info || {};
    let application_info = lead.application_info || {};
    let address_info = lead.address_info || {};
    let bank_info = lead.bank_info || {};

    let currentDate = new Date().toISOString().slice(0, 10);
    currentDate = currentDate.replace(/\\-/g, '/').split('-').reverse().join('/');
    this.setState({
      vendor_info: vendor_info,
      personal_info: personal_info,
      application_info: application_info,
      address_info: address_info,
      bank_info: bank_info,
      current_address_data: lead.current_address_data || {},
      currentDate: currentDate
    })

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'agreement',
        "agreement_agreed": this.state.confirm_details_check
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  triggerOtp = async () => {
    try {

      let res = await Api.get(`/relay/api/loan/trigger_otp/application/${this.state.application_id}`);

      var result = res.pfwresponse.result;
      if (res.pfwresponse.status_code === 200 && !result.error) {
        if (result.resend_otp_url !== '' && result.verify_otp_url !== '') {

          var message = 'An OTP is sent to your mobile number ' + result.mobile_no + '.  Enter OTP to verify and complete loan application.'
          this.props.history.push({
            pathname: 'form-otp',
            search: getConfig().searchParams,
            params: {
              resend_link: result.resend_otp_url,
              verify_link: result.verify_otp_url,
              message: message,
              mobile_no: result.mobile_no,
              next_state: 'loan-approved',
              from_state: 'loan-summary'
            }
          });
          toast(message);
        }

      } else {
        this.setState({
          show_loader: false
        });
        toast(result.error || result.message
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

  handleClick = async () => {
    this.sendEvents('next');


    if (!this.state.confirm_details_check) {
      this.handleScroll();
      toast('It is mandatory to read and accept the agreement for availing a loan.');
      return;
    }

    if (!this.state.isScrolledToBottom) {
      toast('Please scroll down and read the entire agreement.');
      return;
    }

    this.setState({
      show_loader: true
    })

    this.triggerOtp();

  }

  handleChange = name => event => {
    if (!name) {
      name = event.target.name;
    }

    if(event.target.checked && !this.state.isScrolledToBottom) {
      toast('Please scroll down and read the entire agreement.');
      return;
    }

    this.setState({
      [name]: event.target.checked
    })
  };

  onScroll = (e) => {
    const element = e.target;
    let isScrolled = element.scrollHeight - element.clientHeight <= element.scrollTop + 1;
    if (!this.state.isScrolledToBottom) {
      this.setState({
        isScrolledToBottom: isScrolled
      })
    }
  };

  handleScroll = () => {
    setTimeout(function () {
      let element = document.getElementById('agreeScroll');
      if (!element || element === null) {
        return;
      }

      scrollIntoView(element, {
        block: 'start',
        inline: 'nearest',
        behavior: 'smooth'
      })

    }, 50);
  }

  render() {

    let vendor_info = this.state.vendor_info || {};

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Loan summary"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="GET LOAN"
        // disable={!this.state.confirm_details_check}
        classOverRide={'loanMainContainer'}
        headerData={{
          icon: 'close'
        }}
      >
        <div className="loan-summary">
          <div className="container">
            <div style={{ padding: '20px 20px 29px 20px' }}>
              <div className="head" style={{ paddingBottom: '22px' }}>Loan details</div>
              <div className="items">
                <div>Sanctioned Loan Amount</div>
                <div>{formatAmountInr(vendor_info.approved_amount_final)}</div>
              </div>
              <div className="items">
                <div>Processing fee</div>
                <div>{'- ' + formatAmountInr(vendor_info.processing_fee_final)}</div>
              </div>
              <div className="items">
                <div>GST(18%)</div>
                <div>{'- ' + formatAmountInr(vendor_info.gst_final)}</div>
              </div>
              <hr style={{ background: "#ccd3db" }} />
              <div className="credit">
                <div>Amount credited to bank a/c</div>
                <div>{formatAmountInr(vendor_info.net_amount_final)}</div>
              </div>
            </div>
          </div>

          <div className="emi-detail">
            <div className="head">EMI detail</div>
            <div style={{ fontSize: '13px' }}>
              {formatAmountInr(vendor_info.approved_emi)}/month for {vendor_info.tenor} months
              </div>
          </div>

          <div className='head' style={{ paddingBottom: '20px' }}>
            Loan agreement
            </div>

          <div className="agreement-block" onScroll={this.onScroll}>
            <Agreement parent={this} vendor_info={vendor_info} />
          </div>

          <Grid id="agreeScroll" ref={this.agreeRef} container spacing={16} alignItems="center">
            <Grid item xs={1} className="TextCenter">
              <Checkbox
                defaultChecked
                // disabled={!this.state.isScrolledToBottom}
                checked={this.state.confirm_details_check}
                color="primary"
                value="confirm_details_check"
                name="confirm_details_check"
                onChange={this.handleChange()}
                className="Checkbox" />
            </Grid>
            <Grid item xs={11}>
              <label>I have read the agreement carefully.</label>
            </Grid>
          </Grid>

        </div>
      </Container>
    );
  }
}

export default LoanSummary;
