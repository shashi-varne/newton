import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { health_providers } from '../../../constants';
import BottomInfo from '../../../../common/ui/BottomInfo';
import { storageService, calculateAge, isValidDate, IsFutureDate } from 'utils/validators';
import Input from '../../../../common/ui/Input';

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
    }

    componentWillMount() {
        this.setState({
            providerData: health_providers[this.state.provider],
            header_title: this.state.groupHealthPlanData.account_type === 'self' ? 'Your date of birth' : 'Date of birth details'
        })
    }


    async componentDidMount() {
        let groupHealthPlanData = this.state.groupHealthPlanData;

        let dob_data = [
            {
                'key': 'self',
                'label': this.state.groupHealthPlanData.account_type === 'self' ? 'Date of birth (DD/MM/YYYY)' : "Your date of birth (DD/MM/YYYY)",
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
                'backend_key': 'self_account_key'
            },
            {
                'key': 'mother',
                'label': "Mother's date of birth (DD/MM/YYYY)",
                'value': '',
                'backend_key': 'self_account_key'
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


        for (var i = 0; i < dob_data.length; i++) {
            let key = dob_data[i].key;
            if (groupHealthPlanData.ui_members[key]) {
                dob_data[i].value = groupHealthPlanData.ui_members[key + '_dob'] || '';
                final_dob_data.push(dob_data[i]);
            }
        }
       
        this.setState({
            final_dob_data: final_dob_data
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

        input.onkeyup = function (event) {
            var key = event.keyCode || event.charCode;

            var thisVal;

            let slash = 0;
            for (var i = 0; i < event.target.value.length; i++) {
                if (event.target.value[i] === '/') {
                    slash += 1;
                }
            }

            if (slash <= 1 && key !== 8 && key !== 46) {
                var strokes = event.target.value.length;

                if (strokes === 2 || strokes === 5) {
                    thisVal = event.target.value;
                    thisVal += '/';
                    event.target.value = thisVal;
                }
                // if someone deletes the first slash and then types a number this handles it
                if (strokes >= 3 && strokes < 5) {
                    thisVal = event.target.value;
                    if (thisVal.charAt(2) !== '/') {
                        var txt1 = thisVal.slice(0, 2) + "/" + thisVal.slice(2);
                        event.target.value = txt1;
                    }
                }
                // if someone deletes the second slash and then types a number this handles it
                if (strokes >= 6) {
                    thisVal = event.target.value;

                    if (thisVal.charAt(5) !== '/') {
                        var txt2 = thisVal.slice(0, 5) + "/" + thisVal.slice(5);
                        event.target.value = txt2;
                    }
                }
            };
        }

        final_dob_data[index].value = event.target.value;
        final_dob_data[index].error = errorDate;

        let age = calculateAge(event.target.value);
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
        let ui_members = groupHealthPlanData.ui_members;

        for (var i = 0; i < final_dob_data.length; i++) {

            let dob = final_dob_data[i].value;
            // let age = final_dob_data[i].age;
            let key = final_dob_data[i].key;

            

            let error = '';
            if (new Date(dob) > new Date() || !isValidDate(dob)) {
                error = 'Please enter valid date';
            } else if (IsFutureDate(dob)) {
                error = 'Future date is not allowed';
            }
            //  else if (age > 50 || age < 18) {
            //     error = 'Valid age is between 18 and 50';
            // }
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



        if(canProceed) {
            
            groupHealthPlanData.ui_members = ui_members;
            groupHealthPlanData.final_dob_data = final_dob_data;
            let post_body = groupHealthPlanData.post_body;

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