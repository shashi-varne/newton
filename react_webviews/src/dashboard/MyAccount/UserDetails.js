import "./MyAccount.scss";
import React, { Component } from 'react';
import WVInPageSubtitle from "../../common/ui/InPageHeader/WVInPageSubtitle";
import WVInPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";
import { authCheckApi } from "../../login_and_registration/function";
// import { isEmpty } from "lodash"

class MyaccountDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.authCheckApi = authCheckApi.bind(this);
    }

    componentDidUpdate(prevProp) {
        if (prevProp.contacts !== this.props.contacts) {
            const contacts = this.props.contacts;
            const auth_type = contacts?.auth_type;
            const verification_done = false //contacts?.verification_done;
            let contact_value = "";

            if (verification_done) {
                contact_value = auth_type === "mobile" ? contacts?.verified_email_contacts[0]?.contact_value : contacts?.verified_mobile_contacts[0]?.contact_value;
            } else if (!verification_done && verification_done !== null) {
                contact_value = auth_type === "mobile" ? contacts?.unverified_email_contacts[0]?.contact_value : contacts?.unverified_mobile_contacts[0]?.contact_value;
            }

            this.setState({
                is_auth: auth_type === "mobile" ? contacts?.verified_mobile_contacts[0]?.contact_value : contacts?.verified_email_contacts[0]?.contact_value,
                verification_done: verification_done,
                contact_value: contact_value,
            })
        }
    };


    handleClick = async (verified) => {

        if (verified) return;
        const { is_auth, contact_value, unique_user } = this.state;
        const type = is_auth === 'mobile' ? is_auth : "email"
        const result = await this.authCheckApi(type, { "contact_value": contact_value })
        console.log(result)
        if (!result?.is_user) {
            this.props.handleClick("/kyc/communication-details")
        }
    }


    render() {

        const { verification_done, is_auth, contact_value } = this.state;

        return (
            <div className="my-acct-details">
                <WVInPageTitle className="my-acct-user-name" children={this.props.name} />
                <WVInPageTitle className="my-acct-user-auth" children={is_auth} />
                <WVInPageSubtitle className="my-acct-user-details" children={`PAN: ${this.props.pan_no}`} />
                {verification_done !== null && <div style={{ display: "flex", justifyContent: "space-between", }}>
                    <WVInPageSubtitle className="my-acct-user-details" children={is_auth === 'mobile' ? `Mobile: ${contact_value}` : `Email: ${contact_value}`} />
                    <span onClick={() => this.handleClick(verification_done)} className={`my-acct-tag ${verification_done ? "my-acct-verified-tag" : ""}`}>
                        {verification_done ? 'VERIFIED' : 'VERIFY'}
                    </span>
                </div>}
            </div>
        )
    }
};


const UserDetails = (props) => {

    if (props.contacts) {
        props.contacts.unverified_email_contacts = [
            {
                contact_type: "email",
                contact_value: "srikantagowda07@gmail.com",
                contact_verified: true,
                dt_created: "21/06/2021 07:58",
                dt_updated: "21/06/2021 14:20",
                id: 2055,
                is_auth: true,
                sms_consent: true,
                sms_subscribed: true,
                user_id: "6586478659371009",
                whatsapp_consent: true,
                whatsapp_subscribed: true,
            }
        ]
    }

    return (<MyaccountDetails {...props} />)
}


export default UserDetails;