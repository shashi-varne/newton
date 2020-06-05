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
        groupHealthPlanData.ui_members = {
            'self': true,
            'wife': true,
            'father': true,
            'mother': '',
            'son': true,
            'son1': '',
            'son2': '',
            'daughter': '',
            'daughter1': '',
            'daughter2': ''
        }

        let dob_data = [
            {
                'key': 'self',
                'label': this.state.groupHealthPlanData.account_type === 'self' ? 'Date of birth (DD/MM/YYYY)' : "Your date of birth (DD/MM/YYYY)",
                'value': ''
            },
            {
                'key': 'wife',
                'label': "Wife's date of birth (DD/MM/YYYY)",
                'value': ''
            },

            {
                'key': 'father',
                'label': "Father's date of birth (DD/MM/YYYY)",
                'value': ''
            },
            {
                'key': 'mother',
                'label': "Mother's date of birth (DD/MM/YYYY)",
                'value': ''
            },
            {
                'key': 'son',
                'label': "Son's date of birth (DD/MM/YYYY)",
                'value': ''
            },
            {
                'key': 'son1',
                'label': "1st son's date of birth (DD/MM/YYYY)",
                'value': ''
            },
            {
                'key': 'son2',
                'label': "2nd son's date of birth (DD/MM/YYYY)",
                'value': ''
            },
            {
                'key': 'daughter',
                'label': "Daughter's date of birth (DD/MM/YYYY)",
                'value': ''
            },
            {
                'key': 'daughter1',
                'label': "1st daughter's date of birth (DD/MM/YYYY)",
                'value': ''
            },
            {
                'key': 'daughter2',
                'label': "1st daughter's date of birth (DD/MM/YYYY)",
                'value': ''
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

        for (var i = 0; i < final_dob_data.length; i++) {

            let dob = final_dob_data[i].value;
            let age = final_dob_data[i].age;
            let error = '';
            if (new Date(dob) > new Date() || !isValidDate(dob)) {
                error = 'Please enter valid date';
            } else if (IsFutureDate(dob)) {
                error = 'Future date is not allowed';
            } else if (age > 50 || age < 18) {
                error = 'Valid age is between 18 and 50';
            }
            final_dob_data[i].error = error;

            if(error) {
                canProceed = false;
            }
        }

        this.setState({
            final_dob_data: final_dob_data
        })

        if(canProceed) {

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