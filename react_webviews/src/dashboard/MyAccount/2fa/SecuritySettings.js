import "./commonStyles.scss";
import React, { useState, useEffect } from 'react';
import Container from "../../common/Container";
import { Imgc } from '../../../common/ui/Imgc';
import { storageService } from "utils/validators";
import { navigate as navigateFunc } from "../../../utils/functions";

const SecuritySettings = (props) => {
    const navigate = navigateFunc.bind(props);
    const [showLoader, setShowLoader] = useState(false);
    const [pinText, setPinText] = useState("Set fisdom PIN")

    useEffect(() => {
        let user = storageService().getObject("user") || {};
        if (user.pin_status === 'pin_setup_complete') {
            setPinText("Reset fisdom PIN")
        }
    }, []);

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
                    <div>{pinText}</div>
                </div>
            </div>

        </Container >
    )
};

export default SecuritySettings;