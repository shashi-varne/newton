import React, { Component } from "react";
import Container from "../../common/Container";
import OtpDefault from "common/ui/otp";
import toast from "common/ui/Toast";
import { getConfig } from "utils/functions";
import { storageService, isEmpty } from "../../../utils/validators";
import { getPathname, storageConstants } from "../../constants";
import { initData } from "../../../kyc/services";
import { resendOtp, submitOtp } from "../../common/api";

class Otp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      timeAvailable: 30,
      totalTime: 30,
      showSkelton: true,
    };
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
    let { urls, otp, action, title } = this.state;
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
          this.props.history.push({
            pathname: result.navigateTo,
            search: getConfig().searchParams,
          });
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
        this.props.history.push({
          pathname: getPathname.pauseRequest,
          search: getConfig().searchParams,
        });
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

  render() {
    let { userKyc, showSkelton, isApiRunning, otp, otp_error } = this.state;
    return (
      <Container
        skelton={showSkelton}
        title="Enter OTP"
        buttonTitle="CONTINUE"
        showLoader={isApiRunning}
        handleClick={() => this.handleClick()}
        disable={otp.length !== 4}
      >
        <div className="reports-sip-otp">
          <div className="title">
            {userKyc &&
              (userKyc?.identification?.meta_data?.mobile_number ||
                userKyc?.identification?.meta_data?.email)}
          </div>
          <OtpDefault parent={this} isDisabled={isApiRunning} />
          {otp_error && <div className="otp-error">{otp_error}</div>}
        </div>
      </Container>
    );
  }
}

export default Otp;
