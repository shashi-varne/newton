import React, { Component } from 'react';
import Container from '../../../common/Container';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { FormControl } from 'material-ui/Form';

import qs from 'qs';
import loader_fisdom from 'assets/loader_gif_fisdom.gif';
import loader_myway from 'assets/loader_gif_myway.gif';

import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import {
    smokingOptions
} from './../../../constants';

import DropdownWithoutIcon from '../../../../common/ui/SelectWithoutIcon';

import etli_logo from 'assets/etli_logo2.svg';
import { nativeCallback } from 'utils/native_callback';

const annual_income_options = [
    {name:'3-5 lakhs', value: '3-5'},
    {name: '5-10 lakhs', value: '5-10'},
    {name: '10-15 lakhs', value: '10-15'},
    {name: '15-20 lakhs', value: '15-20'},
    {name: 'Above 20 lakhs', value: '20-above'}
]

class EtliPersonalDetails2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            show_loader: true,
            quote_redirect_data: window.sessionStorage.getItem('quote_redirect_data') ?
                JSON.parse(window.sessionStorage.getItem('quote_redirect_data')) : {},
            provider: 'EDELWEISS',
            params: qs.parse(this.props.history.location.search.slice(1)),
            type: getConfig().productName,
            loaderMain: getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom,
            basic_details_data: {
                annual_income: '',
                smoking: ''
            }
        };
    }

    async componentDidMount() {

        let basic_details_data = this.state.basic_details_data || {};
        try {
            const res = await Api.get('/api/ins_service/api/insurance/account/summary')
            this.setState({
                show_loader: false
            });

            if (res.pfwresponse.status_code === 200) {
                const { annual_income, smoking } = res.pfwresponse.result.insurance_account;
                basic_details_data = {
                    annual_income: (this.state.quote_redirect_data.annual_income || annual_income) || '',
                    smoking: (this.state.quote_redirect_data.smoking || smoking) || ''
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
        var value = event.target ? event.target.value :  '';
        if(name === 'annual_income') {
            value = event;
        }
        var basic_details_data = this.state.basic_details_data || {};

        basic_details_data[name] = value;
        basic_details_data[name + '_error'] = '';

        this.setState({
            basic_details_data: basic_details_data
        })

    };


    async handleClickCurrent() {


        this.sendEvents('next');
        let keysMapper = {
            'annual_income': 'annual income',
            'smoking': 'smoking option'
        }

        let keys_to_check = ['annual_income', 'smoking']

        let basic_details_data = this.state.basic_details_data;
        for (var i = 0; i < keys_to_check.length; i++) {
            let key_check = keys_to_check[i];
            let first_error = key_check === 'smoking' || key_check === 'annual_income' ? 'Please select ' :
                'Please enter ';
            if (!basic_details_data[key_check]) {
                basic_details_data[key_check + '_error'] = first_error + keysMapper[key_check];
            }
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
            prevData.smoking = basic_details_data.smoking;
            prevData.annual_income = basic_details_data.annual_income;
            window.sessionStorage.setItem('quote_redirect_data', JSON.stringify(prevData));

            this.setState({
                show_loader: true
            })

            this.navigate('personal-details3');

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
                "screen_name": 'personal details 2/3',
                "provider": this.state.provider,
                'yearly_salary': this.state.basic_details_data.annual_income || '',
                'smoke': this.state.basic_details_data.smoking || ''
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleChangeRadio = name => event => {

        var basic_details_data = this.state.basic_details_data || {};

        let optionsMapper = {
            'smoking': smokingOptions
        }
        basic_details_data[name] = optionsMapper[name][event].value;
        basic_details_data[name + '_error'] = '';

        this.setState({
            basic_details_data: basic_details_data
        })

    };


    render() {
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                count={true}
                total={3}
                current={2}
                showLoader={this.state.show_loader}
                handleClick={() => this.handleClickCurrent()}
                title='Personal details'
                classOverRideContainer="basic-details"
                buttonTitle="SAVE & CONTINUE"
                logo={etli_logo}>
                <FormControl fullWidth>

                    <div className="InputField">
                        <DropdownWithoutIcon
                            error={(this.state.basic_details_data.annual_income_error) ? true : false}
                            helperText={this.state.basic_details_data.annual_income_error}
                            width="40"
                            options={annual_income_options}
                            dataType="AOB"
                            label="Yearly salary"
                            class="Education"
                            id="annual_income"
                            name="annual_income"
                            value={this.state.basic_details_data.annual_income}
                            onChange={this.handleChange('annual_income')} />
                    </div>
                    <div className="InputField">
                        <RadioWithoutIcon
                            width="40"
                            label="Do you smoke?"
                            class="smoking:"
                            options={smokingOptions}
                            id="smoking"
                            name="smoking"
                            error={(this.state.basic_details_data.smoking_error) ? true : false}
                            helperText={this.state.basic_details_data.smoking_error}
                            value={this.state.basic_details_data.smoking || ''}
                            onChange={this.handleChangeRadio('smoking')} />
                    </div>

                </FormControl>
            </Container>
        );
    }
}

export default EtliPersonalDetails2;