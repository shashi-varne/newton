import "./commonStyle.scss"
import React, { Component } from 'react';
import Container from "../../common/Container";
import { Imgc } from '../../../common/ui/Imgc';
import { validateNumber } from "utils/validators";
import { initializeComponentFunctions } from "./commonFunctions";
import WVInPageSubtitle from "../../../common/ui/InPageHeader/WVInPageSubtitle"
import Input from "common/ui/Input";

class ForgotFisdomPinPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            form_data: {}
        }
        this.initializeComponentFunctions = initializeComponentFunctions.bind(this);
    }

    componentDidMount() {
        this.initializeComponentFunctions();
    }


    handleChange = (name) => (event) => {
        let value = event.target ? event.target.value : event;
        if (name === "mobile" && value && !validateNumber(value)) return;
        let { form_data } = this.state;
        form_data[name] = value;
        form_data[`${name}_error`] = "";
        this.setState({ form_data: form_data });
    };


    handleClick = (route) => {
        this.navigate(route);
    };


    render() {
        const { form_data } = this.state; console.log("form_data ? " , form_data );
        return (
            <Container
                data-aid='forgotfisdom-pin-screen'
                title="Forgot Fisdom PIN"
                fullWidthButton={true}
                onlyButton={true}
                skelton={this.state.showLoader}
                skelton={this.state.skelton}
                showLoader={this.state.show_loader}
                showError={this.state.showError}
                errorData={this.state.errorData}
                buttonTitle="CONTINUE"
                withProvider={true}
                handleClick={() => this.handleClick()}
            >
                <div className="forgot-fisdom-pin">
                    <WVInPageSubtitle children={"OTP will be sent to your registered mobile number"} />

                    <div className="login-form-field">
                        <span className="input-field">
                            <Input
                                error={form_data.mobile_error ? true : false}
                                type="text"
                                value={form_data.mobile || ""}
                                helperText={form_data.mobile_error || ""}
                                class="input mobile-number"
                                id="mobile"
                                label="Enter mobile number"
                                name="mobile"
                                onChange={this.handleChange("mobile")}
                                inputMode="numeric"
                                // disabled={true}
                                autoFocus
                            />
                        </span>
                        <span className="input-field">
                            <Input
                                error={form_data.pan_number ? true : false}
                                type="text"
                                value={form_data.pan_number || ""}
                                helperText={form_data.pan_number_error || ""}
                                class="input pan-number"
                                id="pan_number"
                                label="Enter registered PAN number"
                                name="pan_number"
                                onChange={this.handleChange("pan")}
                                inputMode="numeric"
                                // disabled={true}
                                autoFocus
                            />
                            <WVInPageSubtitle className="forgot-pin-subtitle" children={"Enter PAN number to confirm your account"} />
                        </span>

                    </div>
                </div>
            </Container>
        )
    }
};


const ForgotFisdomPin = (props) => {
    return (<ForgotFisdomPinPage {...props} />)
}


export default ForgotFisdomPin;