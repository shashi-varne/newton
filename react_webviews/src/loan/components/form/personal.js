import React, { Component } from 'react';
import Container from '../../common/Container';

import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';

import Input from '../../../common/ui/Input';
import { initialize } from '../../common/functions';
import DropdownWithoutIcon from '../../../common/ui/SelectWithoutIcon';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import {
    formatDate, validatePan, validateAlphabets
} from 'utils/validators';

const genderOptions = [
    {
        'name': 'Male',
        'value': 'MALE'
    },
    {
        'name': 'Female',
        'value': 'FEMALE'
    },
    {
        'name': 'Other',
        'value': 'OTHER'
    }
];

class PersonalDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form_data: {},
            get_lead: true,
            getLeadBodyKeys: ['personal_info'],
            next_state: 'contact-details'
        }
        this.initialize = initialize.bind(this);
    }


    componentWillMount() {
        this.initialize();

        let maritalStatusOptions = [
            'MARRIED',
            'UNMARRIED',
            'WIDOW-WIDOWER',
            'DIVORCEE',
            'LEGALLY SEPARATED'
        ];

        this.setState({
            maritalStatusOptions: maritalStatusOptions
        })
    }

    onload = () => {

        if (this.props.edit) {
            this.setState({
                next_state: `/loan/dmi/form-summary`
            })
        }

        let { maritalStatusOptions } = this.state;
        let lead = this.state.lead || {};

        let personal_info = lead.personal_info || {};
        let form_data = {
            pan_no: personal_info.pan_no || '',
            first_name: personal_info.first_name || '',
            last_name: personal_info.last_name || '',
            father_name: personal_info.father_name || '',
            dob: personal_info.dob || '',
            gender: (personal_info.gender || '').toUpperCase() || '',
            marital_status: maritalStatusOptions.includes(personal_info.marital_status) ? personal_info.marital_status : '',
        };

        form_data['dob'] = form_data['dob'] ? form_data['dob'].replace(/\\-/g, '/').split('-').join('/') : '';

        this.setState({
            form_data: form_data,
            lead: lead,
        })

    }

    handleChange = name => event => {
        var input = document.getElementById('dob');
        input.onkeyup = formatDate;
        this.formHandleChange(name, event);
    };


    handleClick = async () => {

        this.sendEvents('next');

        let keys_to_check = ['pan_no', 'first_name', 'last_name', 'father_name',
            'dob', 'gender', 'marital_status'];

            let form_data = this.state.form_data;

        if (form_data.pan_no &&
            !validatePan(form_data.pan_no)) {
            form_data.pan_no_error = 'Invalid PAN number';
        }


        if (form_data.first_name && !validateAlphabets(form_data.first_name)) {
            form_data.first_name_error = 'Invalid first name';
        }

        if (form_data.last_name && !validateAlphabets(form_data.last_name)) {
            form_data.last_name_error = 'Invalid last name';
        }

        if (form_data.father_name && !validateAlphabets(form_data.father_name)) {
            form_data.father_name_error = "Invalid father's name";
        }


        this.formCheckUpdate(keys_to_check, form_data);
    }


    sendEvents(user_action) {
        let { form_data } = this.state;
         
        let eventObj = {
            "event_name": 'lending',
            "properties": {
                "user_action": user_action,
                "screen_name": "personal details",
                "dob": form_data.dob || '',
                "father_name": form_data.father_name || '',
                "first_name": form_data.first_name || '',
                "last_name": form_data.last_name || '',
                "gender": form_data.gender || '',
                "pan_no": form_data.pan_no || '',
                "marital_status": form_data.marital_status || '',
                'from_edit': this.props.edit ? 'yes' : 'no'
            }
        }

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleKeyChange = name => event => {
        if (event.charCode >= 48 && event.charCode <= 57) {
            // valid
        } else {
            // invalid
            event.preventDefault();
        }
    }

    handleChangeRadio = name => event => {

        var form_data = this.state.form_data || {};

        form_data[name] = genderOptions[event].value;
        form_data[name + '_error'] = '';

        this.setState({
            form_data: form_data
        })

    };

    render() {
        let currentDate = new Date().toISOString().slice(0, 10);
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title={this.setEditTitle("Personal details")}
                buttonTitle="CONTINUE"
                handleClick={() => this.handleClick()}
            >
                <FormControl fullWidth>

                    <div className="InputField">
                        <Input
                            error={(this.state.form_data.pan_no_error) ? true : false}
                            helperText={this.state.form_data.pan_no_error}
                            type="text"
                            width="40"
                            label="PAN"
                            class="name"
                            id="name"
                            name="pan_no"
                            maxLength="10"
                            value={this.state.form_data.pan_no || ''}
                            onChange={this.handleChange('pan_no')} />
                    </div>

                    <div className="InputField">
                        <Input
                            type="text"
                            width="40"
                            label="First name"
                            class="Name"
                            id="first_name"
                            name="first_name"
                            error={!!this.state.form_data.first_name_error}
                            helperText={this.state.form_data.first_name_error}
                            value={this.state.form_data.first_name || ''}
                            onChange={this.handleChange()} />
                    </div>
                    <div className="InputField">
                        <Input
                            type="text"
                            width="40"
                            label="Last name"
                            class="Name"
                            id="last_name"
                            name="last_name"
                            error={!!this.state.form_data.last_name_error}
                            helperText={this.state.form_data.last_name_error}
                            value={this.state.form_data.last_name || ''}
                            onChange={this.handleChange()} />
                    </div>
                    <div className="InputField">
                        <Input
                            type="text"
                            width="40"
                            label="Father's name"
                            class="Name"
                            id="father_name"
                            name="father_name"
                            error={(this.state.form_data.father_name_error) ? true : false}
                            helperText={this.state.form_data.father_name_error}
                            value={this.state.form_data.father_name || ''}
                            onChange={this.handleChange()} />
                    </div>
                    <div className="InputField">
                        <Input
                            type="text"
                            width="40"
                            label="Date of birth"
                            class="DOB"
                            id="dob"
                            name="dob"
                            max={currentDate}
                            error={!!this.state.form_data.dob_error}
                            helperText={this.state.form_data.dob_error || 'DOB should be same as that of PAN '}
                            value={this.state.form_data.dob || ''}
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
                            error={(this.state.form_data.gender_error) ? true : false}
                            helperText={this.state.form_data.gender_error}
                            value={this.state.form_data.gender || ''}
                            onChange={this.handleChangeRadio('gender')} />
                    </div>
                    <div className="InputField">
                        <DropdownWithoutIcon
                            width="40"
                            options={this.state.maritalStatusOptions}
                            id="marital_status"
                            label="Marital status"
                            error={this.state.form_data.marital_status_error ? true : false}
                            helperText={this.state.form_data.marital_status_error}
                            value={this.state.form_data.marital_status || ''}
                            name="marital_status"
                            onChange={this.handleChange('marital_status')} />
                    </div>

                </FormControl>
            </Container>
        );
    }
}

export default PersonalDetails;