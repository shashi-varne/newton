import React, { Component } from 'react';
import { getConfig } from 'utils/functions';
class ContactUsClass extends Component {
    render() {
        return (
            <div className="success-bottom">
                <div className="success-bottom1">
                    FOR ANY QUERY, REACH US AT
                </div>
                <div className="success-bottom2">
                    <div className="success-bottom2a">
                        {getConfig().mobile}
                    </div>
                    <div className="success-bottom2b">
                        |
                </div>
                    <div className="success-bottom2a">
                        {getConfig().askEmail}
                    </div>
                </div>
            </div>
        );
    }
}

const ContactUs = (props) => (
    <ContactUsClass
        {...props} />
);

export default ContactUs;