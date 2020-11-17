import React, {Component} from "react";
import Container from "../../common/Conatiner";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Card from "../../../common/ui/Card";
import { getConfig } from "utils/functions";

class UploadDocuments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: false,
        };

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    onload = () => {};

    handleClick = () => {};

    sendEvents(user_action, data = {}) {
        let eventObj = {
            event_name: "lending",
            properties: {
                user_action: user_action,
                screen_name: "upload_doc"
            },
        };

        if (user_action === "just_set_events") {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    render() {
        return (
            <Conatiner
                showLoader={this.state.show_loader}
                title="Upload documents"
            >

            </Conatiner>
        )
    }
}