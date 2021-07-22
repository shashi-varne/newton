import React from 'react';

const DISCLAiMER = ({
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

DISCLAiMER.Title = Title;

const Subtitle = ({ children, ...props }) => {
    return <div {...props}>{children}</div>
};

DISCLAiMER.Subtitle = Subtitle;

export default DISCLAiMER;