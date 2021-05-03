import React, { Component } from "react";
import toast from "common/ui/Toast";
import OtpDefault from "../../common/ui/otp";
import { getMerge } from "../../kyc/common/api";
import Api from "../../utils/api";
import { getConfig } from "../../utils/functions";
import { isEmpty } from "../../utils/validators";
import Container from "../common/Container";
import "./Otp.scss";
import AccountMergeConfirmBack from "../mini-components/AccountMergeConfirmBack";

class AccountMergeOtp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      screenName: "account_merge_otp",
      pan_number: this.props.match?.params?.pan_number || "",
      auth_id: {},
      timeAvailable: 30,
      totalTime: 30,
      otp: "",
      openConfirmBack: false
    };
  }

  componentDidMount() {
    this.initialize();
  }

  initialize = async () => {
    let { pan_number } = this.state;
    if (!pan_number) {
      this.props.history.goBack();
    }

    try {
      const result = await getMerge(pan_number);
      if (!result) return;
      this.setState({ auth_id: result.auth_ids[0], otpData: result });
    } catch (error) {
      toast(error.message || "Something went wrong!");
    } finally {
      this.setState({ show_loader: false });
    }
  };

  handleOtp = (otp) => {
    this.setState({
      otp: otp,
    });
  };

  resendOtp = async () => {
    if (isEmpty(this.state.otpData)) {
      return;
    }
    this.setState({
      isApiRunning: "button",
      otp_error: "",
      otp: "",
      timeAvailable: this.state.totalTime,
      resend_otp_clicked: true,
    });
    try {
      const res = await Api.get(this.state.otpData.resend_url);
      if (res.pfwresponse.status_code !== 200) {
        toast(
          res.pfwresponse.result.error ||
            res.pfwresponse.result.message ||
            "Something went wrong"
        );
      }
    } catch (err) {
      toast("Something went wrong");
    } finally {
      this.setState({
        isApiRunning: false,
      });
    }
  };

  handleClick = async () => {
    let { otpData, otp } = this.state;
    if (isEmpty(otpData)) {
      return;
    }
    this.setState({
      isApiRunning: "button",
    });
    try {
      const res = await Api.get(`${otpData.verify_url}?otp=${otp}`);
      this.setState({
        isApiRunning: false,
      });
      if (res.pfwresponse.status_code === 200) {
        this.props.history.push({
          pathname: "/account/merge/linked/success",
          search: getConfig().searchParams,
        });
      } else {
        toast(
          res.pfwresponse.result.error ||
            res.pfwresponse.result.message ||
            "Something went wrong"
        );
      }
    } catch (err) {
      this.setState({
        isApiRunning: false,
      });
      toast("Something went wrong");
    }
  };

  render() {
    let { auth_id, otp, isApiRunning, otpData, openConfirmBack } = this.state;
    return (
      <Container
        skelton={this.state.show_loader}
        buttonTitle="CONTINUE"
        handleClick={this.handleClick}
        title="Enter OTP to verify"
        disable={otp.length !== 4}
        showLoader={isApiRunning}
        headerData={{ goBack: () => this.setState({ openConfirmBack: true }) }}
      >
        {!isEmpty(otpData) && (
          <div className="account-merge-otp">
            <p>
              Please enter the OTP sent on{" "}
              {auth_id.type === "mobile" ? "Mobile Number" : "email ID"}{" "}
              {auth_id.auth_id}
            </p>
            <div className="otp-input">
              <OtpDefault parent={this} isDisabled={isApiRunning} />
            </div>
          </div>
        )}
        <AccountMergeConfirmBack
          isOpen={openConfirmBack}
          close={() => this.setState({ openConfirmBack: false })}
          goBack={() => this.props.history.goBack()}
        />
      </Container>
    );
  }
}

export default AccountMergeOtp;
