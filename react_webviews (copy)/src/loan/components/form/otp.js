import React, { Component } from 'react';
import Container from '../../common/Container';

import { nativeCallback } from 'utils/native_callback';

import Api from 'utils/api';
import OtpDefault from '../../../common/ui/otp';
import { initialize } from '../../common/functions';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
class FormOtp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      otpnumber: '',
      otpnumber_error: '',
      openResponseDialog: false,
      otpVerified: false,
      otp: '',
      timeAvailable: 30,
      totalTime: 30,
      otpBaseData: {},
      proceedForOrder: false,
      base_url: getConfig().base_url
    }

    this.initialize = initialize.bind(this);
  }

  updateParent = (key, value) => {
    this.setState({
      [key]: value
    })
  }


  componentWillMount() {
    this.initialize();

    let { params } = this.props.location;
    if(!params) {
      params = {};
    }

    if (!params || !params.resend_link || !params.verify_link) {

      this.props.history.goBack();
      return;
    }

    let otpBaseData = {
      mobile_no: params.mobile_no || ''
    }
    this.setState({
      otpBaseData: otpBaseData,
      mobile_no: params.mobile_no || '',
      resend_link: params.resend_link || '',
      verify_link: params.verify_link || '',
      next_state: params.next_state || '',
      from_state: params.from_state || '',
      // messageOtp: params.message || 'An OTP is sent to your registered mobile number, please verify to complete the process.',
    })
  }

  onload = () => {

  }



  handleClick = async () => {

    this.sendEvents('next');

    if (!this.state.otp) {
      this.setState({
        otp_error: 'Please enter OTP'
      })
      return;
    }

    if (this.state.otp.length !== 4) {
      this.setState({
        otp_error: 'OTP is a 4 digit number'
      })
      return;
    }

    try {
      this.setState({
        show_loader: true
      })

      let body = {
        otp: this.state.otp
      }
      const res = await Api.post(this.state.verify_link, body);

      if (res.pfwresponse.status_code === 200) {

        let result = res.pfwresponse.result;
        if (!result.error) {
          if(this.state.from_state === 'loan-summary') {
            this.acceptAgreement();
          } else {
            this.navigate(this.state.next_state);
          }
          
        } else {
          this.setState({
            show_loader: false,
            otpVerified: false,
          });
        }

      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }


  handleOtp = (otp) => {
    this.setState({
      otp: otp,
      otp_error: ''
    })
  }

  resendOtp = async () => {

    this.setState({
      show_loader: true,
      otp_error: '',
      otp: '',
      timeAvailable: this.state.totalTime,
      resend_otp_clicked: true
    }, () => this.sendEvents('next'))
    
    try {
      this.setState({
        show_loader: true
      });
      const res = await Api.get(this.state.resend_link);

      if (res.pfwresponse.status_code === 200) {

        let result = res.pfwresponse.result;
        if (result.resend_otp_url !== '' && result.verify_otp_url !== '') {
          var message = 'OTP sent to the mobile number ' + this.state.mobile_no + ', please verify.'
          this.setState({
            show_loader: false,
            resend_link: result.resend_otp_url,
            verify_link: result.verify_otp_url
          })
          toast(message || result.message);
        }
        this.setState({
          show_loader: false
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }

  };


  sendEvents(user_action, data={}) {

    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'otp verification',
        "resend_clicked": this.state.resend_otp_clicked ? 'yes' : 'no',
        "stage": this.state.from_state === 'loan-summary' ? 'agreement' : 'application form'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title=""
        buttonTitle="CONTINUE"
        handleClick={() => this.handleClick()}
      >
        <div className="default-otp">

          <div className="title">
           OTP Verification
                    </div>
         {this.state.from_state !== 'loan-summary' &&
          <div className="content">

            OTP has been sent by DMI Finance Pvt Ltd to your mobile number 
              {this.state.mobile_no &&
              <span className="content-auth"> {this.state.mobile_no}</span>
             }.
              <span> Enter OTP to submit the loan application.</span>

          </div>
          }

          {this.state.from_state === 'loan-summary' &&
          <div className="content">

            An OTP is sent to your mobile number
                        {this.state.mobile_no &&
              <span>
                        <span className="content-auth"> {this.state.mobile_no}</span>
              </span>}.  
              <span> Enter OTP to complete the process.</span>

          </div>
          }

          <OtpDefault parent={this} />
          {this.state.otp_error &&
            <div style={{ color: 'red', margin: '14px 0 0 0' }}>{this.state.otp_error}</div>}
        </div>
      </Container>
    );
  }
}

export default FormOtp;