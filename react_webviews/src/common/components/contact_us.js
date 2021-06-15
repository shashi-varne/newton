import React, { Component } from 'react';
import { getConfig } from 'utils/functions';
class ContactUsClass extends Component {
    render() {
        return (
            <div className="success-bottom" data-aid='contact-us'>
                <div className="success-bottom1" data-aid='contact-query'>
                For any query, reach us at
                </div>
                <div className="success-bottom2">
                    <div className="success-bottom2a" data-aid='contact-mobile'>
                        {getConfig().mobile}
                    </div>
                    <div className="success-bottom2b">
                        |
                </div>
                    <div className="success-bottom2a" data-aid='contact-email'>
                        {getConfig().email}
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