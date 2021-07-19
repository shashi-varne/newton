import "./commonStyle.scss"
import React, { Component } from 'react';
import Container from "../../common/Container";
import { Imgc } from '../../../common/ui/Imgc';
import OtpInput from "react-otp-input";
import { initializeComponentFunctions } from "./commonFunctions";
import WVInPageSubtitle from "../../../common/ui/InPageHeader/WVInPageSubtitle"
import WVClickableTextElement from "../../../common/ui/ClickableTextElement/WVClickableTextElement"

class ResetPinPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
        }
        this.initializeComponentFunctions = initializeComponentFunctions.bind(this);
    }

    componentDidMount() {
        this.initializeComponentFunctions();
    }

    handleClick = (route) => {
        this.navigate(route);
    };


    handleOtp = (otp) => {
        this.setState({
            otpData: { ...this.state.otpData, otp },
        });
    };


    render() {
        return (
            <Container
                data-aid='my-account-screen'
                noFooter={true}
                skelton={this.state.showLoader}
            >
                <div className="verify-otp-container">
                    <Imgc
                        src={require(`assets/padlock1.svg`)}
                        alt=""
                        className="img-lock"
                    />
                    <p className="reset-title">Enter your current fisdom PIN</p>
                    <div>
                        <OtpInput
                            numInputs={4}
                            id="default-otp"
                            containerStyle="default-otp-input-container"
                            inputStyle="default-otp-input"
                            onChange={(e) => this.handleOtp(e)}
                            hasErrored={true}
                            placeholder="X"
                            // isInputSecure={true}
                            value={this.state.otpData?.otp}
                            isDisabled={this.props.isDisabled || false}
                            errorStyle={this.props.isWrongOtp ? "otp-error-style" : ""}
                        />
                    </div>
                    <WVInPageSubtitle className="enter-pin-subtitle" children={"Enter fisdom PIN "} />
                    <WVClickableTextElement onClick={() => this.navigate("/forgot-fisdom-pin")}>
                        <p className="clickable-text-ele">FORGOT PIN?</p>
                    </WVClickableTextElement>
                </div>
            </Container>
        )
    }
};


const ResetPin = (props) => {
    return (<ResetPinPage {...props} />)
}


export default ResetPin;