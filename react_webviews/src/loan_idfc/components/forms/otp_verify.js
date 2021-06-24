import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import OtpDefault from "../../../common/ui/otp";
import { getConfig } from "utils/functions";
import toast from "../../../common/ui/Toast";
import Api from "utils/api";

class OtpVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      otpnumber: "",
      otpnumber_error: "",
      otpVerified: false,
      otp: "",
      timeAvailable: 30,
      totalTime: 30,
      otpBaseData: {},
      proceedForOrder: false,
      base_url: getConfig().base_url,
      screen_name: "otp_verify",
      skelton: false,
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    let { params } = this.props.location;

    if (!params) {
      params = {};
    }

    if (!params || !params.resend_otp_url || !params.verify_otp_url) {
      this.props.history.goBack();
      return;
    }

    let otpBaseData = {
      mobile_no: params.mobile_no || "",
    };

    this.setState(
      {
        otpBaseData: otpBaseData,
        mobile_no: params.mobile_no || "",
        resend_otp_url: params.resend_otp_url || "",
        verify_otp_url: params.verify_otp_url || "",
        next_state: params.next_state || "",
      },
      () => {
        this.initialize();
      }
    );
  }

  onload = () => {};

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.onload,
          title1: this.state.title1,
          button_text1: "Retry",
        },
        submit: {
          handleClick1: this.handleClick,
          button_text1: "Retry",
          title1: this.state.title1,
          handleClick2: () => {
            this.setState({
              showError: false,
            });
          },
          button_text2: "Edit",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  sendEvents(user_action) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_otp_screen",
      properties: {
        user_action: user_action,
        resend_clicked: this.state.resend_otp_clicked ? "yes" : "no",
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
      otp_error: "",
    });
  };

  resendOtp = async () => {
    let { resend_otp_url: url } = this.state;
    this.setState({
      // skelton: 'g',
      otp_error: "",
      otp: "",
      timeAvailable: this.state.totalTime,
      resend_otp_clicked: true,
      openDialog: false,
    });

    try {
      this.setState({
        skelton: "g",
      });

      const res = await Api.get(url);

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        if (result.resend_otp_url !== "" && result.verify_otp_url !== "") {
          var message =
            "OTP sent to the mobile number " +
            this.state.mobile_no +
            ", please verify.";
          this.setState({
            skelton: false,
            resend_otp_url: result.resend_otp_url,
            verify_otp_url: result.verify_otp_url,
          });
          toast(message || result.message);
        }
        this.setState({
          skelton: false,
        });
      } else {
        this.setState({
          skelton: false,
        });
        toast(result.error || result.message || "Something went wrong!");
      }
    } catch (err) {
      this.setState({
        skelton: false,
      });
      toast("Something went wrong");
    }
  };

  handleClick = async () => {
    this.sendEvents("next");
    let canSubmitForm = true;

    let { verify_otp_url: url, otp } = this.state;

    let error = '';
    let errorType = '';

    if (!this.state.otp) {
      canSubmitForm = false;
      this.setState({
        otp_error: "Please enter OTP",
      });
      return;
    }

    if (this.state.otp.length !== 4) {
      canSubmitForm = false;
      this.setState({
        otp_error: "OTP is a 4 digit number",
      });
      return;
    }

    if (canSubmitForm) {
      this.setState({
        show_loader: "button",
        showError: false
      });

      let params = {
        otp: otp,
      };

      this.setErrorData("submit");
      try {
        this.setState({
          show_loader: "button",
        });

        const res = await Api.post(url, params);

        const { result, status_code: status } = res.pfwresponse;

        if (status === 200) {
          this.navigate(this.state.next_state);
        } else {
          this.setState({
            show_loader: false,
          });
          // toast(result.error || result.message || "Something went wrong!");
          let title1 = result.error || "Something went wrong!";
          this.setState({
            show_loader: false,
            skelton: false,
            title1: title1,
          });

          this.setErrorData("submit");
          error = true;
          errorType = "form";
        }
      } catch (err) {
        console.log(err);
        this.setState({
          show_loader: false,
        });
        // toast("Something went wrong");
        error = true;
        errorType = "form";
      }
    }

    if(error) {
      this.setState({
        show_loader: false,
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType
        },
        showError: true
      })
    }
  };

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        title="Enter OTP"
        buttonTitle="VERIFY & PROCEED"
        disable={this.state.otp.length !== 4}
        handleClick={this.handleClick}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="otp-verification">
          <div className="subtitle">
            OTP sent to <b>+91{this.state.otpBaseData.mobile_no}</b>
          </div>

          <OtpDefault parent={this} />
        </div>
      </Container>
    );
  }
}

export default OtpVerification;
