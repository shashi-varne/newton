import "./secondaryVerification.scss";
import React, { Component } from 'react';
import Container from "../../../dashboard/common/Container";
import Input from "common/ui/Input";
import { getConfig } from 'utils/functions';
import { countries } from "../../constants";
import { initialize } from "../../functions";
import { validateNumber } from "utils/validators";
import { nativeCallback } from "../../../utils/native_callback";
import DropDownNew from "common/ui/DropDownNew";
import Checkbox from "../../../common/ui/Checkbox";
import WVInPageSubtitle from "../../../common/ui/InPageHeader/WVInPageSubtitle";
import AccountAlreadyExistDialog from "../../components/AccountAlreadyExistDialog";

class SecondaryVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productName: getConfig().productName,
            form_data: { whatsapp_consent: true, code: "+91" },
            loginType: "mobile",
            accountAlreadyExists: false,
            isEdit: true
        }
        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
        const { state } = this.props.location;
        let { form_data } = this.state;
        let loginType = state?.communicationType || "mobile";
        if (state.edit) {
            form_data[state?.communicationType] = state?.contactValue;
            this.setState({ isEdit: true })
        }
        this.setState({ loginType, form_data })
        countries.map((item) => {
            return item.name = "+" + item.value;
        })
    }

    componentDidMount() {
        this.setState({
            form_data: {
                ...this.state.form_data,
                mobile: this.props.location?.state?.contactValue
            },
        })
    }

    handleChange = (name) => (event) => {
        let value = event.target ? event.target.value : event;
        let { form_data } = this.state;
        if (name === "mobile" && value && !validateNumber(value)) return;
        if (name === "mobile" && form_data.code === "+91" & value.length > 10) return;
        form_data[name] = value;
        if (name === "whatsapp_consent") form_data[name] = !form_data?.whatsapp_consent;
        form_data[`${name}_error`] = "";
        this.setState({ form_data: form_data });
    };

    handleClick = async () => {
        let { form_data, loginType } = this.state;
        let keys_to_check = ["mobile", "code"];
        if (loginType !== "email")
            this.sendEvents();
        if (loginType === "email") keys_to_check = ["email"];
        let result = await this.authCheckApi(loginType, { "contact_value": form_data[loginType] })
        if (result?.is_user) {
            this.setState({
                accountAlreadyExists: true,
                accountAlreadyExistsData: result?.user,
                verifyDetailsType: loginType,
            })
        } else if (!result?.is_user) {
            this.formCheckFields(keys_to_check, form_data, "LOGIN", loginType, true);
        }
    }

    sendEvents = (userAction) => {
        let eventObj = {
            "event_name": 'otp sent to user',
        };
        if (userAction === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    continueAccountAlreadyExists = async (type, data) => {
        let body = {};
        let { form_data } = this.state;
        if (type === "email") {
            body.email = form_data?.email;
        } else {
            body.mobile = form_data?.mobile;
            body.whatsapp_consent = true;
        };
        const otpResponse = await this.generateOtp(body);
        if (otpResponse) {
            this.navigate("secondary-otp-verification", {
                state: {
                    value: type === "email" ? form_data?.email : form_data?.mobile,
                    otp_id: otpResponse.pfwresponse.result.otp_id,
                    communicationType: type,
                },
            });
        }
    };

    editDetailsAccountAlreadyExists = () => {
        this.setState({
            accountAlreadyExists: false
        })
    };

    closeAccountAlreadyExistDialog = () => {
        this.setState({
            accountAlreadyExists: false
        })
    }


    render() {
        const { loginType, form_data, isEdit } = this.state;

        return (
            <Container
                fullWidthButton={true}
                onlyButton={true}
                buttonTitle="CONTINUE"
                handleClick={() => this.handleClick()}
                canSkip={true}
                onSkipClick={() => this.navigate("/")}
                showLoader={this.state.isApiRunning}
                title={isEdit ? `Edit ${loginType === "mobile" ? 'mobile number' : 'email'}` : loginType === "mobile" ? "Share your mobile number" : "Share your email address"}>
                <div className="form" data-aid='form'>
                    {isEdit &&
                        <WVInPageSubtitle
                            children={`This ${loginType === "mobile" ? 'number' : 'email'} is only for communication; your existing ${loginType === "mobile" ? 'number' : 'email'} linked with the investment account will remain the same`}
                            style={{ margin: "-5px 0 15px" }}
                        />}
                    {loginType === "mobile" && (
                        <div>
                            <div className="login-form-field">
                                <span className="country-code" data-aid='country-code'>
                                    <DropDownNew
                                        onChange={this.handleChange("code")}
                                        error={form_data.code_error ? true : false}
                                        helperText={form_data.code_error || ""}
                                        options={countries}
                                        value={form_data.code || "+91"}
                                        width={20}
                                        id="code"
                                        name="code"
                                        isAOB={true}
                                    />
                                </span>
                                <span className="mobile-number-login">
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
                                        autoFocus
                                    />
                                </span>
                            </div>
                            <WVInPageSubtitle children={"We'll send an OTP to verify your mobile number"} />
                            <div className="declaration-container whatsapp-consent">
                                <Checkbox
                                    defaultChecked
                                    checked={form_data?.whatsapp_consent}
                                    color="default"
                                    value="checked"
                                    name="checked"
                                    handleChange={this.handleChange("whatsapp_consent")}
                                    index={form_data?.whatsapp_consent}
                                    className="Checkbox"
                                />
                                <p>I agree to receive important investment updates on WhatsApp</p>
                            </div>
                        </div>
                    )}
                    {loginType === "email" &&
                        <>
                            <div className="form-field">
                                <Input
                                    error={form_data.email_error ? true : false}
                                    type="text"
                                    value={form_data.email}
                                    helperText={form_data.email_error || ""}
                                    class="input"
                                    id="email"
                                    label="Enter email address"
                                    name="email"
                                    onChange={this.handleChange("email")}
                                    autoFocus
                                />
                            </div>
                            <WVInPageSubtitle children={"we'll keep you updated on your Investments"} />
                        </>
                    }
                </div>
                <AccountAlreadyExistDialog
                    type={this.state.verifyDetailsType}
                    data={this.state.accountAlreadyExistsData}
                    isOpen={this.state.accountAlreadyExists}
                    onClose={this.closeAccountAlreadyExistDialog}
                    next={this.continueAccountAlreadyExists}
                    editDetails={this.editDetailsAccountAlreadyExists}
                ></AccountAlreadyExistDialog>
            </Container >
        )
    }
}

export default SecondaryVerification;