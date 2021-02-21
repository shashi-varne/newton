import React, { Component } from 'react';
import Container from '../../common/Container';

import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';

import MobileInputWithoutIcon from '../../../common/ui/MobileInputWithoutIcon';
import {validateEmail, numberShouldStartWith, validateNumber } from 'utils/validators';
import Input from '../../../common/ui/Input';
import { initialize } from '../../common/functions';

class ContactDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form_data: {},
            get_lead: true,
            getLeadBodyKeys: ['personal_info'],
            next_state: 'professional-details'
        }
        this.initialize = initialize.bind(this);
    }


    componentWillMount() {
        this.initialize();
    }

    onload = () => {

        if(this.props.edit) {
            this.setState({
                next_state : `/loan/form-summary`
            })
        }

        let lead = this.state.lead || {};
        let personal_info = lead.personal_info || {};
        let form_data = {
            email_id: personal_info.email_id || '',
            mobile_no: personal_info.mobile_no || ''
        };


        this.setState({
            form_data: form_data,
            lead: lead,
        })

    }

    handleChange = name => event => {
        this.formHandleChange(name, event);
    };


    handleClick = async () => {

        this.sendEvents('next');

        let keys_to_check = ['email_id', 'mobile_no']

        let form_data = this.state.form_data;

        if (this.state.form_data.email_id.length < 10 ||
            !validateEmail(this.state.form_data.email_id)) {
            form_data['email_id_error'] = 'Please enter valid email';
        }

        if (this.state.form_data.mobile_no.length !== 10 || !validateNumber(this.state.form_data.mobile_no) ||
            !numberShouldStartWith(this.state.form_data.mobile_no)) {
            form_data['mobile_no_error'] = 'Please enter valid mobile no';

        }

        this.formCheckUpdate(keys_to_check, form_data);
    }


    sendEvents(user_action) {
        let { form_data } = this.state;

        let eventObj = {
            "event_name": 'lending',
            "properties": {
                "user_action": user_action,
                "screen_name": 'contact details',
                'email': form_data.email_id || '',
                'mobile_number': form_data.mobile_no || '',
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
                handleClick={() => this.handleClick()}
                classOverRide={'loanMainContainer'}
            >
                <FormControl fullWidth>

                    <div className="InputField">
                        <MobileInputWithoutIcon
                            error={!!this.state.form_data.mobile_no_error}
                            helperText={this.state.form_data.mobile_no_error}
                            type="number"
                            width="40"
                            label="Mobile number"
                            class="Mobile"
                            maxLength={10}
                            id="number"
                            name="mobile_no"
                            value={this.state.form_data.mobile_no || ''}
                            onChange={this.handleChange()} />
                    </div>
                    <div className="InputField">
                        <Input
                            error={!!this.state.form_data.email_id_error}
                            helperText={this.state.form_data.email_id_error}
                            type="email"
                            width="40"
                            label="Personal email id"
                            class="Email"
                            id="email_id"
                            name="email_id"
                            value={this.state.form_data.email_id || ''}
                            onChange={this.handleChange()} />
                    </div>
                </FormControl>
            </Container>
        );
    }
}

export default ContactDetails;