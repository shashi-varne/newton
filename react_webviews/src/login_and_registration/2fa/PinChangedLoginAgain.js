import "./commonStyle.scss"
import React, { Component } from 'react';
import LoginContainer from "../Login/LoginContainer"
import { Imgc } from '../../common/ui/Imgc';
import WVInPageTitle from '../../common/ui/InPageHeader/WVInPageTitle';
import WVInPageSubtitle from '../../common/ui/InPageHeader/WVInPageSubtitle';
import WVButton from "../../common/ui/Button/WVButton";
import { getConfig, navigate as navigateFunc } from "utils/functions";


const config = getConfig();
const isMobileView = config.isMobileDevice;

class PinChangedLoginAgainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
        }
        this.navigate = navigateFunc.bind(this.props);
    }

    handleClick = (route) => {
        this.navigate(route);
    };


    render() {
        return (
            <LoginContainer>
                <div className="two-fa-center-container">
                    <WVInPageTitle children={"fisdom PIN changed"} />
                    <Imgc
                        src={require(`assets/password1.svg`)}
                        alt=""
                        className="img-password"
                    />
                    <WVInPageSubtitle children={"Safety and security ensured"} />
                    <WVButton
                        variant='contained'
                        size='large'
                        color="secondary"
                        onClick={() => this.handleClick("/login")}
                        disabled={false}
                        showLoader={false}
                        fullWidth
                        className={isMobileView ? "login-otp-button login-otp-button-mobile" : "login-otp-button login-otp-button-web"}
                    >
                        LOG IN again
                    </WVButton>
                </div>
            </LoginContainer>
        )
    }
};


const PinChangedLoginAgain = (props) => {
    return (<PinChangedLoginAgainPage {...props} />)
}


export default PinChangedLoginAgain;