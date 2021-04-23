import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../common/commonFunctions";

class NpsInvestType extends Component {
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

    onload = () => {
    }

    render() {
        return (
            <Container
                classOverRide="pr-error-container"
                fullWidthButton
                noFooter
                hideInPageTitle
                hidePageTitle
                title="Select Investment Type"
                showLoader={this.state.show_loader}
                handleClick={this.handleClick}
                classOverRideContainer="pr-container"
            >
                <div className="nfo-scheme nps-scheme">
                    <div>
                        <div className="item" ui-sref="nps-amount({ type: 'one_time' })">
                            <div className="icon">
                                <img src={require("assets/nps_sip_icon.svg")} alt="" />
                            </div>
                            <div className="text">
                                <div>Monthly Investment (SIP)</div>
                            </div>
                        </div>
                        <div className="item" ui-sref="nps-amount({ type: 'one_time' })">
                            <div className="icon">
                                <img src={require("assets/nps_one_time_icon.svg")} alt="" />
                            </div>
                            <div className="text">
                                <div>One Time Investment</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        )
    }
}

export default NpsInvestType;