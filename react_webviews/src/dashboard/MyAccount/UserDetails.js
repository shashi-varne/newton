import "./MyAccount.scss";
import React, { Component } from 'react';
import WVInPageSubtitle from "../../common/ui/InPageHeader/WVInPageSubtitle";
import WVInPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";
import { isEmpty } from "lodash"

class MyaccountDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidUpdate(prevProp) {
        if (prevProp.contacts !== this.props.contacts) {
            let auth = false;
            let verified = false;
            let mobileInfo, emailInfo;
            const contacts = this.props.contacts;

            if (!isEmpty(contacts?.verified_mobile_contacts)) {
                let verified_mobile = contacts?.verified_mobile_contacts[0]
                mobileInfo = true
                if (verified_mobile?.is_auth) {
                    auth = true;
                    this.setState({
                        is_auth: verified_mobile?.contact_value,
                    })
                } else {
                    this.setState({
                        contact_value: verified_mobile?.contact_value,
                        contact_type: verified_mobile?.contact_type,
                    })
                }
            };

            if (!isEmpty(contacts?.verified_email_contacts)) {
                let verified_email = contacts?.verified_email_contacts[0]
                emailInfo = true;
                if (verified_email?.is_auth) {
                    verified = true
                    if (!auth) {
                        auth = true;
                        this.setState({
                            is_auth: `${verified_email?.contact_value}`,
                        })
                    } else {
                        this.setState({
                            contact_value: verified_email?.contact_value,
                            contact_type: verified_email?.contact_type,
                        })
                    }
                } else {
                    this.setState({
                        contact_value: verified_email?.contact_value,
                        contact_type: verified_email?.contact_type,
                    })
                }
            };

            if (!isEmpty(contacts?.unverified_mobile_contacts)) {
                mobileInfo = true
                verified = false
                let unverified_mobile_contacts = contacts?.unverified_mobile_contacts[0]

                this.setState({
                    contact_value: unverified_mobile_contacts?.contact_value,
                    contact_type: unverified_mobile_contacts?.contact_type,
                })
            }

            if (!isEmpty(contacts?.unverified_email_contacts)) {
                emailInfo = true;
                verified = false
                let unverified_email_contacts = contacts?.unverified_email_contacts[0]
                this.setState({
                    contact_value: unverified_email_contacts?.contact_value,
                    contact_type: unverified_email_contacts?.contact_type,
                })
            }
            this.setState({
                verified: verified,
                contact: mobileInfo && emailInfo
            })
        }
    };


    handleClick = async (verified) => {
        if (verified) return;
    }


    render() {

        const { verified, contact, is_auth, contact_value } = this.state;

        return (
            <div className="my-acct-details">
                <WVInPageTitle className="my-acct-user-name" children={this.props.name} />
                <WVInPageTitle className="my-acct-user-auth" children={is_auth} />
                <WVInPageSubtitle className="my-acct-user-details" children={`PAN: ${this.props.pan_no}`} />
                {contact && <div style={{ display: "flex", justifyContent: "space-between", }}>
                    <WVInPageSubtitle className="my-acct-user-details" children={verified ? `Email: ${contact_value}` : `Mobile: ${contact_value}`} />
                    <span onClick={() => this.handleClick(verified)} className={`my-acct-tag ${verified ? "my-acct-verified-tag" : ""}`}>{verified ? 'VERIFIED' : 'VERIFY'}</span>
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
                contact_value: "srikantagowda07",
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