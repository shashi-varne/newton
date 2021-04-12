import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';
import { validateAlphabets, calculateAge, isValidDate,
    formatDate, dobFormatTest, IsFutureDate, containsSpecialCharactersAndNumbers} from 'utils/validators';
import DropdownWithoutIcon from '../../../../common/ui/SelectWithoutIcon';
import Input from '../../../../common/ui/Input';
import { initialize, updateLead } from '../common_data';
import ConfirmDialog from './../plans/confirm_dialog';
import ReactTooltip from "react-tooltip";
import GenericTooltip from '../../../../common/ui/GenericTooltip'

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
        let appointeeRelationOptions = this.state.screenData.appointee_opts;

        this.setState({
            relationshipOptions: relationshipOptions,
            appointeeRelationOptions: appointeeRelationOptions
        })

        if(this.props.edit) {
            this.setState({
                next_state : `/group-insurance/group-health/${this.state.provider}/final-summary`
            })
        }

        let lead = this.state.lead || {}; 
        let form_data = lead.nominee_details || {};

        let appointee_account_key = lead.appointee_details || {}
        form_data['dob'] = form_data['dob'] ? form_data['dob'].replace(/\\-/g, '/').split('-').join('/') : '';
        
        const { age } = calculateAge(form_data['dob'], 'byMonth');

        if (lead.appointee_details.name) {
           form_data.appointeename = appointee_account_key.name;
           form_data.appointeerelation = appointee_account_key.relation;
           form_data['appointeedob'] = appointee_account_key['dob'].replace(/\\-/g, '/').split('-').join('/');
       }

        this.setState({
            form_data: form_data,
            lead: lead,
            renderAppointee: !!(age && age < 18),
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

        if(containsSpecialCharactersAndNumbers(value) && name === 'name'){
            return;
        }
        var form_data = this.state.form_data || {};

        form_data[name] = value;
        form_data[name + '_error'] = '';

        this.setState({
            form_data: form_data
        })

    };

    handleChangedob = name => event => {
        
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
        

        if(isValidDate(value) && !IsFutureDate(value) && name !== 'appointeedob'){
            const { age } = calculateAge(value, 'byMonth');
            // form_data[name + '_age'] = age;

            this.setState({
                form_data: form_data,
                renderAppointee: !!(age && age < 18),
            },() => {
                ReactTooltip.rebuild();
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
        let { provider } = this.state;
        // const noOfWords = (val = '') => val ? val.split(' ').length : 0;
        const keysMapper = {
            'name': 'name',
            'relation': 'relation',
            'dob': 'dob',
            'appointeename': 'appointee name',
            'appointeerelation': 'appointee relation',
            'appointeedob': 'appointee dob'
        };
        
        const keys_to_check = ['name', 'relation'];

        let isNomineedobNeeded = provider === 'STAR';
        if(isNomineedobNeeded) {
            keys_to_check.push('dob');
        }

        const appointeeKeys = ['appointeename', 'appointeerelation', 'appointeedob'];
        let form_data = this.state.form_data;

        appointeeKeys.map(apKey => form_data[apKey + '_error'] = '');

        if (this.state.renderAppointee) {
            keys_to_check.concat(appointeeKeys);
        }

        for (let key_check of keys_to_check) {
            let first_error = 'Please enter ';
            if (!form_data[key_check]) {
                form_data[key_check + '_error'] = first_error + keysMapper[key_check];
            }
        }

        const { name, dob, relation } = form_data;

        if (form_data && (name || '').split(" ").filter(e => e).length < 2) {
            form_data.name_error = 'Enter valid full name';
        } else if (name && !validateAlphabets(name)) {
            form_data.name_error = 'Invalid name';
        }


        if(isNomineedobNeeded) {
            if ((new Date(dob) > new Date()) || !isValidDate(dob)) {
                form_data.dob_error = 'Please enter valid date';
            } else if (IsFutureDate(dob)) {
                form_data.dob_error = 'Future date is not allowed';
            }
        }
        

        let relationMap = this.state.relationshipOptions.filter(data => data.value === relation);

        if (!relation || relationMap.length === 0) {
            form_data.relation_error = 'please select relation'
        }
        

        if (this.state.renderAppointee) {
            const { appointeename, appointeedob, appointeerelation } = form_data;

            if (form_data && (appointeename || '').split(" ").filter(e => e).length < 2) {
                form_data.appointeename_error = 'Enter valid full name';
            } else if (appointeename && !validateAlphabets(appointeename)) {
                form_data.appointeename_error = 'Invalid name';
            }

            const { age } = calculateAge(form_data['appointeedob'], 'byMonth');  

            if (new Date(appointeedob) > new Date() || !isValidDate(appointeedob)) {
                form_data.appointeedob_error = 'Please enter valid date';
            } else if (IsFutureDate(appointeedob)) {
                form_data.appointeedob_error = 'Future date is not allowed';
            } else if (age < 18) {
                form_data.appointeedob_error = 'Minimum age is 18 for appointee'
            }

            if (!appointeerelation) {
                form_data.appointeerelation_error = 'please select appointee relation'
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
                
                "nominee_details": {
                    "name":  this.state.form_data.name,
                    "relation": this.state.form_data.relation,
                }
            }

            if (this.state.providerConfig.provider_api === 'star') {

                let appointee_account_key =  {};
                if(this.state.renderAppointee) {
                    appointee_account_key =  {
                        "name": this.state.form_data.appointeename,
                        "relation": this.state.form_data.appointeerelation,
                        "dob": this.state.form_data.appointeedob
                    }
                }
                body = {
                    
                    "nominee_details": {
                        "name": this.state.form_data.name,
                        "relation": this.state.form_data.relation,
                        "dob": this.state.form_data.dob,
                        "appointee_details": appointee_account_key
                    },
                   
                }
            }        
            
            
            this.updateLead(body, '', {'name': this.state.form_data.name, 'relation': this.state.form_data.relation});     
        }
    }


    sendEvents(user_action) {
        let formName = (this.state.form_data.name || '').split(" ").filter(e => e).length === 2
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": this.state.providerConfig.provider_api,
                "flow": this.state.insured_account_type || '',
                "screen_name": 'nominee details',
                'dob': this.state.form_data.dob ? 'yes' : 'no',
                'from_edit': this.props.edit ? 'yes' : 'no',
                'nominee_name': formName? 'yes' : 'no',
                'nominee_relation': this.state.form_data.relation ? 'yes' : 'no',
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    renderAppointee = () => {
        return (
          <React.Fragment>
            <div
              className="common-top-page-subtitle flex-between-center"
              style={{ marginTop: "20px" }}
            >
              Please add appointee details as the nominee is a minor (less than
              18 yrs)
              <GenericTooltip
                productName={getConfig().productName}
                content="The appointee must be an adult who will take care of the claim amount in case of death of the insured during the period that the nominee is a minor."
              />
            </div>
            <div>Appointee details</div>
            <div style={{marginBottom: this.state.renderAppointee ? '50px': ''}}>
            <FormControl fullWidth>
              <div className="InputField">
                <Input
                  type="text"
                  width="40"
                  label="Name"
                  class="AppointeeName"
                  id="appointeename"
                  name="appointeename"
                  error={
                    this.state.form_data.appointeename_error ? true : false
                  }
                  helperText={this.state.form_data.appointeename_error}
                  value={this.state.form_data.appointeename || ""}
                  onChange={this.handleChange()}
                />
              </div>
              <div className="InputField">
                <DropdownWithoutIcon
                  width="40"
                  dataType="AOB"
                  options={this.state.appointeeRelationOptions}
                  id="relation"
                  label="Relationship"
                  error={
                    this.state.form_data.appointeerelation_error ? true : false
                  }
                  helperText={this.state.form_data.appointeerelation_error}
                  value={this.state.form_data.appointeerelation || ""}
                  onChange={this.handleChange("appointeerelation")}
                />
              </div>
              <div className="InputField">
                <Input
                  type="text"
                  width="40"
                  label="Date of birth"
                  class="dob"
                  id="appointeedob"
                  name="appointeedob"
                  max="10"
                  error={this.state.form_data.appointeedob_error ? true : false}
                  helperText={this.state.form_data.appointeedob_error}
                  value={this.state.form_data.appointeedob || ""}
                  placeholder="DD/MM/YYYY"
                  maxLength="10"
                  onChange={this.handleChangedob()}
                />
              </div>
            </FormControl>
            </div>
          </React.Fragment>
        );
    }

    render() {
        const { showAppointee = false, showDob = false } = this.state.providerConfig.nominee_screen;

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                skelton={this.state.skelton}
                showError={this.state.showError}
                errorData={this.state.errorData}
                title={this.setEditTitle("Nominee details")}
                buttonTitle="CONTINUE"
                withProvider={true}
                handleClick2={this.handleClick2}
                buttonData={this.state.bottomButtonData}
                handleClick={() => this.handleClick()}
            >
                <div className="common-title-content-gap"></div>
                <FormControl fullWidth>
                    <div className="InputField">
                        <Input
                            type="text"
                            width="40"
                            label="Full name"
                            class="NomineeName"
                            id="name"
                            name="name"
                            maxLength="50"
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
                            onChange={this.handleChangedob()} />
                    </div>}
                </FormControl>

                {showAppointee && this.state.renderAppointee && this.renderAppointee()}


                <ConfirmDialog parent={this} />
            </Container>
        );
    }
}

export default GroupHealthPlanNomineeDetails;