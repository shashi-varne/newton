import "./commonStyles.scss";
import React, { useMemo } from 'react';
import Container from "../../common/Container";
import { Imgc } from '../../../common/ui/Imgc';
import { storageService } from "utils/validators";
import { nativeCallback } from "../../../utils/native_callback";
import { getConfig, navigate as navigateFunc } from "../../../utils/functions";

const SecuritySettings = (props) => {
    const user = storageService().getObject("user") || {};
    const config = getConfig();
    const navigate = navigateFunc.bind(props);
    const isPinSet = user.pin_status === 'pin_setup_complete';
    const [navigatePath, pinText] = useMemo(() => {
        if (isPinSet) {
            return ["/reset-pin-verify", `Reset ${config.productName} PIN`];
        }
        return ["/set-fisdom-pin", `Set ${config.productName} PIN`];
    }, [isPinSet]);

    const sendEvents = (user_action) => {
        let eventObj = {
            "event_name": '2fa',
            "properties": {
                "user_action": user_action,
                "screen_name": 'security_settings',
                "type": isPinSet ? "reset_fisdom_pin" : "set_fisdom_pin",
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    };

    const onClick = () => {
        navigate(navigatePath);
        sendEvents("next");
    }

    const goBack = () => {
        sendEvents('back');
        navigate('/my-account');
    }

    return (
        <Container
            title="Security settings"
            events={sendEvents('just_set_events')}
            data-aid='my-account-screen'
            noFooter={true}
            headerData={{ goBack }}
        >
            <div className="security-settings">
                <Imgc
                    src={require(`assets/group_12.svg`)}
                    alt=""
                    className="img-center bottom-space"
                />
                <div
                    data-aid='security-setting'
                    className="account-options"
                    onClick={onClick}
                >
                    <Imgc
                        src={require(`assets/padlock1.svg`)}
                        alt=""
                        className="padlock-imgc"
                    />
                    <div>{pinText}</div>
                </div>
            </div>

        </Container>
    )
};

export default SecuritySettings;