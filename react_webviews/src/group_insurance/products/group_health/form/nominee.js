import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';
import DropdownWithoutIcon from '../../../../common/ui/SelectWithoutIcon';
import Input from '../../../../common/ui/Input';
import { initialize, updateLead } from '../common_data';
import ConfirmDialog from './../plans/confirm_dialog';
import { relationshipOptionsGroupInsuranceAll } from '../../../constants';
class GroupHealthPlanNomineeDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            form_data: {},
            ctaWithProvider: true,
            relationshipOptions: [],
            get_lead: true,
            next_state: 'is-ped'
        }
        this.initialize = initialize.bind(this);
        this.updateLead = updateLead.bind(this);
    }


    componentWillMount() {
        this.initialize();
    }

    onload = () => {
        let lead = this.state.lead || {};
        let form_data = lead.nominee_account_key || {};

        this.setRelationshipOptions('male');
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
        var value = event.target ? event.target.value : event;
        var form_data = this.state.form_data || {};

      
        form_data[name] = value;
        form_data[name + '_error'] = '';

        this.setState({
            form_data: form_data
        })

    };

    navigate = (pathname) => {
        this.props.parent.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }


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

        let keysMapper = {
            'name': 'name',
            'relation': 'relation'
        }

        let keys_to_check = ['name', 'relation']

        let form_data = this.state.form_data;
        for (var i = 0; i < keys_to_check.length; i++) {
            let key_check = keys_to_check[i];
            let first_error = 'Please enter ';
            if (!form_data[key_check]) {
                form_data[key_check + '_error'] = first_error + keysMapper[key_check];
            }
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
            let body = {
                nominee_account_key: {
                    name: this.state.form_data.name,
                    relation: this.state.form_data.relation
                }
            }
            
            this.updateLead(body);
        }
    }


    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_suraksha',
            "properties": {
                "user_action": user_action,
                "screen_name": 'insurance'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    setRelationshipOptions(proposer_gender) {
        let options = [];
        if (proposer_gender && proposer_gender.toLowerCase() === 'male') {
            options = relationshipOptionsGroupInsuranceAll['male'];
        } else if (proposer_gender && proposer_gender.toLowerCase() === 'female') {
            options = relationshipOptionsGroupInsuranceAll['female'];
        } else {
            options = relationshipOptionsGroupInsuranceAll['male'];
        }

        this.setState({
            relationshipOptions: options
        })

    }

    render() {

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="Nominee details"
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
                            options={this.state.relationshipOptions}
                            id="relation"
                            label="Relationship"
                            error={this.state.form_data.relation_error ? true : false}
                            helperText={this.state.form_data.relation_error}
                            value={this.state.form_data.relation || ''}
                            name="relation"
                            onChange={this.handleChange('relation')} />
                    </div>
                </FormControl>

                <ConfirmDialog parent={this} />
            </Container>
        );
    }
}

export default GroupHealthPlanNomineeDetails;