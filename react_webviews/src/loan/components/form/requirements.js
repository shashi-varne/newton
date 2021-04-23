import React, { Component } from 'react';
import Container from '../../common/Container';

import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';

import {
    // formatAmount, 
    numDifferentiationInr
} from 'utils/validators';
import Input from '../../../common/ui/Input';
import { initialize } from '../../common/functions';
import DropdownWithoutIcon from '../../../common/ui/SelectWithoutIcon';

class ContactDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form_data: {},
            get_lead: true,
            next_state: 'personal-details'
        }
        this.initialize = initialize.bind(this);
    }


    componentWillMount() {

        this.initialize();

        let purposeOptions = [
            'Travel/Vacation',
            'Repay Credit Card Bill',
            'Repay other loans',
            'Marriage',
            'Other Function at Home',
            'New Home construction',
            'Old home renovation',
            'Furniture for home',
            'Household Expenses',
            'Car Purchase',
            'Two Wheeler Purchase',
            'Education',
            'Business Expense',
            'Medical Expense',
            'Other Personal expenses'
        ];

        let tenorOptions = [
            12,18,24
        ]

        let empTypeOptions = [
            {
                'name': 'Salaried',
                'value': 'Salaried'
            },
            {
                'name': 'Self Employed Non Professional',
                'value': 'SEP'
            },
            {
                'name': 'Self Employed Professional',
                'value': 'SENP'
            }
        ];

        this.setState({
            purposeOptions: purposeOptions,
            empTypeOptions: empTypeOptions,
            tenorOptions:tenorOptions
        })
    }

    onload = () => {

        if (this.props.edit) {
            this.setState({
                next_state: `/loan/dmi/form-summary`
            })
        }

        let { purposeOptions } = this.state;

        let lead = this.state.lead || {};

        let application_info = lead.application_info || {};

        let form_data = {
            purpose: purposeOptions.includes(application_info.purpose) ? application_info.purpose : '',
            amount_required: application_info.amount_required || '',
            tenor: application_info.tenor || '',
            employment_type: application_info.employment_type || '',
            net_monthly_salary: application_info.net_monthly_salary || '',
            work_experience: application_info.work_experience || ''
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
        let keys_to_check = ['purpose', 'tenor', 'amount_required', 'employment_type',
            'net_monthly_salary', 'work_experience'];

        this.formCheckUpdate(keys_to_check);
    }

    sendEvents(user_action) {
        let { form_data } = this.state; 
        
        let eventObj = {
            "event_name": 'lending',
            "properties": {
                "user_action": user_action,
                "screen_name": 'loan requirements',
                "loan_amount": form_data.amount_required || '',
                "loan_purpose": form_data.purpose || '',
                "loan_period": form_data.tenor || '',
                "employment_type": form_data.employment_type || ''
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj })
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

    render() {
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title={this.setEditTitle("Your requirements")}
                buttonTitle="CONTINUE"
                handleClick={() => this.handleClick()}
            >
                <FormControl fullWidth>

                    <div className="InputField">
                        <Input
                            type="number"
                            width="40"
                            label="Loan amount (in rupees)"
                            class="Name"
                            id="amount_required"
                            name="amount_required"
                            error={!!this.state.form_data.amount_required_error}
                            helperText={this.state.form_data.amount_required_error || numDifferentiationInr(this.state.form_data.amount_required)}
                            // value={formatAmount(this.state.form_data.amount_required || '')}
                            value={this.state.form_data.amount_required || ''}
                            onChange={this.handleChange('amount_required')}
                            // onKeyChange={this.handleKeyChange('amount_required')} 
                            />
                    </div>
                    <div className="InputField">
                        <DropdownWithoutIcon
                            width="40"
                            options={this.state.purposeOptions}
                            id="purpose"
                            label="Purpose of loan"
                            error={this.state.form_data.purpose_error ? true : false}
                            helperText={this.state.form_data.purpose_error}
                            value={this.state.form_data.purpose || ''}
                            name="purpose"
                            onChange={this.handleChange('purpose')} />
                    </div>
                    <div className="InputField">
                        <DropdownWithoutIcon
                            width="40"
                            options={this.state.tenorOptions}
                            id="tenor"
                            label="Loan period (in months)"
                            error={this.state.form_data.tenor_error ? true : false}
                            helperText={this.state.form_data.tenor_error}
                            value={this.state.form_data.tenor || ''}
                            name="tenor"
                            onChange={this.handleChange('tenor')} />
                    </div>

                    <div className="InputField">
                        <DropdownWithoutIcon
                            width="40"
                            dataType="AOB"
                            options={this.state.empTypeOptions}
                            id="employment_type"
                            label="Employment type"
                            error={this.state.form_data.employment_type_error ? true : false}
                            helperText={this.state.form_data.employment_type_error}
                            value={this.state.form_data.employment_type || ''}
                            name="employment_type"
                            onChange={this.handleChange('employment_type')} />
                    </div>

                   {this.state.form_data.employment_type &&
                    <div className="InputField">
                        <Input
                            type="number"
                            width="40"
                            label={this.state.form_data.employment_type === 'Salaried' ?  "Total work experience (years)" : "Total business experience (years)"}
                            class="Name"
                            id="work_experience"
                            name="work_experience"
                            placeholder={this.state.form_data.employment_type === 'Salaried' ? 
                            "Minimum work experience of 1 yr needed" : ""}
                            error={!!this.state.form_data.work_experience_error}
                            helperText={this.state.form_data.work_experience_error}
                            value={this.state.form_data.work_experience || ''}
                            onChange={this.handleChange('work_experience')} />
                    </div>}

                   {this.state.form_data.employment_type &&
                    <div className="InputField">
                        <Input
                            type="number"
                            width="40"
                            label={this.state.form_data.employment_type === 'Salaried' ?  "Net monthly salary (in rupees)" : "Net monthly income (in rupees)"}
                            class="Name"
                            id="net_monthly_salary"
                            name="net_monthly_salary"
                            placeholder={this.state.form_data.employment_type === 'Salaried' ? 
                            "Minimum monthly salary of Rs 25,000 needed" : ""}
                            error={!!this.state.form_data.net_monthly_salary_error}
                            helperText={this.state.form_data.net_monthly_salary_error || numDifferentiationInr(this.state.form_data.net_monthly_salary)}
                            value={this.state.form_data.net_monthly_salary || ''}
                            onChange={this.handleChange('net_monthly_salary')}
                            // onKeyChange={this.handleKeyChange('net_monthly_salary')}
                             />
                    </div>}
                </FormControl>
            </Container>
        );
    }
}

export default ContactDetails;