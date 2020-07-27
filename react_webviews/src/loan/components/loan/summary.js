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

class LoanSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      get_lead: true,
      getLeadBodyKeys: ['vendor_info'],
      confirm_details_check: true,
      isScrolledToBottom: false
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

  triggerOtp = async () => {
    try {

      let res = await Api.get(`/relay/api/loan/trigger_otp/application/${this.state.application_id}`);

      var result = res.pfwresponse.result;
      if (res.pfwresponse.status_code === 200 && !result.error) {
        if (result.resend_otp_url !== '' && result.verify_otp_url !== '') {

          var message = 'An OTP is sent to your mobile number ' + result.mobile_no + ',  Enter OTP to verify and complete loan application.'
          this.props.history.push({
            pathname: 'form-otp',
            search: getConfig().searchParams,
            params: {
              resend_link: result.resend_otp_url,
              verify_link: result.verify_otp_url,
              message: message,
              mobile_no: result.mobile_no,
              next_state: 'instant-kyc',
              from_state: 'loan-approved'
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

    this.setState({
      show_loader: true
    })

    try {

      let res = await Api.get(`/relay/api/loan/dmi/agreement/accept/${this.state.application_id}`);

      var resultData = res.pfwresponse.result;
      if (res.pfwresponse.status_code === 200 && !resultData.error) {
        this.triggerOtp();

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

  handleChange = name => event => {
    if (!name) {
      name = event.target.name;
    }

    this.setState({
      [name]: event.target.checked
    })
  };

  onScroll = (e) => {
    const element = e.target;
    let isScrolled = element.scrollHeight - element.clientHeight <= element.scrollTop + 1;
    if (!this.state.form_submitted) {
        this.setState({
            isScrolledToBottom: isScrolled
        })
    }
  };

  render() {

    let vendor_info = this.state.vendor_info || {};

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Loan summary"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="GET LOAN"
        disable={!this.state.confirm_details_check}
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
                <div>{formatAmountInr(vendor_info.sanction_amount)}</div>
              </div>
              <div className="items">
                <div>Processing fee</div>
                <div>{'- ' + formatAmountInr(vendor_info.processing_fee)}</div>
              </div>
              <div className="items">
                <div>GST(18%)</div>
                <div>{'- ' + formatAmountInr(vendor_info.gst)}</div>
              </div>
              <hr style={{ background: "#ccd3db" }} />
              <div className="credit">
                <div>Amount credited to bank a/c</div>
                <div>{formatAmountInr(vendor_info.net_amount)}</div>
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
            <Agreement />
          </div>

          <Grid container spacing={16} alignItems="center">
            <Grid item xs={1} className="TextCenter">
              <Checkbox
                disabled={!this.state.isScrolledToBottom}
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
