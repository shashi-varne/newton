import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';
import { validateAlphabets, calculateAge, isValidDate, 
    formatDate, dobFormatTest, IsFutureDate} from 'utils/validators';
import DropdownWithoutIcon from '../../../../common/ui/SelectWithoutIcon';
import Input from '../../../../common/ui/Input';
import { initialize, updateLead } from '../common_data';
import ConfirmDialog from './../plans/confirm_dialog';
import { isEmpty } from '../../../../utils/validators';
class GroupHealthPlanNomineeDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            form_data: {},
            ctaWithProvider: true,
            relationshipOptions: [],
            get_lead: true,
            next_state: 'is-ped',
            screen_name: 'nominee_screen'
        }
        this.initialize = initialize.bind(this);
        this.updateLead = updateLead.bind(this);
    }


    componentWillMount() {
        this.initialize();
    }

    onload = () => {

        this.setState({
            next_state: this.state.next_screen
        })

        let relationshipOptions = this.state.screenData.nominee_opts;

        this.setState({
            relationshipOptions: relationshipOptions
        })

        if(this.props.edit) {
            this.setState({
                next_state : `/group-insurance/group-health/${this.state.provider}/final-summary`
            })
        }

        let lead = this.state.lead || {};
        let form_data = lead.nominee_account_key || {};
        form_data['dob'] = form_data['dob'] ? form_data['dob'].replace(/\\-/g, '/').split('-').join('/') : '';

        this.setState({
            form_data: form_data,
            lead: lead,
        });


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
        var value = event.target ? event.target.value : event;
        var form_data = this.state.form_data || {};

        form_data[name] = value;
        form_data[name + '_error'] = '';

        this.setState({
            form_data: form_data
        })

    };

    handleChangeDob = name => event => {
        
        if (!name) {
            name = event.target.name;
        }
        
        var value = event.target ? event.target.value : event;
        var form_data = this.state.form_data || {};

        if (!dobFormatTest(value)) {
            return;
        }

        if (value.length > 10) {
            return;
        }

        var input = document.getElementById(name);
        input.onkeyup = formatDate;

        form_data[name] = value;
        form_data[name + '_error'] = '';
        

        if(isValidDate(value) && !IsFutureDate(value) && name !== 'apointeedob'){
            const { age } = calculateAge(value, 'byMonth');
            form_data[name + '_age'] = age;

            this.setState({
                form_data: form_data,
                renderApointee: !!(age && age < 18),
            });
        }

        this.setState({
            form_data: form_data,
        });

    }

    handleClose = () => {
        this.setState({
            openConfirmDialog: false
        });
    };

    handleClick2 = () => {
        this.setState({
            openConfirmDialog: true,
        });
    };

    handleClick = async () => {
        this.sendEvents('next');

        const noOfWords = (val = '') => val ? val.split(' ').length : 0; 
        const keysMapper = {
            'name': 'name',
            'relation': 'relation',
            'dob': 'dob',
            'apointeename': 'apointee name',
            'apointeerelation': 'apointee relation',
            'apointeedob': 'apointee dob'
        };
        
        const keys_to_check = ['name', 'relation', 'dob'];
        const apointeeKeys = ['apointeename', 'apointeerelation', 'apointeedob'];
        let form_data = this.state.form_data;

        apointeeKeys.map(apKey => form_data[apKey + '_error'] = '');

        if (this.state.renderApointee) {
            keys_to_check.concat(apointeeKeys);
        }

        for (let key_check of keys_to_check) {
            let first_error = 'Please enter ';
            if (!form_data[key_check]) {
                form_data[key_check + '_error'] = first_error + keysMapper[key_check];
            }
        }

        const { name, dob } = form_data;
       
        if (!isEmpty(form_data) && noOfWords(name) < 2) {
            form_data.name_error = 'Enter valid full name';
        } else if (name && !validateAlphabets(name)) {
            form_data.name_error = 'Invalid name';
        }


        if ((new Date(dob) > new Date()) || !isValidDate(dob)) {
            form_data.dob_error = 'Please enter valid date';
        } else if (IsFutureDate(dob)) {
            form_data.dob_error = 'Future date is not allowed';
        }

        if (this.state.renderApointee) {
            const { apointeename, apointeedob } = form_data;

            if (noOfWords(apointeename) < 2) {
                form_data.apointeename_error = 'Enter valid full name';
            } else if (apointeename && !validateAlphabets(apointeename)) {
                form_data.apointeename_error = 'Invalid name';
            }

            if (new Date(apointeedob) > new Date() || !isValidDate(apointeedob)) {
                form_data.apointeedob_error = 'Please enter valid date';
            } else if (IsFutureDate(apointeedob)) {
                form_data.apointeedob_error = 'Future date is not allowed';
            }
        }

        this.setState({
            form_data: form_data,
        });

        let canSubmitForm = true;
        for (var key in form_data) {
            if (key.indexOf('error') >= 0) {
                if (form_data[key]) {
                    canSubmitForm = false;
                    break;
                }
            }
        }
        
        if (canSubmitForm) {
            let body = {
                nominee_account_key: {
                    name: this.state.form_data.name,
                    relation: this.state.form_data.relation,
                }
            }

            if (this.state.providerConfig.provider_api === 'star') {
                body = {
                    nominee_account_key: {
                        name: this.state.form_data.name,
                        relation: this.state.form_data.relation,
                        dob: this.state.form_data.dob
                    },
                    apointee_account_key: {
                        name: this.state.form_data.apointeename,
                        relation: this.state.form_data.apointeerelation,
                        dob: this.state.form_data.apointeedob
                    }
                }
            }
            
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
                "screen_name": 'nominee details',
                'dob': this.state.form_data.dob ? 'yes' : 'no',
                'from_edit': this.props.edit ? 'yes' : 'no',
                'nominee_name': this.state.form_data.name ? 'yes' : 'no',
                'nominee_relation': this.state.form_data.relation ? 'yes' : 'no',
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    renderApointee = () => {
        return (
            <React.Fragment>
                <div className="common-top-page-subtitle flex-between-center" style={{marginTop:'20px'}}>
                    Please add appointee details as the nominee is a minor (less than 18 yrs)
                    <img 
                        className="tooltip-icon"
                        data-tip="The appointee must be an adult who will take care of the claim amount in case of death of the insured during the period that the nominee is a minor."
                        src={require(`assets/${this.state.productName}/info_icon.svg`)} alt="" />
                </div>
                <div>Apointee details</div>

                <FormControl fullWidth>
                    <div className="InputField">
                        <Input
                            type="text"
                            width="40"
                            label="Name"
                            class="ApointeeName"
                            id="apointeename"
                            name="apointeename"
                            error={this.state.form_data.apointeename_error ? true : false}
                            helperText={this.state.form_data.apointeename_error}
                            value={this.state.form_data.apointeename || ''}
                            onChange={this.handleChange()} />
                    </div>
                    <div className="InputField">
                        <DropdownWithoutIcon
                            width="40"
                            dataType="AOB"
                            options={this.state.relationshipOptions}
                            id="relation"
                            label="Relationship"
                            error={this.state.form_data.apointeerelation_error ? true : false}
                            helperText={this.state.form_data.apointeerelation_error}
                            value={this.state.form_data.apointeerelation || ''}
                            onChange={this.handleChange('apointeerelation')} />
                    </div>
                    <div className="InputField">
                        <Input
                            type="text"
                            width="40"
                            label="Date of birth"
                            class="DOB"
                            id="apointeedob"
                            name="apointeedob"
                            max="10"
                            error={this.state.form_data.apointeedob_error ? true : false}
                            helperText={this.state.form_data.apointeedob_error}
                            value={this.state.form_data.apointeedob || ''}
                            placeholder="DD/MM/YYYY"
                            maxLength="10"
                            onChange={this.handleChangeDob()}
                        />
                    </div>
                </FormControl>
            </React.Fragment>
        )
    }

    render() {
        const { showAppointee = false, showDob = false } = this.state.providerConfig.nominee_screen;

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title={this.setEditTitle("Nominee details")}
                buttonTitle="CONTINUE"
                withProvider={true}
                handleClick2={this.handleClick2}
                buttonData={this.state.bottomButtonData}
                handleClick={() => this.handleClick()}
            >

                <FormControl fullWidth>
                    <div className="InputField">
                        <Input
                            type="text"
                            width="40"
                            label="Name"
                            class="NomineeName"
                            id="name"
                            name="name"
                            error={this.state.form_data.name_error ? true : false}
                            helperText={this.state.form_data.name_error}
                            value={this.state.form_data.name || ''}
                            onChange={this.handleChange('name')} />
                    </div>
                    <div className="InputField">
                        <DropdownWithoutIcon
                            width="40"
                            dataType="AOB"
                            options={this.state.relationshipOptions}
                            id="relation"
                            label="Relationship"
                            error={this.state.form_data.relation_error ? true : false}
                            helperText={this.state.form_data.relation_error}
                            value={this.state.form_data.relation || ''}
                            name="relation"
                            onChange={this.handleChange('relation')} />
                    </div>
                    {showDob && <div className="InputField">
                        <Input
                            type="text"
                            width="40"
                            label="Date of birth"
                            class="DOB"
                            id="dob"
                            name="dob"
                            max="10"
                            error={this.state.form_data.dob_error ? true : false}
                            helperText={this.state.form_data.dob_error}
                            value={this.state.form_data.dob || ''}
                            placeholder="DD/MM/YYYY"
                            maxLength="10"
                            onChange={this.handleChangeDob()} />
                    </div>}
                </FormControl>

                {showAppointee && this.state.renderApointee && this.renderApointee()}


                <ConfirmDialog parent={this} />
            </Container>
        );
    }
}

export default GroupHealthPlanNomineeDetails;