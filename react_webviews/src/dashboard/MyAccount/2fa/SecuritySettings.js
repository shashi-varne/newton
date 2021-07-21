import "./commonStyles.scss";
import React, { useState } from 'react';
import Container from "../../common/Container";
import { Imgc } from '../../../common/ui/Imgc';
import { navigate as navigateFunc } from "../../../utils/functions";

const SecuritySettings = (props) => {
    const navigate = navigateFunc.bind(props);
    const [showLoader, setShowLoader] = useState(false);

    return (
        <Container
            data-aid='my-account-screen'
            noFooter={true}
            skelton={showLoader}
        >
            <div className="security-settings">
                <>
                    <Imgc
                        src={require(`assets/group_12.svg`)}
                        alt=""
                        className="img-center bottom-space" />
                </>
                <div
                    data-aid='security-setting'
                    className="account-options"
                    onClick={() => navigate("/reset-pin-verify")}
                >
                    <Imgc
                        src={require(`assets/padlock1.svg`)}
                        alt=""
                    />
                    <div>Set Fisdom PIN</div>
                </div>
            </div>

        </Container >
    )
};

export default SecuritySettings;