import "./commonStyle.scss"
import React from 'react';
import { Imgc } from '../../common/ui/Imgc';
import WVInPageTitle from '../../common/ui/InPageHeader/WVInPageTitle';
import WVInPageSubtitle from '../../common/ui/InPageHeader/WVInPageSubtitle';

const MPinChangeSuccess = () => {
    return (
        <div className="two-fa-center-container">
            <WVInPageTitle children={"fisdom PIN changed"} />
            <Imgc
                src={require(`assets/password1.svg`)}
                alt=""
                className="img-password"
            />
            <WVInPageSubtitle children={"Safety and security ensured"} />
        </div>
    )
};

export default MPinChangeSuccess;