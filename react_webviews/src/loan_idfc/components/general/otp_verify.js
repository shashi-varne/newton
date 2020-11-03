import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import OtpDefault from "../../../common/ui/otp";
import { getConfig } from "utils/functions";

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
            base_url: getConfig().base_url
        }

        this.initialize = initialize.bind(this);
    }

    componentWIllMount() {
        this.initialize();

        let { params } = this.props.location;

        if (!params) {
            // this.props.history.goBack();
            // return
            params = {};
        }
    }

    sendEvents(user_action) {
        let eventObj = {
            event_name: 'lending',
            properties: {
                user_action: user_action,
                screen_name: 'otp'
            }
        }

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
        this.sendEvents('next');
        let { otpBaseData } = this.state;

        if (!this.state.otp) {
            this.setState({
                otp_error: 'Please enter OTP'
            });
            return;
        }

        if (this.state.otp.length !== 4) {
            this.setState({
              otp_error: "OTP is a 4 digit number",
            });
            return;
        }
    }

    render() {
        return (
            <Container
                showLoader={this.state.show_loader}
                title="Otp verification"
                buttonTitle="VERIFY & PROCEED"
                disable={this.state.otp.length !== 4}
            >
                <div className="otp-verification">
                    <div className="subtitle">
                        Enter OTP sent to <b>+917400190682</b>
                    </div>

                    <OtpDefault parent={this} />
                </div>
            </Container>

        )
    }
}

export default OtpVerification;