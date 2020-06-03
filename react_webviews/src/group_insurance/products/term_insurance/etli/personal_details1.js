import React, { Component } from 'react';
import Container from '../../../common/Container';
import Input from '../../../../common/ui/Input';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { FormControl } from 'material-ui/Form';

import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import {
    genderOptions, insuranceMaritalStatusEtli
} from './../../../constants';

import {
    isValidDate, validateAlphabets, IsFutureDate, 
    calculateAge, validateLengthDynamic
} from 'utils/validators';

import etli_logo from 'assets/etli_logo2.svg';
import { nativeCallback, openPdfCall } from 'utils/native_callback';

import TermsAndConditions from '../../../../common/ui/tnc';

class EtliPersonalDetails1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: true,
            show_loader: true,
            quote_redirect_data: window.localStorage.getItem('quote_redirect_data') ?
                JSON.parse(window.localStorage.getItem('quote_redirect_data')) : {},
            provider: 'EDELWEISS',
            type: getConfig().productName,
            basic_details_data: {
                name: '',
                dob: '',
                gender: '',
                marital_status: ''
            },
            tnc: window.localStorage.getItem('term_ins_tnc')
        };
    }

    componentWillMount() {
        nativeCallback({ action: 'take_control_reset' });
    }

    async componentDidMount() {

        let basic_details_data = this.state.basic_details_data || {};
        try {
            const res = await Api.get('/api/ins_service/api/insurance/account/summary')
            this.setState({
                show_loader: false
            });

            if (res.pfwresponse.status_code === 200) {
                const { name, dob, gender, marital_status } = res.pfwresponse.result.insurance_account;
              
                basic_details_data = {
                    name: (this.state.quote_redirect_data.name || name) || '',
                    dob: (this.state.quote_redirect_data.dob || dob) || '',
                    gender: (this.state.quote_redirect_data.gender || gender) || '',
                    marital_status: (this.state.quote_redirect_data.marital_status || marital_status) || ''
                };
                basic_details_data['dob'] = basic_details_data['dob'] ? basic_details_data['dob'].replace(/\\-/g, '/').split('-').join('/') : '';

                let mar_status = (basic_details_data.marital_status).toUpperCase();
                if(mar_status !== 'UNMARRIED' && mar_status !== 'MARRIED') {
                    basic_details_data.marital_status = '';   
                }

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

        if (name === 'checked') {
            this.setState({
                [name]: event.target.checked
            })
        }else if (name === 'dob') {
            let errorDate = '';
            if (value.length > 10) {
                return;
            }

            var input = document.getElementById('dob');

            input.onkeyup = function (event) {
                var key = event.keyCode || event.charCode;

                var thisVal;

                let slash = 0;
                for (var i = 0; i < event.target.value.length; i++) {
                    if (event.target.value[i] === '/') {
                        slash += 1;
                    }
                }

                if (slash <= 1 && key !== 8 && key !== 46) {
                    var strokes = event.target.value.length;

                    if (strokes === 2 || strokes === 5) {
                        thisVal = event.target.value;
                        thisVal += '/';
                        event.target.value = thisVal;
                    }
                    // if someone deletes the first slash and then types a number this handles it
                    if (strokes >= 3 && strokes < 5) {
                        thisVal = event.target.value;
                        if (thisVal.charAt(2) !== '/') {
                            var txt1 = thisVal.slice(0, 2) + "/" + thisVal.slice(2);
                            event.target.value = txt1;
                        }
                    }
                    // if someone deletes the second slash and then types a number this handles it
                    if (strokes >= 6) {
                        thisVal = event.target.value;

                        if (thisVal.charAt(5) !== '/') {
                            var txt2 = thisVal.slice(0, 5) + "/" + thisVal.slice(5);
                            event.target.value = txt2;
                        }
                    }
                };



            }

            basic_details_data[name] = event.target.value;
            basic_details_data[name + '_error'] = errorDate;
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
            'name': 'name',
            'dob': 'dob',
            'gender': 'gender',
            'marital_status': 'marital status'
        }

        let keys_to_check = ['name', 'dob', 'gender', 'marital_status']

        let basic_details_data = this.state.basic_details_data;
        for (var i = 0; i < keys_to_check.length; i++) {
            let key_check = keys_to_check[i];
            let first_error = key_check === 'gender' || key_check === 'marital_status' ? 'Please select ' :
                'Please enter ';
            if (!basic_details_data[key_check]) {
                basic_details_data[key_check + '_error'] = first_error + keysMapper[key_check];
            }
        }

        if (!validateAlphabets(basic_details_data.name)) {
            basic_details_data['name_error'] = 'Name can contain only alphabets';
        } else if (basic_details_data.name.split(" ").filter(e => e).length < 2) {
            basic_details_data['name_error'] = 'Enter valid full name'
        } else if (!validateLengthDynamic(basic_details_data.name, 50)) {
            basic_details_data['name_error'] = 'Maximum length of name is 50'
        } 

        if (new Date(basic_details_data.dob) > new Date() || !isValidDate(basic_details_data.dob)) {
            basic_details_data['dob_error'] = 'Please enter valid date';
        } else if (IsFutureDate(basic_details_data.dob)) {
            basic_details_data['dob_error'] = 'Future date is not allowed';
        } else if (calculateAge(basic_details_data.dob) > 65 || calculateAge(basic_details_data.dob) < 18) {
            basic_details_data['dob_error'] = 'Valid age is between 18 and 65';
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

        if (!this.state.checked) {
            //   terms 
        }

        this.setState({
            basic_details_data: basic_details_data
        })



        if (canSubmitForm) {

            let prevData = this.state.quote_redirect_data || {};
            prevData.name = basic_details_data.name;
            prevData.gender = basic_details_data.gender;
            prevData.marital_status = basic_details_data.marital_status;
            prevData.dob = basic_details_data.dob;
            window.localStorage.setItem('quote_redirect_data', JSON.stringify(prevData));

            this.setState({
                show_loader: true
            })

            this.navigate('personal-details2');

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
                "screen_name": 'personal details 1/3',
                "provider": this.state.provider,
                'name': this.state.basic_details_data.name ? 'yes' : 'no',
                'dob': this.state.basic_details_data.dob ? 'yes' : 'no',
                'gender': this.state.basic_details_data.gender  || '',
                'marital_status': this.state.basic_details_data.marital_status || ''
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    bannerText = () => {
        return (
            <span>
                Enter your personal details to get a free quote.
      </span>
        );
    }


    handleChangeRadio = name => event => {


        var basic_details_data = this.state.basic_details_data || {};

        let optionsMapper = {
            'gender': genderOptions,
            'marital_status': insuranceMaritalStatusEtli
        }
        basic_details_data[name] = optionsMapper[name][event].value;
        basic_details_data[name + '_error'] = '';

        this.setState({
            basic_details_data: basic_details_data
        })

    };


    openInBrowser() {

        this.sendEvents('tnc_clicked');
        if (!getConfig().Web) {
            this.setState({
                show_loader: true
            })
        } 

        let data = {
            url: this.state.tnc,
            header_title: 'Terms & Conditions',
            icon : 'close'
        };

        openPdfCall(data);
    }

    render() {
        let currentDate = new Date().toISOString().slice(0, 10);
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                banner={true}
                count={true}
                total={3}
                current={1}
                bannerText={this.bannerText()}
                hide_header={this.state.show_loader}
                showLoader={this.state.show_loader}
                handleClick={() => this.handleClickCurrent()}
                title='Personal details'
                classOverRideContainer="basic-details"
                buttonTitle="SAVE & CONTINUE"
                logo={etli_logo}>
                <FormControl fullWidth>
                    <div className="InputField">
                        <Input
                            type="text"
                            productType={this.state.type}
                            error={(this.state.basic_details_data.name_error) ? true : false}
                            helperText={this.state.basic_details_data.name_error}
                            width="40"
                            label="Full name"
                            class="FullName"
                            id="name"
                            name="name"
                            value={this.state.basic_details_data.name}
                            onChange={this.handleChange()} />
                    </div>
                    <div className="InputField">
                        <Input
                            type="text"
                            width="40"
                            label="Date of birth (DD/MM/YYYY)"
                            class="DOB"
                            id="dob"
                            name="dob"
                            max={currentDate}
                            error={(this.state.basic_details_data.dob_error) ? true : false}
                            helperText={this.state.basic_details_data.dob_error}
                            value={this.state.basic_details_data.dob || ''}
                            placeholder="DD/MM/YYYY"
                            maxLength="10"
                            onChange={this.handleChange()} />
                    </div>
                    <div className="InputField">
                        <RadioWithoutIcon
                            width="40"
                            label="Gender"
                            class="Gender:"
                            options={genderOptions}
                            id="gender"
                            name="gender"
                            error={(this.state.basic_details_data.gender_error) ? true : false}
                            helperText={this.state.basic_details_data.gender_error}
                            value={this.state.basic_details_data.gender || ''}
                            onChange={this.handleChangeRadio('gender')} />
                    </div>

                    <div className="InputField">
                        <RadioWithoutIcon
                            width="40"
                            label="Marital status"
                            class="Marital status:"
                            options={insuranceMaritalStatusEtli}
                            id="marital-status"
                            name="marital_status"
                            error={(this.state.basic_details_data.marital_status_error) ? true : false}
                            helperText={this.state.basic_details_data.marital_status_error}
                            value={this.state.basic_details_data.marital_status || ''}
                            onChange={this.handleChangeRadio('marital_status')} />
                    </div>
                </FormControl>

                <TermsAndConditions parent={this} />
            </Container>
        );
    }
}

export default EtliPersonalDetails1;