import "./MyAccount.scss";
import React, { Component } from 'react';
import WVInPageSubtitle from "../../common/ui/InPageHeader/WVInPageSubtitle";
import WVInPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";
import { authCheckApi } from "../../login_and_registration/functions";
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
            const verification_done = contacts?.verification_done || false;
            let contact_value = "";

            if (verification_done) {
                contact_value = auth_type === "mobile" ? contacts?.verified_email_contacts[0]?.contact_value : contacts?.verified_mobile_contacts[0]?.contact_value;
            } else if (!verification_done && verification_done !== null) {
                contact_value = auth_type === "mobile" ? contacts?.unverified_email_contacts[0]?.contact_value : contacts?.unverified_mobile_contacts[0]?.contact_value;
            }

            this.setState({
                is_auth: auth_type === "mobile" ? (contacts?.verified_mobile_contacts[0]?.contact_value).slice(-10) : contacts?.verified_email_contacts[0]?.contact_value,
                verification_done: verification_done,
                contact_value: contact_value,
                auth_type: auth_type,
            })
        }
    };


    handleClick = async (verified) => {

        if (verified) return;
        this.props.showLoader();
        const { auth_type, contact_value } = this.state;
        const contact_type = auth_type === 'mobile' ? "email" : auth_type;
        let result = await this.authCheckApi(contact_type, { "contact_value": contact_value })
        this.props.showLoader();
        if (!result?.is_user) {
            this.props.handleClick("/kyc/communication-details", { state: { goBack: "/my-account" } })
            return;
        }
        else if (result?.is_user) {
            result.user.from = "my-account";
            result.user.contact_value = contact_value;
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
    return (<MyaccountDetails {...props} />)
}


export default UserDetails;