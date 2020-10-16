import React, { Component } from "react";
import Container from "../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../common/functions";
import { getConfig } from "utils/functions";
import OtpDefault from "../../common/ui/otp";
import Api from 'utils/api';
import { toast } from "react-toastify";
// import toast from "../../common/ui/Toast";

class WhatsappOtpVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      otpnumber: "",
      otpnumber_error: "",
      openResponseDialog: false,
      otpVerified: false,
      otp: "",
      timeAvailable: 30,
      totalTime: 30,
      otpBaseData: {},
      proceedForOrder: false,
      base_url: getConfig().base_url,
    };

    this.initialize = initialize.bind(this);
  }

  // updateParent = (key, value) => {
  //   this.state({
  //     [key]: value,
  //   });
  // };

  componentWillMount() {
    this.initialize();

    let { params } = this.props.location;
    if (!params) {
      params = {};
    }

    // if (!params || !params.resend_link || !params.verify_link) {
    //   this.props.history.goBack();
    //   return;
    // }

    let otpBaseData = {
      mobile_no: params.mobile_no || "",
    };
    this.setState({
      otpBaseData: otpBaseData,
      mobile_no: params.mobile_no || "",
      resend_link: params.resend_link || "",
      verify_link: params.verify_link || "",
      next_state: params.next_state || "",
      from_state: params.from_state || "",
      // messageOtp: params.message || 'An OTP is sent to your registered mobile number, please verify to complete the process.',
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      event_name: "whatsapp_updates",
      properties: {
        user_action: user_action,
        screen_name: "otp_screen",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleOtp = (otp) => {
    this.setState({
      otp: otp,
      otp_error: ''
    })
  }

  handleClick = async () => {
    this.setState({
      show_loader: true 
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

      // const res = await Api.get(this.state.resend_link);

      // if (res.pfwresponse.status_code === 200) {

      // }

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Enter OTP to verify"
        events={this.sendEvents("just_set_events")}
        handleClick={this.handleClick}
        buttonTitle="CONFIRM"
      >
        <div
          style={{color: "#8D879B", marginBottom: "20px" }}
          className="content"
        >
          Please enter the OTP sent to +916262626262.
        </div>

        <OtpDefault parent={this} />
      </Container>
    );
  }
}

export default WhatsappOtpVerification;
