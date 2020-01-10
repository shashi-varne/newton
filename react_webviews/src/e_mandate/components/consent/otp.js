import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import { getConfig } from 'utils/functions';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';

import OtpDefault from '../../../common/ui/otp';


class eMandateOtpClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show_loader: false,
            otp: '',
            timeAvailable: 30,
            totalTime: 30,
            otpBaseData: {},
            pc_urlsafe: getConfig().pc_urlsafe
        };
    }

    async componentDidMount() {

        this.setState({
            show_loader: true
        })
        try {
            const res = await Api.post('/page/mandate/auto/debit/consent/' + this.state.pc_urlsafe + '/otp');
            this.setState({
                show_loader: false
            })

            if (res.pfwresponse.result && !res.pfwresponse.result.error) {
                this.setState({
                    otpBaseData: res.pfwresponse.result
                })
            } else {
                toast(res.pfwresponse.result.error ||
                    res.pfwresponse.result.message || 'Something went wrong', 'error');
            }


        } catch (err) {
            this.setState({
                show_loader: false
            })
            toast("Something went wrong");
        }
    }


    handleClick = async () => {

        if (!this.state.otp) {
            this.setState({
                otp_error: 'Please enter OTP'
            })
            return;
        }

        if (this.state.otp.length !== 4) {
            this.setState({
                otp_error: 'OTP is a 4 digit number'
            })
            return;
        }

        if (!this.state.otpBaseData || !this.state.otpBaseData.verify_url) {
            toast('Something went wrong');
            return;
        }
        let url = getConfig().base_url + '/' + this.state.otpBaseData.verify_url +
            '?otp=' + this.state.otp;

        try {
            this.setState({
                show_loader: true
            })
            const res = await Api.get(url);
            this.setState({
                show_loader: false
            })
            if (res.pfwresponse.status_code === 200) {


                let result = res.pfwresponse.result;
                if (result.message === 'success') {
                    this.navigate('/e-mandate/select-bank', result.urlsafe);
                } else {
                    this.setState({
                        otpVerified: false,
                        openResponseDialog: true,
                        apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
                    });
                }

            } else {
                this.setState({
                    show_loader: false
                });
                toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
            }
        } catch (err) {
            this.setState({
                show_loader: false
            });
            toast('Something went wrong', 'error');
        }
    }

    navigate = (pathname, urlsafe) => {

        let search = getConfig().searchParams;

        if (urlsafe) {
            search += '&pc_urlsafe=' + urlsafe
        }
        this.props.history.push({
            pathname: pathname,
            search: search
        });
    }

    handleOtp = (otp) => {
        this.setState({
            otp: otp,
            otp_error: ''
        })
    }


    resendOtp = async () => {

        this.setState({
            show_loader: true,
            otp_error: '',
            otp: '',
            timeAvailable: this.state.totalTime
        })
        try {
            const res = await Api.get(this.state.otpBaseData.resend_otp_url);
            this.setState({
                show_loader: false
            })

            if (res.pfwresponse.result) {

            } else {
                toast(res.pfwresponse.result.error ||
                    res.pfwresponse.result.message || 'Something went wrong', 'error');
            }


        } catch (err) {
            this.setState({
                show_loader: false
            })
            toast("Something went wrong");
        }
    }

    render() {
        return (
            <Container
                fullWidthButton={true}
                buttonTitle='Verify OTP'
                onlyButton={true}
                showLoader={this.state.show_loader}
                handleClick={() => this.handleClick()}
                classOverRideContainer="payment-failed"
            >
                <div className="default-otp">

                    <div className="title">
                        Enter OTP to verify
                    </div>
                    <div className="content">
                    We have send the OTP on <span className="content-auth"> +91-7400190682, </span>
                        please enter to activate easySIP
                         {/* {this.state.otpBaseData.mobile_number} */}
                    </div>

                    <OtpDefault parent={this} />
                    {this.state.otp_error &&
                        <div style={{ color: 'red', margin: '14px 0 0 0' }}>{this.state.otp_error}</div>}
                </div>
            </Container>
        );
    }
}

export default eMandateOtpClass;