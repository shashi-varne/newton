import React, { Component } from "react";
import Container from "../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../common/functions";
import { getConfig } from "utils/functions";
import OtpDefault from "../../common/ui/otp";
import Api from "utils/api";
import toast from "../../common/ui/Toast";
import Dialog, { DialogContent } from "material-ui/Dialog";
import Button from "material-ui/Button";

class WhatsappOtpVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
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
      openDialog: false,
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let { params } = this.props.location;

    if (!params) {
      this.props.history.goBack();
      return;
    }

    // if (!params) {
    //   params = {};
    // }

    let otpBaseData = {
      otp_id: params.otp_id || "",
      mobile_no: params.mobile || "",
    };
    this.setState({
      otpBaseData: otpBaseData,
      mobile_no: params.mobile_no || "",
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      event_name: "whatsapp_updates",
      properties: {
        user_action: user_action,
        screen_name: !this.state.openDialog ? "otp screen" : "link failed",
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

  handleClick = async () => {
    this.sendEvents("next");
    let { otpBaseData } = this.state;

    if (!this.state.otp) {
      this.setState({
        otp_error: "Please enter OTP",
      });
      return;
    }

    if (this.state.otp.length !== 4) {
      this.setState({
        otp_error: "OTP is a 4 digit number",
      });
      return;
    }

    try {
      this.setState({
        show_loader: true,
      });

      let body = {
        mobile: otpBaseData.mobile_no,
      };

      const res = await Api.post(
        `/api/communication/verify/otp/${otpBaseData.otp_id}?user_id=${this.state.user_id}&otp=${this.state.otp}`,
        body
      );

      let resultData = res.pfwresponse.result || {};

      if (res.pfwresponse.status_code === 200 && !resultData.error) {

        this.navigate("otp-success");
        
      } else {
        this.setState({
          show_loader: false,
          openDialog: true,
        });
        // toast(resultData.error || "Something went wrong");
      }
    } catch (err) {
      this.setState({
        show_loader: false,
        // openDialog: true,
      });
      toast("Something went wrong");
    }
  };

  resendOtp = async () => {
    this.state.openDialog && this.sendEvents("retry")
    let { otpBaseData } = this.state;

    this.setState(
      {
        show_loader: true,
        otp_error: "",
        otp: "",
        timeAvailable: this.state.totalTime,
        resend_otp_clicked: true,
        openDialog: false
      }
    );

    try {
      this.setState({
        show_loader: true,
      });

      let body = {
        mobile: otpBaseData.mobile_no,
        otp_id: otpBaseData.otp_id,
      };

      const res = await Api.post(
        `/api/communication/resend/otp/${otpBaseData.otp_id}`,
        body
      );

      let resultData = res.pfwresponse.result;

      if (res.pfwresponse.status_code === 200 && !resultData.error) {
        this.setState({
          show_loader: false,
        });
        toast("OTP has been resent to your mobile no.");
      } else {
        this.setState({
          show_loader: false,
          otp: "",
        });
        toast(resultData.error || resultData.message || "Something went wrong");
      }
    } catch (err) {
      this.setState({
        show_loader: false,
      });
      toast("Something went wrong");
    }
  };

  cancelBtn = () => {
    this.sendEvents("back")
    nativeCallback({ action: "exit_web" });
  }

  renderOtpFailedDialog = () => (
    <Dialog
      id="bottom-popup"
      open={this.state.openDialog || false}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <div className="otp-failed">
          <div className="title">
            <h4>Verification failed!</h4>
            <img
              src={require(`assets/${this.state.productName}/ic_whatsapp_failed.svg`)}
              alt=""
            />
          </div>

          <div className="sub-title">
            Something went wrong! Please wait for few moments & try again.
          </div>

          <div className="button">
            <div className="not-now">
              <Button
                variant="raised"
                size="large"
                fullWidth={false}
                width="300px"
                onClick={this.cancelBtn}
              >
                NOT NOW
              </Button>
            </div>

            <Button
              variant="raised"
              size="large"
              color="secondary"
              fullWidth={true}
              onClick={this.resendOtp}
            >
              RETRY
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  render() {
    let { otpBaseData, otp, openDialog } = this.state;

    return (
      <Container
        showLoader={this.state.show_loader}
        title={!openDialog && "Enter OTP to verify"}
        events={this.sendEvents("just_set_events")}
        handleClick={this.handleClick}
        disable={otp.length !== 4}
        buttonTitle="CONFIRM"
        classHeader="OTP-title"
      >
        <div className="otp-verify" style={{ opacity: openDialog ? "0" : "1" }}>
          <div className="whatsapp-content">
            Please enter the OTP sent to <b>{"+91" + otpBaseData.mobile_no}</b>.
          </div>

          <OtpDefault parent={this} />

          {this.renderOtpFailedDialog()}
        </div>
      </Container>
    );
  }
}

export default WhatsappOtpVerification;
