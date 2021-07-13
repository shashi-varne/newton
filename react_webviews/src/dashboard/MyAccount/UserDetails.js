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
            const verification_done = contacts?.verification_done || false; // change This
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
                auth_type: auth_type,
            })
        }
    };


    handleClick = async (verified) => {

        if (verified) return;
        const { auth_type, contact_value } = this.state;
        const contact_type = auth_type === 'mobile' ? "email" : auth_type;
        let result = await this.authCheckApi(contact_type, { "contact_value": contact_value })
        if (!result?.is_user) {
            this.props.handleClick("/kyc/communication-details", { state: { goBack: "/my-account" } })
            return;
        }
        else if (result?.is_user) {
            // result = {
            //     "message": "User found",   // REMOVE THIS
            //     "is_user": true,
            //     "user": {
            //         "mobile": "9738950664",
            //         "pan_number": "HPDPK****K",
            //         "user_id": "4693250414739457",
            //         "email": "op********st@yopmail.com"
            //     }
            // }
            result.user.from = "my-account"
            this.props.showAccountAlreadyExist(true, result.user, contact_type);
        }
    }


    render() {

        const { verification_done, is_auth, contact_value } = this.state;

        return (
            <div className="my-acct-details">
                <WVInPageTitle className="my-acct-user-name" children={this.props.name} />
                <WVInPageTitle className="my-acct-user-auth" children={is_auth} />
                {this.props.pan_no && <WVInPageSubtitle className="my-acct-user-details" children={`PAN: ${this.props.pan_no}`} />}
                {verification_done !== null && <div style={{ display: "flex", justifyContent: "space-between", }}>
                    {contact_value && <WVInPageSubtitle className="my-acct-user-details" children={is_auth === 'mobile' ? `Mobile: ${contact_value}` : `Email: ${contact_value}`} />}
                    {contact_value && <span onClick={() => this.handleClick(verification_done)} className={`my-acct-tag ${verification_done ? "my-acct-verified-tag" : ""}`}>
                        {verification_done ? 'VERIFIED' : 'VERIFY'}
                    </span>}
                </div>}
            </div>
        )
    }
};


const UserDetails = (props) => {

    // if (props.contacts) {                                       // REMOVE THIS
    //     props.contacts.unverified_email_contacts = [
    //         {
    //             contact_type: "email",
    //             contact_value: "srikantagowda07@gmail.com",
    //             contact_verified: true,
    //             dt_created: "21/06/2021 07:58",
    //             dt_updated: "21/06/2021 14:20",
    //             id: 2055,
    //             is_auth: true,
    //             sms_consent: true,
    //             sms_subscribed: true,
    //             user_id: "6586478659371009",
    //             whatsapp_consent: true,
    //             whatsapp_subscribed: true,
    //         }
    //     ]
    // }

    return (<MyaccountDetails {...props} />)
}


export default UserDetails;