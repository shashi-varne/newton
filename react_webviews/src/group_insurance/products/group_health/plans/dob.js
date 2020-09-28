import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import BottomInfo from '../../../../common/ui/BottomInfo';
import {  calculateAge, isValidDate,
     IsFutureDate, formatDate, dobFormatTest, capitalizeFirstLetter } from 'utils/validators';
import Input from '../../../../common/ui/Input';
import { initialize } from '../common_data';
import toast from '../../../../common/ui/Toast';
import {resetInsuredMembers, getInsuredMembersUi} from '../constants';
import { childeNameMapper } from '../../../constants';

class GroupHealthPlanDob extends Component {

    constructor(props) {
        super(props);
        this.state = {
            header_title: 'Your date of birth',
            final_dob_data: [],
            ui_members: {},
            screen_name: 'plan_dob_screen'
        }

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }


    async componentDidMount() {
        let groupHealthPlanData = this.state.groupHealthPlanData;
        this.setState({
            account_type: groupHealthPlanData.account_type,
            header_title: groupHealthPlanData.account_type === 'self' ? 'Your date of birth' : 'Date of birth details'
        });

        let dob_data = getInsuredMembersUi(groupHealthPlanData);
        for (var key in dob_data) {
            dob_data[key].label = `${capitalizeFirstLetter(childeNameMapper(dob_data[key].key))}'s date of birth (DD/MM/YYYY)`;
            if(dob_data[key].key === 'self') {
                dob_data[key].label = groupHealthPlanData.account_type === 'self' ? 'Date of birth (DD/MM/YYYY)' : 
                "Your date of birth (DD/MM/YYYY)";
            }
        }

        let final_dob_data = [];


        let ui_members = groupHealthPlanData.ui_members || {};
        for (var i = 0; i < dob_data.length; i++) {
            let key = dob_data[i].key;
            if (ui_members[key]) {
                dob_data[i].value = ui_members[key + '_dob'] || '';
                dob_data[i].age = calculateAge(ui_members[key + '_dob'] || '', true);

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

        if (!dobFormatTest(value)) {
            return;
        }

        let errorDate = '';
        if (value.length > 10) {
            return;
        }

        var input = document.getElementById(name);
        input.onkeyup = formatDate;

        final_dob_data[index].value = event.target.value;
        final_dob_data[index].error = errorDate;

        let age = calculateAge(event.target.value, true);
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

        this.sendEvents('next');

        let validation_props = this.state.validation_props;

        let canProceed = true;
        let final_dob_data = this.state.final_dob_data;
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let ui_members = groupHealthPlanData.ui_members || {};
        let self_gender = ui_members.self_gender || '';
        let manAgeCheck = '';
        if(this.state.account_type === 'selfandfamily' || this.state.account_type === 'family') {
            if(self_gender === 'MALE') {
                manAgeCheck = 'self';
            } else if((self_gender === 'FEMALE' && ui_members.husband) || ui_members.husband) {
                manAgeCheck = 'husband';
            }
        }


        let adult_ages = [];
        let child_ages = [];

        for (let dob_data of final_dob_data) {
            const { value: dob, age, key } = dob_data;

            if (!isValidDate(dob)) {
                dob_data.error = 'Please enter valid date';
                canProceed = false;
            } else if (IsFutureDate(dob)) {
                dob_data.error = 'Future date is not allowed';
                canProceed = false;
            }

            if(age) {
                if(!['son', 'daughter'].includes(key)) {
                    let dob_adult = validation_props.dob_adult;
                    let dob_married_male = validation_props.dob_married_male;
                    // adult
                    if (age.age > dob_adult.max || age.age < dob_adult.min) {
                        dob_data.error = `Valid age is between ${dob_adult.min} - ${dob_adult.max} years`;
                        canProceed = false;
                        break;
                    } else if (manAgeCheck === key && age.age < dob_married_male.min) {
                        dob_data.error = `Minimum age is ${dob_adult.min} for married male`;
                        canProceed = false;
                        break;
                    }
                    adult_ages.push(age.age);
                } else {
                    let dob_child = validation_props.dob_child;
                    if (age.age > dob_child.max || (age.days < dob_child.minDays)) {
                        dob_data.error = `Valid age is between ${dob_child.minDays} days - ${dob_child.max} years`;
                        canProceed = false;
                        break;
                    }
                    child_ages.push(age.age);
                }
            }
           
            if (!dob_data.error) {
                ui_members[key + '_dob'] = dob;
            }

        }

        this.setState({
            final_dob_data: final_dob_data
        });


        //reset data
        groupHealthPlanData = resetInsuredMembers(groupHealthPlanData);

        let post_body = groupHealthPlanData.post_body;

        for(var age in child_ages) {
            for(var adult in adult_ages) {
                if(child_ages[age] >= adult_ages[adult]) {
                    toast('Parents age should not be less than child age');
                    return;
                }
            }
        }

        if(canProceed) {
            
            groupHealthPlanData.ui_members = ui_members;
            groupHealthPlanData.final_dob_data = final_dob_data;
            
            for (var j in final_dob_data) {

                let member_data = final_dob_data[j];
                let backend_key = member_data.backend_key;

                post_body[backend_key] = {
                    dob: member_data.value,
                    relation: member_data.relation
                };
            }

            if(ui_members.self_gender && post_body.self_account_key) {
                post_body.self_account_key.gender = ui_members.self_gender;
            }

            groupHealthPlanData.post_body = post_body;

            this.setLocalProviderData(groupHealthPlanData);
            this.navigate(this.state.next_screen);
        }
    };

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": this.state.providerConfig.provider_api,
                "flow": this.state.insured_account_type || '',
                "screen_name": 'enter birthday',
                // is_dob_entered: 
                // 'eldest_member': this.state.groupHealthPlanData.ui_members.other_adult_member || '',
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