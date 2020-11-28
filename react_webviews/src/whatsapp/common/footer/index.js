import React from 'react';

import { DefaultLayout } from './layout';

const Footer = (props) => {
    return (
        <div className="Footer">
            <DefaultLayout type="default" {...props} />
        </div>
    )
}

export default Footer;