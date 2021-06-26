import React, { Component } from "react";
import Container from "../../common/Container";
import OtpDefault from "common/ui/otp";
import toast from "common/ui/Toast";
import { navigate as navigateFunc} from "utils/functions";
import { storageService, isEmpty } from "../../../utils/validators";
import { getPathname, storageConstants } from "../../constants";
import { initData } from "../../../kyc/services";
import { resendOtp, submitOtp } from "../../common/api";
import "./commonStyles.scss";
import { nativeCallback } from "../../../utils/native_callback";

class Otp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      timeAvailable: 30,
      totalTime: 30,
      showSkelton: true,
    };
    this.navigate = navigateFunc.bind(this.props);
  }

  goBack = () => {
    this.props.history.goBack();
  };

  componentDidMount() {
    this.onload();
  }

  onload = async () => {
    const params = this.props?.match?.params || {};
    const state = this.props.location.state || {};
    if (isEmpty(state) || isEmpty(state.urls)) this.goBack();
    const urls = state.urls;
    const action = params.action;
    let title = "";
    if (action === "pause" || action === "cancel") title = "Request placed!";
    let userKyc = storageService().getObject(storageConstants.KYC);
    if (!userKyc) {
      await initData();
      userKyc = storageService().getObject(storageConstants.KYC);
    }
    this.setState({ userKyc, urls, action, title, showSkelton: false });
  };

  handleClick = async () => {
    this.sendEvents("next");
    let { urls, otp, action, title } = this.state;
    if (otp.length !== 4) {
      toast("You have entered invalid OTP.");
      return;
    }
    if (urls && urls.api_submit_otp) {
      this.setState({ isApiRunning: "button" });
      try {
        const result = await submitOtp({
          url: urls.api_submit_otp,
          otp: otp,
        });
        this.setState({ isApiRunning: false });
        if (!result) {
          return;
        }
        if (result.navigateTo) {
          this.navigate(result.navigateTo)
          return;
        }
        const requestdata = {
          title: title,
          data: result,
          action: action,
        };
        storageService().setObject(
          storageConstants.PAUSE_REQUEST_DATA,
          requestdata
        );
        this.navigate(getPathname.pauseRequest);
      } catch (err) {
        toast(err);
        this.setState({ isApiRunning: false });
      }
    } else this.goBack();
  };

  handleOtp = (otp) => {
    this.setState({
      otp: otp,
      otp_error: "",
    });
  };

  resendOtp = async () => {
    this.sendEvents("resend");
    this.setState({ otp: "" });
    let { urls } = this.state;
    if (urls && urls.api_resend_otp) {
      this.setState({ isApiRunning: "button" });
      try {
        const result = await resendOtp({
          url: urls.api_resend_otp,
        });
        if (!result) {
          this.setState({ isApiRunning: false });
          return;
        }
        toast(result.message);
      } catch (err) {
        toast(err);
      } finally {
        this.setState({ isApiRunning: false });
      }
    } else this.goBack();
  };

  sendEvents = (userAction) => {
    let eventObj = {
      event_name: "sip_pause_cancel",
      properties: {
        user_action: userAction || "",
        screen_name: "Otp",
        operation: this.state.action,
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  render() {
    let { userKyc, showSkelton, isApiRunning, otp_error } = this.state;
    return (
      <Container
        data-aid='reports-otp-screen'
        events={this.sendEvents("just_set_events")}
        skelton={showSkelton}
        title="Enter OTP"
        buttonTitle="SUBMIT"
        showLoader={isApiRunning}
        handleClick={() => this.handleClick()}
      >
        <div className="reports-sip-otp" data-aid='reports-sip-otp'>
          <div className="title" data-aid='reports-otp-title'>
            {userKyc &&
              (userKyc?.identification?.meta_data?.mobile_number ||
                userKyc?.identification?.meta_data?.email)}
          </div>
          <OtpDefault parent={this} isDisabled={isApiRunning} />
          {otp_error && <div className="otp-error" data-aid='reports-otp-error'>{otp_error}</div>}
        </div>
      </Container>
    );
  }
}

export default Otp;
