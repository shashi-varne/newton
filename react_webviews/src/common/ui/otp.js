import React, { Component } from 'react';
import './style.css';
import OtpInput from 'react-otp-input';
import { getConfig } from 'utils/functions';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


class OtpDefaultClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countdownInterval: null,
            timeAvailable: this.props.parent.state.timeAvailable,
            totalTime: this.props.parent.state.totalTime
        };

        this.resendOtp  =this.resendOtp.bind(this);

    }

    componentWillUnmount() {
        clearInterval(this.state.countdownInterval);
    }

    resendOtp() {

        let intervalId = setInterval(this.countdown, 1000);

        this.setState({
            timeAvailable: this.state.totalTime,
            countdownInterval: intervalId
        });
        this.props.parent.resendOtp();
    }


    componentDidMount() {
        var inputs = document.getElementsByTagName('input');
        for (var index = 0; index < inputs.length; ++index) {
            inputs[index].placeholder = 'X';
        }

        let intervalId = setInterval(this.countdown, 1000);
        this.setState({
            countdownInterval: intervalId
        });
    }

    countdown = () => {
        let timeAvailable = this.state.timeAvailable;

        timeAvailable--;
        let timeAvailablePercantage = (timeAvailable / this.state.totalTime) * 100;
        if (timeAvailable <= 0) {
            timeAvailable = 0;
            clearInterval(this.state.countdownInterval);
        }


        this.setState({
            timeAvailable: timeAvailable,
            timeAvailablePercantage: timeAvailablePercantage
        })
    };

    render() {
        return (
            <div>
                <div>
                    <OtpInput
                        numInputs={4}
                        id="default-otp"
                        containerStyle="default-otp-input-container"
                        inputStyle="default-otp-input"
                        onChange={this.props.parent.handleOtp}
                        hasErrored={true}
                        placeholder="X"
                        value={this.props.parent.state.otp}
                    //   separator={<span>-</span>}
                    />
                </div>

                { this.state.timeAvailable > 0 && 
                        <div style={{ display: 'flex', alignItems: 'center',justifyContent: 'center',
                         margin: '30px 0 0 0px'  }}>
                        
                        <CircularProgressbar value={this.state.timeAvailablePercantage}
                            // text={`${this.state.timeAvailable}`} 
                        />

                        <div style={{ color: getConfig().primary, margin: '0 0 0 10px' }}>
                            00:{this.state.timeAvailable}
                        </div>
                  
                        </div>
                }

               {(this.state.timeAvailable <= 0 || !this.state.timeAvailable) && 
               <div style={{ margin: '30px 0 0 -10px' }}>
                        <div onClick={this.resendOtp} 
                        style={{ color: '#4A494A', margin: '0 0 0 10px',
                        fontSize: 14 }}>
                        Didn’t receive? <span style={{ color: getConfig().primary, fontWeight: 500}}>Resend OTP</span>
                    </div>
                </div>}
            </div>
        );
    }
};

const OtpDefault = (props) => (
    <OtpDefaultClass
        {...props} />
);

export default OtpDefault;
