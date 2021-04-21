import React, { Component } from 'react';
import Container from '../../common/Container';

import { nativeCallback } from 'utils/native_callback';

import Api from 'utils/api';
import { initialize } from '../../common/functions';
import toast from '../../../common/ui/Toast';
import RadioOptions from '../../../common/ui/RadioOptions';
import { FormControl } from 'material-ui/Form';
import DotDotLoader from '../../../common/ui/DotDotLoader';
import { storageService } from 'utils/validators';
import { getConfig } from 'utils/functions';


class FormCreateProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step1: '1',
            dmi_loan_status: storageService().get('loan_dmi_loan_status') || '',
            application_id: storageService().get('loan_application_id'),
            show_loader:true,
            count: 0
        }

        this.initialize = initialize.bind(this);
    }



    componentWillMount() {
        

        let { params } = this.props.location;
        if (!params) {
            params = {};
        }

        if (!params || !params.fromSummary) {

            this.props.history.goBack();
            return;
        }

        this.setState({
            show_loader:false
        })

        this.initialize();

    }

    onload = () => {
        if (this.state.dmi_loan_status === 'contact') {
            this.triggerOtp();
        } else {
            this.getDedupeCallback();
        }

    }

    getDedupeCallback = async () => {
        try {

            let body = {
                "request_type": "dedupe_match"
            }
            let res = await Api.post(`/relay/api/loan/dmi/callback/get/status/${this.state.application_id}`, body);
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200 && !resultData.error) {

                let { count } = this.state;

                if (!resultData.callback_status) {
                    
                    if (count < 20) {
                        this.setState({
                            count: count + 1
                        })

                        this.getDedupeCallback();
                        
                    } else {
                        let searchParams = getConfig().searchParams + '&status=sorry';
                        this.navigate('instant-kyc-status', { searchParams: searchParams });
                    }
                }
                
                

                if (resultData.callback_status) {
                    if (resultData.dedupe_match) {
                        let searchParams = getConfig().searchParams + '&status=loan_not_eligible';
                        this.navigate('instant-kyc-status', { searchParams: searchParams });
                    } else {
                        this.createContact();
                    }
                }
            } else {
                this.setState({
                    show_loader: false
                });
                toast(resultData.error || resultData.message
                    || 'Something went wrong');
                this.props.history.goBack();
            }

        } catch (err) {
            console.log(err)
            this.setState({
                show_loader: false
            });
            toast('Something went wrong');
        }
    }



    createContact = async () => {
        try {

            let res = await Api.get(`/relay/api/loan/dmi/create/contact/${this.state.application_id}`);

            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200 && !resultData.error) {
                this.triggerOtp();

            } else {
                this.setState({
                    show_loader: false,
                    creating_contact_failed: true
                });
                toast(resultData.error || resultData.message
                    || 'Something went wrong');
                this.props.history.goBack();
            }
        } catch (err) {
            console.log(err)
            this.setState({
                show_loader: false
            });
            toast('Something went wrong');
            this.props.history.goBack();
        }
    }

    triggerOtp = async () => {
        try {

            let res = await Api.get(`/relay/api/loan/dmi/trigger_otp/${this.state.application_id}`);

            var result = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200 && !result.error) {
                if (result.resend_otp_url !== '' && result.verify_otp_url !== '') {

                    var message = 'An OTP is sent to your mobile number ' + result.mobile_no + '.  Enter OTP to verify and submit loan application.'
                    this.props.history.push({
                        pathname: 'form-otp',
                        search: getConfig().searchParams,
                        params: {
                            resend_link: result.resend_otp_url,
                            verify_link: result.verify_otp_url,
                            message: message,
                            mobile_no: result.mobile_no,
                            next_state: 'instant-kyc'
                        }
                    });
                    toast(message);
                }

            } else {
                this.setState({
                    show_loader: false
                });
                toast(result.error || result.message
                    || 'Something went wrong');
                this.props.history.goBack();
            }
        } catch (err) {
            console.log(err)
            this.setState({
                show_loader: false
            });
            toast('Something went wrong');
        }
    }



    sendEvents(user_action) {
        let eventObj;
        if (this.state.creating_contact_failed) {
            eventObj = {
                "event_name": 'lending',
                "properties": {
                    "user_action": user_action,
                    "screen_name": 'Sorry',
                    "stage": 'creating contact failed'
                }
            }
        } else {
            eventObj = {
                "event_name": 'lending',
                "properties": {
                    "user_action": user_action,
                    "screen_name": 'creating profile',
                }
            };
        }


        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    render() {
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title=""
                buttonTitle="CONTINUE"
                noFooter={true}
                headerData={{
                    hide_icon: true
                }}
                handleClick={() => this.handleClick()}
            >
                <div >
                    <div style={{margin: '0 0 30px 0', textAlign: 'center'}}>
                        {this.state.productName && 
                        <img src={require(`assets/${this.state.productName}/update_mobile.svg`)} alt="" />}
                    </div>


                    <div style={{ color: '#6d7278', fontSize: 13 }}>
                        Please wait while we create your profile. An OTP will be sent to your mobile no. shortly.
                    </div>
                </div>

                <FormControl fullWidth>
                    <div className="InputField" style={{ margin: '0px 0px -20px 0px' }}>
                        <RadioOptions
                            width="40"
                            label=""
                            class="MaritalStatus"
                            options={[
                                {
                                    name: 'Creating your profile',
                                    value: '1'
                                }
                            ]}
                            color={getConfig().styles.primaryColor}
                            value={this.state.step1 || ''}
                            onChange={() => { }} />
                    </div>
                    <div className="InputField" style={{ margin: '0 0 -30px 0' }}>
                        <RadioOptions
                            width="40"
                            disabled={true}
                            label=""
                            class="MaritalStatus"
                            options={[
                                {
                                    name: 'Generating OTP',
                                    value: '1'
                                }
                            ]}
                            color={getConfig().styles.primaryColor}
                            value={this.state.step2 || ''}
                            onChange={() => { }} />
                    </div>

                </FormControl>
                <DotDotLoader style={{
                    textAlign: 'left',
                    margin: '20px 0 0 0'
                }}
                />
            </Container>
        );
    }
}

export default FormCreateProfile;