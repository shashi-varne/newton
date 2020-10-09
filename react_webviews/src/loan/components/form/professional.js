import React, { Component } from 'react';
import Container from '../../common/Container';

import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';

import Input from '../../../common/ui/Input';
import { initialize } from '../../common/functions';
import DropdownWithoutIcon from '../../../common/ui/SelectWithoutIcon';
import {
     validateAlphabets, validateNumber
} from 'utils/validators';
import Api from 'utils/api';

class ProfessionalDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form_data: {},
            get_lead: true,
            getLeadBodyKeys: ['professional_info'],
            next_state: 'address-details'
        }
        this.initialize = initialize.bind(this);
    }


    componentWillMount() {
        this.initialize();

      
        let eduQuaOptions = [
            {
                'name': 'Graduate',
                'value': 'Graduate'
            },
            {
                'name': 'Post Graduate',
                'value': 'PG'
            },
            {
                'name': 'Professional',
                'value': 'Professional'
            },
            {
                'name': 'Primary School (upto 5th)',
                'value': 'Primary School (upto 5th)'
            },
            {
                'name': 'Middle School (upto 8th)',
                'value': 'Middle School (upto 8th)'
            },
            {
                'name': '10th',
                'value': '10th'
            },
            {
                'name': '12th',
                'value': '12th'
            },
            {
                'name': 'Illiterate',
                'value': 'Illiterate'
            },
        ];

        this.setState({
            eduQuaOptions: eduQuaOptions
        })
    }

    onload = () => {

        if (this.props.edit) {
            this.setState({
                next_state: `/loan/form-summary`
            })
        }

        let lead = this.state.lead || {};

        let professional_info = lead.professional_info || {};

        let form_data = {
            company_name: professional_info.company_name || '',
            duration: professional_info.duration || '',
            office_address: professional_info.office_address || '',
            office_pincode: professional_info.office_pincode || '',
            office_email: professional_info.office_email || '',
            educational_qualification: professional_info.educational_qualification || '',
            office_city: professional_info.office_city || '',
            office_state: professional_info.office_state || '',
            office_country: professional_info.office_country || ''
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
        let keys_to_check = ['company_name', 'duration', 'office_address', 'office_pincode',
            'office_email', 'educational_qualification', 
            'office_city', 'office_state', 'office_country'];

        let form_data = this.state.form_data;

        form_data.office_city_error = '';
        form_data.office_state_error = '';
        form_data.office_country_error = '';

        if (form_data.first_name && !validateAlphabets(form_data.first_name)) {
            form_data.first_name_error = 'Invalid first name';
        }

        if (form_data.office_pincode.length !== 6 || !validateNumber(form_data.office_pincode) || 
        form_data.office_pincode_error) {
            form_data['office_pincode_error'] = 'Please enter valid pincode';
        }

        this.formCheckUpdate(keys_to_check, form_data);
    }


    sendEvents(user_action) {
        let { form_data } = this.state;

        let eventObj = {
            "event_name": 'lending',
            "properties": {
                "user_action": user_action,
                "screen_name": 'professional details',
                "company_name": form_data.company_name || '',
                "duration": form_data.duration || '',
                "educational_qualification": form_data.educational_qualification || '',
                "office_address": form_data.office_address || '',
                "office_city": form_data.office_city || '',
                "office_country": form_data.office_country || '',
                "office_email": form_data.office_email || '',
                "office_pincode": form_data.office_pincode || '',
                "office_state": form_data.office_state || '',
                'from_edit': this.props.edit ? 'yes' : 'no'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handlePincode = name => async (event) => {
        const pincode = event.target.value;

        if (pincode.length > 6) {
            return;
        }


        let form_data = this.state.form_data;
        form_data[name] = pincode;
        form_data[name + '_error'] = '';
        this.setState({
            form_data: form_data
        })

        let { office_city, office_state, office_country } = form_data;
        if (pincode.length === 6) {
            const res = await Api.get('/relay/api/loan/pincode/get/' + pincode);
            let resultData = res.pfwresponse.result[0] || '';
            
            let office_pincode_error = '';
            if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
                if (resultData.dmi_city_name === 'NA') {
                    office_city = resultData.district_name || resultData.division_name || resultData.taluk;
                } else {
                    office_city = resultData.dmi_city_name;
                }
                office_state = resultData.state_name;
                office_country = resultData.country_name;
            } else {
                office_city = '';
                office_state = '';
                office_pincode_error = 'Invalid pincode';
            }

            form_data.office_pincode_error = office_pincode_error;
            form_data.office_country = office_country || 'India';
        } else {
            office_city = '';
            office_state = '';
        }

        form_data.office_city = office_city;
        form_data.office_state = office_state;

        this.setState({
            form_data: form_data
        })
    }

    render() {
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title={this.setEditTitle("Professional details")}
                buttonTitle="CONTINUE"
                handleClick={() => this.handleClick()}
            >
                <FormControl fullWidth>

                    <div className="InputField">
                        <DropdownWithoutIcon
                            width="40"
                            options={this.state.eduQuaOptions}
                            id="educational_qualification"
                            label="Education qualification"
                            error={!!this.state.form_data.educational_qualification_error}
                            helperText={this.state.form_data.educational_qualification_error}
                            value={this.state.form_data.educational_qualification || ''}
                            name="educational_qualification"
                            dataType="AOB"
                            onChange={this.handleChange('educational_qualification')} />
                    </div>
                    <div className="InputField">
                        <Input
                            error={!!this.state.form_data.company_name_error}
                            helperText={this.state.form_data.company_name_error}
                            type="text"
                            width="40"
                            label="Employer's name"
                            class="name"
                            id="company_name"
                            name="company_name"
                            value={this.state.form_data.company_name || ''}
                            onChange={this.handleChange('company_name')} />
                    </div>

                    <div className="InputField">
                        <Input
                            type="number"
                            width="40"
                            label="No. of months in current job"
                            class="Name"
                            id="duration"
                            placeholder="Minimum requirement is 6 months"
                            name="duration"
                            error={!!this.state.form_data.duration_error}
                            helperText={this.state.form_data.duration_error}
                            value={this.state.form_data.duration || ''}
                            onChange={this.handleChange()} />
                    </div>


                    <div className="InputField">
                        <Input
                            error={!!this.state.form_data.office_email_error}
                            helperText={this.state.form_data.office_email_error}
                            type="email"
                            width="40"
                            label="Work email id"
                            class="Email"
                            id="office_email"
                            name="office_email"
                            value={this.state.form_data.office_email || ''}
                            onChange={this.handleChange()} />
                    </div>


                    <div className="InputField">
                        <Input
                            type="number"
                            width="40"
                            label="Office pincode"
                            id="office_pincode"
                            name="office_pincode"
                            maxLength="6"
                            error={(this.state.form_data.office_pincode_error) ? true : false}
                            helperText={this.state.form_data.office_pincode_error}
                            value={this.state.form_data.office_pincode || ''}
                            onChange={this.handlePincode('office_pincode')} />
                    </div>

                    <div className="InputField">
                        <Input
                            type="text"
                            id="addressline"
                            label="Office address"
                            name="office_address"
                            placeholder="ex: 16/1 Queens paradise"
                            error={(this.state.form_data.office_address_error) ? true : false}
                            helperText={this.state.form_data.office_address_error}
                            value={this.state.form_data.office_address || ''}
                            onChange={this.handleChange()} />
                    </div>

                    <div className="InputField">
                        <Input
                            disabled={true}
                            id="city"
                            label="City"
                            name="city"
                            value={this.state.form_data.office_city || ''}
                        />
                    </div>
                    <div className="InputField">
                        <Input
                            disabled={true}
                            id="state"
                            label="State"
                            name="state"
                            value={this.state.form_data.office_state || ''}
                        />
                    </div>
                    <div className="InputField">
                        <Input
                            disabled={true}
                            id="office_country"
                            label="Country"
                            name="office_country"
                            value={this.state.form_data.office_country || ''}
                        />
                    </div>

                </FormControl>
            </Container>
        );
    }
}

export default ProfessionalDetails;