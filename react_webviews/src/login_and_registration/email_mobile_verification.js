import "./Style.scss";
import React, { Component } from 'react';
import Container from "../dashboard/common/Container";
import Input from "common/ui/Input";
import { getConfig } from 'utils/functions';
import { countries } from "./constants";
import DropDownNew from "common/ui/DropDownNew";
import WVInPageSubtitle from "../common/ui/InPageHeader/WVInPageSubtitle";
import Checkbox from "../common/ui/Checkbox";


class EnterVerifyDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productName: getConfig().productName,
            form_data: {},
            isMobile: false,
            isEmail: true,
        }
    }

    componentWillMount() {

        countries.map((item, idx) => {

            item.name = "+" + item.value;

        })

    }

    handleChange = (name) => (event) => {
        let value = event.target ? event.target.value : event;
        let { form_data } = this.state;
        form_data[name] = value;
        form_data[`${name}_error`] = "";
        this.setState({ form_data: form_data });
    };

    handleClicks() {
        console.log('hi')
    }


    render() {

        const { isMobile, isEmail, form_data } = this.state;

        return (
            <Container
                fullWidthButton={true}
                onlyButton={true}
                buttonTitle="CONTINUE"
                handleClick={() => this.handleClicks()}
                canSkip={true}
                onSkipClick={() => console.log("hello")}
                showLoader={this.state.show_loader}
                title={isMobile ? "Enter Your Number to get started" : "Share your email address"}>
                <div className="form" data-aid='form'>
                    {isMobile && (
                        <div>
                            <div className="form-field" style={{ display: "flex" }}>
                                <span className="country-code" data-aid='country-code' style={{ width: "115px", marginRight: '15px' }}>
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
                            </div>
                            <WVInPageSubtitle children={"We'll send an OTP to verify your mobile number"} />
                            <div className="declaration-container">
                                <Checkbox
                                    defaultChecked
                                    checked={this.state.checked}
                                    color="default"
                                    value="checked"
                                    name="checked"
                                    handleChange={() => console.log("clicked")}
                                    className="Checkbox"
                                />
                                <p>I agree to receive important investment updates on WhatsApp</p>
                            </div>
                        </div>
                    )}
                    {isEmail &&
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
            </Container >
        )
    }
}

export default EnterVerifyDetails;