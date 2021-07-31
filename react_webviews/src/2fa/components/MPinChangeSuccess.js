import "./commonStyles.scss"
import React from 'react';
import { Imgc } from '../../common/ui/Imgc';
import WVInPageTitle from '../../common/ui/InPageHeader/WVInPageTitle';
import WVInPageSubtitle from '../../common/ui/InPageHeader/WVInPageSubtitle';

const MPinChangeSuccess = (props) => {
    return (
        <div className="twofa-mpin-change-success">
            <WVInPageTitle children={"fisdom PIN changed"} />
            <Imgc
                src={require(`assets/password1.svg`)}
                alt=""
                className="img-password"
            />
            <WVInPageSubtitle children={"Safety and security ensured"} />
            {props.children}
        </div>
    )
};

export default MPinChangeSuccess;