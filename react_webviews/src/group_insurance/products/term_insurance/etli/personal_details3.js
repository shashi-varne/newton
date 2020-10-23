import React, { Component } from 'react';
import Container from '../../../common/Container';
import Input from '../../../../common/ui/Input';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { FormControl } from 'material-ui/Form';

import MobileInputWithoutIcon from '../../../../common/ui/MobileInputWithoutIcon';
import LoaderModal from '../../../common/Modal';

import {
    validateEmail, validateNumber, numberShouldStartWith,
    open_browser_web
} from 'utils/validators';

import etli_logo from 'assets/etli_logo2.svg';
import { nativeCallback } from 'utils/native_callback';


class EtliPersonalDetails3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            show_loader: true,
            openModal:false,
            quote_redirect_data: window.sessionStorage.getItem('quote_redirect_data') ?
                JSON.parse(window.sessionStorage.getItem('quote_redirect_data')) : {},
            type: getConfig().productName,
            basic_details_data: {
                email: '',
                mobile_no: ''
            },
            provider: 'EDELWEISS',
            productTitle: 'Edelweiss Tokio Life Zindagi Plus',
            productName: getConfig().productName
        };
    }

    componentWillMount() {
        nativeCallback({ action: 'take_control_reset' });
        let current_url = window.location.href;

        this.setState({
            current_url: current_url
        })
    }

    async componentDidMount() {

        let basic_details_data = this.state.basic_details_data || {};
        try {
            const res = await Api.get('/api/ins_service/api/insurance/account/summary')
            this.setState({
                show_loader: false
            });

            if (res.pfwresponse.status_code === 200) {
                const { email, mobile_number } = res.pfwresponse.result.insurance_account;
                basic_details_data = {
                    email: (this.state.quote_redirect_data.email || email) || '',
                    mobile_no: (this.state.quote_redirect_data.mobile_no || mobile_number) || ''
                };

                this.setState({
                    basic_details_data: basic_details_data
                })

            } else if (res.pfwresponse.status_code === 401) {

            } else {
                toast(res.pfwresponse.result.error || res.pfwresponse.result.message
                    || 'Something went wrong');
            }


        } catch (err) {
            this.setState({
                show_loader: false
            });
            toast('Something went wrong');
        }
    }

    handleChange = name => event => {
        if (!name) {
            name = event.target.name;
        }
        var value = event.target ? event.target.value : '';
        var basic_details_data = this.state.basic_details_data || {};

        if (name === 'mobile_no') {
            if (value.length <= 10) {
                basic_details_data[name] = value;
                basic_details_data[name + '_error'] = '';
            }
        } else {
            basic_details_data[name] = value;
            basic_details_data[name + '_error'] = '';
        }


        this.setState({
            basic_details_data: basic_details_data
        })

    };


    async handleClickCurrent() {


        this.sendEvents('next');
        let keysMapper = {
            'email': 'email',
            'mobile_no': 'mobile number',
        }

        let keys_to_check = ['email', 'mobile_no']

        let basic_details_data = this.state.basic_details_data;
        for (var i = 0; i < keys_to_check.length; i++) {
            let key_check = keys_to_check[i];
            let first_error = 'Please enter ';
            if (!basic_details_data[key_check]) {
                basic_details_data[key_check + '_error'] = first_error + keysMapper[key_check];
            }
        }


        if (this.state.basic_details_data.email.length < 10 ||
            !validateEmail(this.state.basic_details_data.email)) {
            basic_details_data['email_error'] = 'Please enter valid email';
        }

        if (this.state.basic_details_data.mobile_no.length !== 10 || !validateNumber(this.state.basic_details_data.mobile_no) ||
            !numberShouldStartWith(this.state.basic_details_data.mobile_no)) {
            basic_details_data['mobile_no_error'] = 'Please enter valid mobile no';

        }

        let canSubmitForm = true;
        for (var key in basic_details_data) {
            if (key.indexOf('error') >= 0) {
                if (basic_details_data[key]) {
                    canSubmitForm = false;
                    break;
                }
            }
        }

        this.setState({
            basic_details_data: basic_details_data
        })

        if (canSubmitForm) {

            let prevData = this.state.quote_redirect_data || {};
            prevData.email = basic_details_data.email;
            prevData.mobile_no = basic_details_data.mobile_no;

            window.sessionStorage.setItem('quote_redirect_data', JSON.stringify(prevData));

            this.setState({
                show_loader: true
            })


            try {
                let openModalMessage = 'Redirecting to Edelweiss tokio life';
                this.setState({ openModal: true, openModalMessage: openModalMessage });


                var leadCreateBody = {
                    name: prevData.name,
                    dob: prevData.dob,
                    marital_status: prevData.marital_status,
                    mobile_no: prevData.mobile_no,
                    email: prevData.email,
                    gender: prevData.gender,
                    annual_income: prevData.annual_income,
                    tobacco_choice: prevData.smoking,
                };

                const res = await Api.post('/api/ins_service/api/insurance/edelweiss' +
                    '/lead/create', leadCreateBody);

                if (res.pfwresponse.status_code === 200) {

                    var leadRedirectUrl = res.pfwresponse.result.lead;
                    if (getConfig().app === 'web') {
                        this.setState({
                            show_loader: false,
                            openModal: false,
                            openModalMessage: ''
                        });

                        open_browser_web(leadRedirectUrl, '_blank');
                    } else {

                        if (getConfig().app === 'ios') {
                            nativeCallback({
                                action: 'show_top_bar', message: {
                                    title: this.state.productTitle
                                }
                            });
                        }

                        nativeCallback({
                            action: 'take_control', message: {
                                back_url: this.state.current_url,
                                show_top_bar: false,
                                back_text: "We recommend you to finish the application process. In case you have done the payment, Edelweiss team will call you soon. Do you want to exit?"
                            },

                        });
                        nativeCallback({ action: 'show_top_bar', message: { title: this.state.productTitle } });

                        window.location.href = leadRedirectUrl;
                    }

                } else {
                    this.setState({
                        show_loader: false, openModal: false,
                        openModalMessage: ''
                    });

                    let errors = res.pfwresponse.result.error || [];
                    for(var j =0; j < errors.length; j++) {
                        toast(errors[j].error || 'Something went wrong');
                    }

                    toast(res.pfwresponse.result.error || 'Something went wrong');
                }
            } catch (err) {
                this.setState({
                    show_loader: false
                });
                toast('Something went wrong');
            }
        }

    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'term_insurance',
            "properties": {
                "user_action": user_action,
                "screen_name": 'personal details 3/3',
                "provider": this.state.provider,
                'email': this.state.basic_details_data.email ? 'yes' : 'no',
                'mobile_number': this.state.basic_details_data.mobile_no ? 'yes' : 'no'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    renderModal = () => {
        return (
            <LoaderModal 
                open={this.state.openModal}
                message={this.state.openModalMessage}
            />
        );
    };

    render() {
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                count={true}
                total={3}
                current={3}
                hide_header={this.state.show_loader}
                showLoader={this.state.show_loader}
                handleClick={() => this.handleClickCurrent()}
                title='Personal details'
                classOverRideContainer="basic-details"
                buttonTitle="CHECK QUOTE"
                logo={etli_logo}>
                <FormControl fullWidth>
                    <div className="InputField">
                        <Input
                            error={(this.state.basic_details_data.email_error) ? true : false}
                            helperText={this.state.basic_details_data.email_error}
                            type="email"
                            width="40"
                            label="Email address"
                            class="Email"
                            id="email"
                            name="email"
                            value={this.state.basic_details_data.email}
                            onChange={this.handleChange()} />
                    </div>
                    <div className="InputField">
                        <MobileInputWithoutIcon
                            error={(this.state.basic_details_data.mobile_no_error) ? true : false}
                            helperText={this.state.basic_details_data.mobile_no_error}
                            type="number"
                            width="40"
                            label="Mobile number"
                            class="Mobile"
                            maxLength="10"
                            id="number"
                            name="mobile_no"
                            value={this.state.basic_details_data.mobile_no}
                            onChange={this.handleChange()} />
                    </div>
                </FormControl>
                {this.renderModal()}
            </Container>
        );
    }
}

export default EtliPersonalDetails3;