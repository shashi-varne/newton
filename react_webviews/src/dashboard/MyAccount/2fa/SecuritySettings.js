import "./commonStyles.scss";
import React, { useState, useEffect } from 'react';
import Container from "../../common/Container";
import { Imgc } from '../../../common/ui/Imgc';
import { storageService } from "utils/validators";
import { nativeCallback } from "../../../utils/native_callback";
import { navigate as navigateFunc } from "../../../utils/functions";

const SecuritySettings = (props) => {
    const navigate = navigateFunc.bind(props);
    const [pinText, setPinText] = useState("Set fisdom PIN");
    const navigatePath = pinText === "Reset fisdom PIN" ? "/reset-pin-verify" : "/set-fisdom-pin";

    useEffect(() => {
        let user = storageService().getObject("user") || {};
        if (user.pin_status === 'pin_setup_complete') {
            setPinText("Reset fisdom PIN")
        }
    }, []);

    const sendEvents = (user_action) => {
        let eventObj = {
            "event_name": 'portfolio',
            "properties": {
                "user_action": user_action,
                "screen_name": 'securtity_settings',
                "biometric_enabled": "no",
                "type": pinText,
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    };
    
    return (
        <Container
            events={sendEvents('just_set_events')}
            data-aid='my-account-screen'
            noFooter={true}
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
                    onClick={() => {
                        navigate(navigatePath);
                        sendEvents("next");
                    }}
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