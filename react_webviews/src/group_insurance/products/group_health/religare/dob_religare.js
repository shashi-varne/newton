import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import BottomInfo from '../../../../common/ui/BottomInfo';
import { getConfig } from 'utils/functions';
import { initialize, updateBottomPremium } from '../common_data';
import Input from '../../../../common/ui/Input';
import RadioAndCheckboxList from './radioAndCheckboxList';
import { formatDate, dobFormatTest, isValidDate } from 'utils/validators';

class GroupHealthPlanDobReligare extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
        }

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this)
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {

        let groupHealthPlanData = this.state.groupHealthPlanData;

        this.setState({
            account_type: groupHealthPlanData.account_type,
            header_title: groupHealthPlanData.account_type === 'self' ? 'Your date of birth' : 'Date of birth details'
        })

        let dob_data = [
            {
                'key': 'self',
                'name': 'Self',
                'label': groupHealthPlanData.account_type === 'self' ? 'Date of birth (DD/MM/YYYY)' : "Your date of birth (DD/MM/YYYY)",
                'value': '',
            },
            {
                'key': 'wife',
                'name': 'Wife',
                'label': "Wife's date of birth (DD/MM/YYYY)",
                'value': '',
            },
            {
                'key': 'husband',
                'name': 'Husband',
                'label': "Husband's date of birth (DD/MM/YYYY)",
                'value': '',
            },
            {
                'key': 'father',
                'name': 'Father',
                'label': "Father's date of birth (DD/MM/YYYY)",
                'value': '',
            },
            {
                'key': 'mother',
                'name': 'Mother',
                'label': "Mother's date of birth (DD/MM/YYYY)",
                'value': '',
            }
        ];

        let final_dob_list = [];

        let ui_members = groupHealthPlanData.ui_members || {};

        dob_data.forEach(item => {
            if (ui_members[item.key]) {
                final_dob_list.push(item)
            }
        });


        let {eldest_member, dob} = groupHealthPlanData.final_dob_data;

        const selected_dob_idx = final_dob_list.findIndex(item => item.key === eldest_member);
        final_dob_list[selected_dob_idx].value = dob;

        this.setState({
            final_dob_list: final_dob_list,
            dob_data: dob_data,
            selectedValue: eldest_member
        })

    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        })
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "screen_name": "dob_religare"
            }
        }

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleClick = () => {
        this.sendEvents('next');
        let {selectedValue, groupHealthPlanData, final_dob_list} = this.state;

        const selected_dob_idx = final_dob_list.findIndex(item => item.key === selectedValue);
        let dob = final_dob_list[selected_dob_idx].value;

        let canProceed = true;
        let ui_members = groupHealthPlanData.ui_members || {};

        let error = '';
        if (!isValidDate(dob)) {
            error = 'Please enter valid date'
        };

        final_dob_list[selected_dob_idx].error = error;

        this.setState({
            final_dob_list: final_dob_list
        });

        if(error) {
            canProceed = false
        }

        let post_body = groupHealthPlanData.post_body;

        if(canProceed) {
            groupHealthPlanData.ui_members = ui_members;
            groupHealthPlanData.final_dob_data = {
                eldest_member: selectedValue,
                dob: dob
            }

            post_body.eldest_dob = dob;

            this.setLocalProviderData(groupHealthPlanData);
        }

    }

    handleChangeRadio = (value) => {
        this.setState({
            selectedValue: value
        })
    }

    handleChange = index => event => {

        let {final_dob_list} = this.state;
        let name = final_dob_list[index].key;

        let value = event.target.value;

        if(!dobFormatTest(value)) {
            return
        }

        let input = document.getElementById(name);
        input.onkeyup = formatDate;

        final_dob_list[index].value = value;
        final_dob_list[index].error = '';

        this.setState({
            final_dob_list: final_dob_list
        })
    }

    renderDob = (account_type) => {
        let currentDate = new Date().toISOString().slice(0, 10);
        let {final_dob_list} = this.state;
        
        let obj = final_dob_list.find(item => item.key === account_type);
        let index = final_dob_list.indexOf(obj);
        let error = final_dob_list[index].error;

        return (
            <div className="InputField">
                <Input
                    type="text"
                    width="40"
                    label={obj.label}
                    class="DOB"
                    id={account_type}
                    name='dob_religare'
                    max={currentDate}
                    error={error ? true : false}
                    helperText={error}
                    value={final_dob_list[index].value || ''}
                    placeholder="DD/MM/YYYY"
                    maxLength="10"
                    onChange={this.handleChange(index)} />
            </div>
        )
    }

    renderOptions = (data) => {
        return [
            {
                name: data[0].name,
                value: data[0].key
            },
            {
                name: data[1].name,
                value: data[1].key
            }
        ]
    }
    
    render() {
        let { account_type, final_dob_list } = this.state;
        
        let list = []
        if (account_type && final_dob_list.length > 1) {
            list = [{
                    'label': 'Select eldest member',
                    'options': this.renderOptions(final_dob_list),
                    'input_type': 'radio'
                }]
        };

        return ( 
            <Container
                events={this.sendEvents('just_set_events')}
                show_loader={this.state.show_loader}
                title={account_type === 'self' ? 'Your date of birth' : 'Date of birth details'}
                fullWidthButton={true}
                buttonTitle="CONTINUE"
                onlyButton={true}
                handleClick={() => this.handleClick()}
            >
                {account_type && final_dob_list.length > 1 &&
                    <RadioAndCheckboxList
                        account_type={account_type}
                        name="dob_religare"
                        list={list}
                        value={this.state.selectedValue}
                        handleChangeRadio={this.handleChangeRadio} />}
                
                {this.state.selectedValue &&
                    this.renderDob(this.state.selectedValue)}

                {account_type && final_dob_list.length === 1 && this.renderDob(final_dob_list[0].key)}

                {account_type === 'self' && <p style={{textAlign:'center', color: '#767e86', fontSize:'13px'}}>Adult member's age should be more than 18 yrs</p>}

                <BottomInfo baseData={{ 'content': 'Illness can hit you any time, get insured today to cover your medical expenses' }} />
            </Container>
         );
    }
}
 
export default GroupHealthPlanDobReligare;