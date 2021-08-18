import "./MyAccount.scss";
import React, { Component } from 'react';
import WVInPageSubtitle from "../../common/ui/InPageHeader/WVInPageSubtitle";
import WVInPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";
import { authCheckApi } from "../../login_and_registration/functions";
import { splitMobileNumberFromContryCode } from "../../utils/validators"
import isEmpty from 'lodash/isEmpty';

class MyaccountDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.authCheckApi = authCheckApi.bind(this);
    }

    componentDidUpdate(prevProp) {
        if (prevProp.contactInfo !== this.props.contactInfo) {
            const contactDetails = this.props.contactInfo;
            let contact_type, contact_value, auth_type, isVerified = true, auth_value;
            if (!isEmpty(contactDetails)) {
                if (contactDetails?.mobile_number_verified) {
                    auth_type = "mobile";
                    auth_value = splitMobileNumberFromContryCode(contactDetails?.mobile_number)
                } else if (contactDetails?.email_verified) {
                    auth_value = contactDetails?.email;
                    auth_type = "email";
                }

                if (!isEmpty(contactDetails.mobile_number) && contactDetails.mobile_number_verified === false) {
                    contact_type = "mobile";
                    isVerified = false;
                    contact_value = splitMobileNumberFromContryCode(contactDetails?.mobile_number)
                } else if (!isEmpty(contactDetails.email) && contactDetails.email_verified === false) {
                    contact_type = "email";
                    contact_value = contactDetails.email;
                    isVerified = false;
                }
                
                this.setState({
                    isVerified,
                    auth_type,
                    auth_value,
                    contact_value: isVerified ? contactDetails?.email : contact_value,
                    contact_type: isVerified ? "email" : contact_type,
                    dataAvaliable: !isEmpty(contactDetails.email) && !isEmpty(contactDetails.mobile_number),
                })
            }
        }
    }

    handleClick = async (verified) => {
        if (verified) return;
        this.props.sendEvents("next")
        this.props.showLoader();
        const { contact_type, contact_value } = this.state;
        let result = await this.authCheckApi(contact_type, { "contact_value": contact_value })
        this.props.showLoader();
        if (result && !result?.is_user) {
            this.props.handleClick("/kyc/communication-details")
            return;
        }
        else if (result && result?.is_user) {
            result.user.from = "my-account";
            result.user.contact_value = contact_value;
            this.props.showAccountAlreadyExist(true, result.user, contact_type);
        }
    }


    render() {

        const { isVerified, contact_type, contact_value, dataAvaliable, auth_value } = this.state;

        return (
            <div className="my-acct-details">
                <WVInPageTitle className="my-acct-user-name" children={this.props.name} />
                <WVInPageTitle className="my-acct-user-auth" children={auth_value} />
                {this.props.pan_no && <WVInPageSubtitle className="my-acct-user-details" children={`PAN: ${this.props.pan_no}`} />}
                {dataAvaliable && <div style={{ display: "flex", justifyContent: "space-between", }}>
                <WVInPageSubtitle className="my-acct-user-details" children={contact_type === 'mobile' ? `Mobile: ${contact_value}` : `Email: ${contact_value}`} />
                <span onClick={() => this.handleClick(isVerified)} className={`my-acct-tag ${isVerified ? "my-acct-verified-tag" : ""}`}>
                    {isVerified ? 'VERIFIED' : 'VERIFY'}
                </span>
                </div>}
            </div>
        )
    }
};


const UserDetails = (props) => {
    return (<MyaccountDetails {...props} />)
}


export default UserDetails;