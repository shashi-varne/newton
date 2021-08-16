import "./secondaryVerification.scss";
import React, { Component } from 'react';
import Container from "../../../dashboard/common/Container";
import Input from "common/ui/Input";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { countries } from "../../constants";
import { authCheckApi, formCheckFields, triggerOtpApi } from "../../functions";
import { validateNumber, validateEmail } from "utils/validators";
import { nativeCallback } from "../../../utils/native_callback";
import toast from "common/ui/Toast";
import DropDownNew from "common/ui/DropDownNew";
import Checkbox from "../../../common/ui/Checkbox";
import WVInPageSubtitle from "../../../common/ui/InPageHeader/WVInPageSubtitle";
import AccountAlreadyExistDialog from "../../components/AccountAlreadyExistDialog";
import { isEmpty } from "../../../utils/validators";

class SecondaryVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productName: getConfig().productName,
            form_data: { whatsapp_consent: true, code: "91" },
            accountAlreadyExists: false,
            isEdit: false
        }
        this.authCheckApi = authCheckApi.bind(this);
        this.formCheckFields = formCheckFields.bind(this);
        this.navigate = navigateFunc.bind(this.props);
        this.triggerOtpApi = triggerOtpApi.bind(this)
    }

    componentWillMount() {
        const { state } = this.props.location;
        let { form_data } = this.state;
        let loginType = state?.communicationType || "mobile";
        if (state.edit) {
            form_data[state?.communicationType] = state?.contactValue;
            this.setState({ isEdit: true })
        }
        this.setState({ loginType, form_data })
        countries.map((item) => {
            return item.name = `+${item.value}`
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
        if(name === "mobile" && value && !validateNumber(value)) return;
        if(name === "mobile" && form_data.code === "91" && value.length > 10) return;
        form_data[name] = value;
        if(name === "whatsapp_consent") form_data[name] = !form_data?.whatsapp_consent;
        form_data[`${name}_error`] = "";
        this.setState({ form_data });
    };

    isMobileNotValid = (form_data) => {
        return (
            !validateNumber(form_data["mobile"]) ||
            !form_data.code ||
            (form_data.code === "91" && form_data?.mobile?.length < 10)
        )
    }
    
    handleClick = async () => {
        let {
            form_data,
            loginType
        } = this.state;
        let keys_to_check = ["mobile", "code"];
        if (loginType === "email") keys_to_check = ["email"];
        if (loginType === "mobile" && this.isMobileNotValid(form_data)) {
            this.setState({
                form_data: {
                    ...form_data,
                    mobile_error: "Invalid mobile number",
                    code_error: isEmpty(form_data["code"]) ? "required" : "",
                }
            });
            toast("Invalid mobile number");
            return;
        } else if (loginType === "email" && !validateEmail(form_data["email"])) {
            this.setState({
                form_data: {
                    ...form_data,
                    email_error: "Invalid email",
                }
            });
            toast("Invalid email");
            return;
        }
        let result = await this.authCheckApi(loginType, {
            "contact_value": form_data[loginType]
        });
        if (result && result.is_user) {
            this.sendEvents("next")
            this.setState({
                accountAlreadyExists: true,
                accountAlreadyExistsData: result.user,
                verifyDetailsType: loginType,
            })
        } else if (result && !result.is_user) {
            this.formCheckFields(keys_to_check, form_data, "LOGIN", loginType, true);
        }
    }

    sendEvents = (userAction, type) => {
        const { loginType, form_data } = this.state;
        if(type === "bottomsheet"){
            let properties = {
                "screen_name": "account_already_exists",
                "user_action": userAction,
            }
            let eventObj = {
                "event_name": 'verification_bottom_sheet',
                "properties": properties,
            };
            if (userAction === 'just_set_events') {
                return eventObj;
            } else {
                nativeCallback({ events: eventObj });
            }
            return;
        }
        let properties = {
            "screen_name": loginType === 'email' ? 'email' : 'enter mobile number',
            "user_action": userAction
        }
        if (loginType === "mobile") {
            properties = {
                ...properties,
                "number_entered": form_data?.mobile ? "yes" : "no",
                "whatsapp_agree": form_data.whatsapp_consent ? "yes" : "no",
            }
        } else properties.email_entered = form_data.email ? "yes" : "no";
        let eventObj = {
            "event_name": 'onboarding',
            "properties": properties,
        };
        if (userAction === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    continueAccountAlreadyExists = async (type) => {
        this.setState({
            accountAlreadyExists: false,
            isApiRunning: "button",
        });
        let body = { secondaryVerification: true};
        let { form_data } = this.state;
        if (type === "email") {
            body.email = form_data?.email;
        } else {
            body.mobile = `${form_data["code"]}|${form_data["mobile"]}`;
            body.whatsapp_consent = true;
        };
        await this.triggerOtpApi(body, type, true);
        this.sendEvents("next", "bottomsheet");
    };

    editDetailsAccountAlreadyExists = () => {
        this.sendEvents("edit", "bottomsheet");
        this.setState({
            accountAlreadyExists: false,
            isEdit: true,
        })
    };

    closeAccountAlreadyExistDialog = () => {
        this.sendEvents("back", "bottomsheet");
        this.setState({
            accountAlreadyExists: false,
        })
    }


    render() {
        const { loginType, form_data, isEdit } = this.state;

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                fullWidthButton={true}
                onlyButton={true}
                buttonTitle="CONTINUE"
                handleClick={this.handleClick}
                canSkip={true}
                onSkipClick={() => {
                    this.navigate("/");
                    this.sendEvents("skip");
                }}
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
                                        value={form_data.code || "91"}
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
                            <div style={{ marginTop : form_data?.mobile_error ? "12px" : "2px"}} className="input-subtitle">We'll send an OTP to verify your mobile number</div>
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
                                    label="Email address"
                                    name="email"
                                    onChange={this.handleChange("email")}
                                    autoFocus
                                />
                            </div>
                            <div className="input-subtitle">we'll keep you updated on your Investments</div>
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