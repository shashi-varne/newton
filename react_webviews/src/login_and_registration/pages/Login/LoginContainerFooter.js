import React from 'react';

const DISCLAIMER = ({
    props = {},
    title = '',
    subtitle = '',
    children
}) => {
    return (
        <div className="login-footer">

            {title &&
                <Title className="lg-title">
                    {title}
                </Title>
            }
            {subtitle &&
                <Subtitle className="lg-subtitle">
                    {subtitle}
                </Subtitle>
            }
            {children}
        </div>
    );
}


const Title = ({ children, ...props }) => {
    return <div {...props}>{children}</div>
};

DISCLAIMER.Title = Title;

const Subtitle = ({ children, ...props }) => {
    return <div {...props}>{children}</div>
};

DISCLAIMER.Subtitle = Subtitle;

export default DISCLAIMER;