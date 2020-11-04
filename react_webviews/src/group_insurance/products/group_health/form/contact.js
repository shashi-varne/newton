import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';

import MobileInputWithoutIcon from '../../../../common/ui/MobileInputWithoutIcon';
import {validateEmail, numberShouldStartWith, validateNumber } from 'utils/validators';
import Input from '../../../../common/ui/Input';
import { initialize, updateLead } from '../common_data';
import ConfirmDialog from './../plans/confirm_dialog';
class GroupHealthPlanContactDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            form_data: {},
            ctaWithProvider: true,
            get_lead: true,
            next_state: 'address',
            screen_name: 'contact_screen'
        }
        this.initialize = initialize.bind(this);
        this.updateLead = updateLead.bind(this);
    }


    componentWillMount() {
        this.initialize();
    }

    onload = () => {

        if(this.props.edit) {
            this.setState({
                next_state : `/group-insurance/group-health/${this.state.provider}/final-summary`
            })
        }

        let lead = this.state.lead;   console.log(lead)
        let form_data = {
            email: lead.buyer_details.email || '',
            mobile_number: lead.buyer_details.phone_number || ''
        };


        this.setState({
            form_data: form_data,
            lead: lead,
        })

        this.setState({
            bottomButtonData: {
                ...this.state.bottomButtonData,
                handleClick: this.handleClick
            }
        })
    }

    handleChange = name => event => {

        if (!name) {
            name = event.target.name;
        }
        var value = event.target ? event.target.value : '';
        var form_data = this.state.form_data || {};

        if (name === 'mobile_number') {
            if (value.length <= 10) {
                form_data[name] = value;
                form_data[name + '_error'] = '';
            }
        } else {
            form_data[name] = value;
            form_data[name + '_error'] = '';
        }


        this.setState({
            form_data: form_data
        })

    };

    handleClose = () => {
        this.setState({
            openConfirmDialog: false
        });

    }
    handleClick2 = () => {
        this.setState({
            openConfirmDialog: true,
        })
    }

    handleClick = async () => {

        this.sendEvents('next');
        let keysMapper = {
            'email': 'email',
            'mobile_number': 'mobile number',
        }

        let keys_to_check = ['email', 'mobile_number']

        let form_data = this.state.form_data;
        for (var i = 0; i < keys_to_check.length; i++) {
            let key_check = keys_to_check[i];
            let first_error = 'Please enter ';
            if (!form_data[key_check]) {
                form_data[key_check + '_error'] = first_error + keysMapper[key_check];
            }
        }


        if (this.state.form_data.email.length < 10 ||
            !validateEmail(this.state.form_data.email)) {
            form_data['email_error'] = 'Please enter valid email';
        }

        if (this.state.form_data.mobile_number.length !== 10 || !validateNumber(this.state.form_data.mobile_number) ||
            !numberShouldStartWith(this.state.form_data.mobile_number)) {
            form_data['mobile_number_error'] = 'Please enter valid mobile no';

        }

        let canSubmitForm = true;
        for (var key in form_data) {
            if (key.indexOf('error') >= 0) {
                if (form_data[key]) {
                    canSubmitForm = false;
                    break;
                }
            }
        }

        this.setState({
            form_data: form_data
        })


        if (canSubmitForm) {

            // let body = {
            //     "email": this.state.form_data.email,
            //     "mobile_number": this.state.form_data.mobile_number
            // }

            let body = {        //        new api
                    "application_id": "78f0b856-28e6-4ef1-9933-369be4ff916b",
                    "buyer_details": {
                        "phone_number": this.state.form_data.mobile_number,
                        "email": this.state.form_data.email,
                    }
            }



            // console.log(body)
            this.updateLead(body);
        }
    }


    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": this.state.providerConfig.provider_api,
                "flow": this.state.insured_account_type || '',
                "screen_name": 'contact details',
                'email_id': this.state.form_data.email,
                'mobile_number': this.state.form_data.mobile_number,
                'from_edit': this.props.edit ? 'yes' : 'no'
            }
        };

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
                title={this.setEditTitle("Contact details")}
                buttonTitle="CONTINUE"
                withProvider={true}
                handleClick2={this.handleClick2}
                buttonData={this.state.bottomButtonData}
                handleClick={() => this.handleClick()}
            >
                <FormControl fullWidth>

                    <div className="InputField">
                        <MobileInputWithoutIcon
                            error={(this.state.form_data.mobile_number_error) ? true : false}
                            helperText={this.state.form_data.mobile_number_error}
                            type="number"
                            width="40"
                            label="Mobile number"
                            class="Mobile"
                            maxLength="10"
                            id="number"
                            name="mobile_number"
                            value={this.state.form_data.mobile_number || ''}
                            onChange={this.handleChange()} />
                    </div>
                    <div className="InputField">
                        <Input
                            error={(this.state.form_data.email_error) ? true : false}
                            helperText={this.state.form_data.email_error}
                            type="email"
                            width="40"
                            label="Email id"
                            class="Email"
                            maxLength="55"
                            id="email"
                            name="email"
                            value={this.state.form_data.email || ''}
                            onChange={this.handleChange()} />
                    </div>
                </FormControl>

                <ConfirmDialog parent={this} />
            </Container>
        );
    }
}

export default GroupHealthPlanContactDetails;