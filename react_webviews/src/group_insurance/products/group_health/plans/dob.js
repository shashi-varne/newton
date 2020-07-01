import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { health_providers } from '../../../constants';
import BottomInfo from '../../../../common/ui/BottomInfo';
import { storageService, calculateAge, isValidDate, IsFutureDate, formatDate } from 'utils/validators';
import Input from '../../../../common/ui/Input';
import { initialize } from '../common_data';


class GroupHealthPlanDob extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            provider: this.props.match.params.provider,
            groupHealthPlanData: storageService().getObject('groupHealthPlanData'),
            header_title: 'Your date of birth',
            final_dob_data: []
        }

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }


    async componentDidMount() {
        let groupHealthPlanData = this.state.groupHealthPlanData;
        console.log(groupHealthPlanData);

        this.setState({
            providerData: health_providers[this.state.provider],
            header_title: groupHealthPlanData.account_type === 'self' ? 'Your date of birth' : 'Date of birth details'
        })

        let dob_data = [
            {
                'key': 'self',
                'label': groupHealthPlanData.account_type === 'self' ? 'Date of birth (DD/MM/YYYY)' : "Your date of birth (DD/MM/YYYY)",
                'value': '',
                'backend_key': 'self_account_key'
            },
            {
                'key': 'wife',
                'label': "Wife's date of birth (DD/MM/YYYY)",
                'value': '',
                'backend_key': 'spouse_account_key'
            },

            {
                'key': 'father',
                'label': "Father's date of birth (DD/MM/YYYY)",
                'value': '',
                'backend_key': 'parent_account1_key'
            },
            {
                'key': 'mother',
                'label': "Mother's date of birth (DD/MM/YYYY)",
                'value': '',
                'backend_key': 'parent_account2_key'
            },
            {
                'key': 'son',
                'label': "Son's date of birth (DD/MM/YYYY)",
                'value': '',
                'backend_key': 'child_account1_key'
            },
            {
                'key': 'son1',
                'label': "1st son's date of birth (DD/MM/YYYY)",
                'value': '',
                'backend_key': 'child_account1_key'
            },
            {
                'key': 'son2',
                'label': "2nd son's date of birth (DD/MM/YYYY)",
                'value': '',
                'backend_key': 'child_account2_key'
            },
            {
                'key': 'daughter',
                'label': "Daughter's date of birth (DD/MM/YYYY)",
                'value': '',
                'backend_key': 'child_account1_key'
            },
            {
                'key': 'daughter1',
                'label': "1st daughter's date of birth (DD/MM/YYYY)",
                'value': '',
                'backend_key': 'child_account1_key'
            },
            {
                'key': 'daughter2',
                'label': "1st daughter's date of birth (DD/MM/YYYY)",
                'value': '',
                'backend_key': 'child_account2_key'
            }
        ]

        let final_dob_data = [];


        let ui_members = groupHealthPlanData.ui_members || {};
        for (var i = 0; i < dob_data.length; i++) {
            let key = dob_data[i].key;
            if (ui_members[key]) {
                dob_data[i].value = ui_members[key + '_dob'] || '';
                final_dob_data.push(dob_data[i]);
            }
        }
       
        this.setState({
            final_dob_data: final_dob_data,
            dob_data: dob_data
        })

    }

    handleChange = index => event => {


        var final_dob_data = this.state.final_dob_data;
        let name = final_dob_data[index].key;
        if (!name) {
            name = event.target.name;
        }
        var value = event.target ? event.target.value : '';

        let errorDate = '';
        if (value.length > 10) {
            return;
        }

        var input = document.getElementById(name);
        input.onkeyup = formatDate;

        final_dob_data[index].value = event.target.value;
        final_dob_data[index].error = errorDate;

        let age = calculateAge(event.target.value, 'byMonth');
        final_dob_data[index].age = age;

        this.setState({
            final_dob_data: final_dob_data
        })

    };

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    handleClick = () => {

        let canProceed = true;
        let final_dob_data = this.state.final_dob_data;
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let ui_members = groupHealthPlanData.ui_members || {};

        console.log(final_dob_data);

        for (var i = 0; i < final_dob_data.length; i++) {

            let dob = final_dob_data[i].value;
            let age = final_dob_data[i].age;
            let key = final_dob_data[i].key;

            

            let error = '';
            if (new Date(dob) > new Date() || !isValidDate(dob)) {
                error = 'Please enter valid date';
            } else if (IsFutureDate(dob)) {
                error = 'Future date is not allowed';
            }

            if(age) {
                if(key.indexOf('son') >=0 || key.indexOf('daughter') >=0) {
                    // child
                    if (age.age > 25 || (age.age === 0 && age.month < 3)) {
                        error = 'Valid age is between 3 months- 25 years';
                    }
    
                } else {
                    // adult
                    if (age.age > 90 || age.age < 18) {
                        error = 'Valid age is between 18 - 90 years';
                    }
                }
            }

           
           
            final_dob_data[i].error = error;

            if(!error) {
                ui_members[key + '_dob'] = dob;
            }

            if(error) {
                canProceed = false;
            }
        }

        this.setState({
            final_dob_data: final_dob_data
        })

        let post_body = groupHealthPlanData.post_body;

        // reset data

        let dob_data_base = this.state.dob_data;
        for (var mem in dob_data_base) {
            let backend_key = dob_data_base[mem].backend_key;
            post_body[backend_key] = {};
        }
       

        if(canProceed) {
            
            groupHealthPlanData.ui_members = ui_members;
            groupHealthPlanData.final_dob_data = final_dob_data;
            
            for (var j in final_dob_data) {

                let key = final_dob_data[j].key;
                if((key === 'daughter' || key === 'daughter1') && ui_members.son_total === 1) {
                    final_dob_data[j].backend_key = 'child_account2_key';
                }

                let backend_key = final_dob_data[j].backend_key;

                let relation = key;
                if(relation.indexOf('son') >= 0) {
                    relation = 'son';
                }

                if(relation.indexOf('daughter') >= 0) {
                    relation = 'daughter';
                }

                post_body[backend_key] = {
                    dob: final_dob_data[j].value,
                    relation: relation
                };
            }

            if(final_dob_data.length === 1 && this.state.account_type === 'parent') {
                final_dob_data[0].backend_key = 'parent_account1_key';
            }


            groupHealthPlanData.post_body = post_body;

            storageService().setObject('groupHealthPlanData', groupHealthPlanData);
            this.navigate('plan-select-city');
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

    renderDobs = (props, index) => {
        let currentDate = new Date().toISOString().slice(0, 10);
        return (
            <div className="InputField" key={index}>
                <Input
                    type="text"
                    width="40"
                    label={props.label}
                    class="DOB"
                    id={props.key}
                    name={props.key}
                    max={currentDate}
                    error={(props.error) ? true : false}
                    helperText={props.error}
                    value={props.value || ''}
                    placeholder="DD/MM/YYYY"
                    maxLength="10"
                    onChange={this.handleChange(index)} />
            </div>
        );
    }

    render() {


        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title={this.state.header_title}
                fullWidthButton={true}
                buttonTitle="CONTINUE"
                onlyButton={true}
                handleClick={() => this.handleClick()}
            >

                {this.state.final_dob_data.map(this.renderDobs)}

                <BottomInfo baseData={{ 'content': 'Illness can hit you any time, get insured today to cover your medical expenses' }} />
            </Container>
        );
    }
}

export default GroupHealthPlanDob;