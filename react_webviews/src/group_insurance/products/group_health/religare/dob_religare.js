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
            value: ''
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
                'value': ''
            },
            {
                'key': 'wife',
                'name': 'Wife',
                'label': "Wife's date of birth (DD/MM/YYYY)",
                'value': '' 
            },
            {
                'key': 'husband',
                'name': 'Husband',
                'label': "Husband's date of birth (DD/MM/YYYY)",
                'value': ''
            },
            {
                'key': 'father',
                'name': 'Father',
                'label': "Father's date of birth (DD/MM/YYYY)",
                'value': ''
            },
            {
                'key': 'mother',
                'name': 'Mother',
                'label': "Mother's date of birth (DD/MM/YYYY)",
                'value': ''
            }
        ];

        let final_dob_data = [];

        let ui_members = groupHealthPlanData.ui_members || {};

        dob_data.forEach(item => {
            if (ui_members[item.key]) {
                final_dob_data.push(item)
            }
        });

        this.setState({
            final_dob_data: final_dob_data,
            dob_data: dob_data
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

        let dob = this.state.value;

        let error = '';
        if (!isValidDate(dob)) {
            error = 'Please enter valid date'
        };

        this.setState({
            error: error
        })
    }

    handleChangeRadio = (value) => {
        this.setState({
            selectedValue: value
        })
    }

    handleChange = name => event => {

        let value = event.target.value;

        if(!dobFormatTest(value)) {
            return
        }

        let input = document.getElementById(name);
        input.onkeyup = formatDate;

        this.setState({
            value: event.target.value,
            [value+'_error'] : ''
        })
    }

    renderDob = (account_type) => {
        let currentDate = new Date().toISOString().slice(0, 10);
        let data = this.state.dob_data.find(item => item.key === account_type)

        return (
            <div className="InputField">
                <Input
                    type="text"
                    width="40"
                    label={data.label}
                    class="DOB"
                    id={account_type}
                    name='dob_religare'
                    max={currentDate}
                    error={this.state.error ? true : false}
                    helperText={this.state.error}
                    value={this.state.value || ''}
                    placeholder="DD/MM/YYYY"
                    maxLength="10"
                    onChange={this.handleChange(account_type)} />
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
        let { account_type, final_dob_data } = this.state;
        
        let list = []
        if (account_type && final_dob_data.length > 1) {
            list = [{
                    'label': 'Select eldest member',
                    'options': this.renderOptions(final_dob_data),
                    'input_type': 'radio'
                }]
        }

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
                {account_type && final_dob_data.length > 1 &&
                    <RadioAndCheckboxList
                        account_type={account_type}
                        name="dob_religare"
                        list={list}
                        handleChangeRadio={this.handleChangeRadio} />}
                
                {this.state.selectedValue &&
                    this.renderDob(this.state.selectedValue)}

                {account_type && final_dob_data.length === 1 && this.renderDob(final_dob_data[0].key)}

                {account_type === 'self' && <p style={{textAlign:'center', color: '#767e86', fontSize:'13px'}}>Adult member's age should be more than 18 yrs</p>}

                <BottomInfo baseData={{ 'content': 'Illness can hit you any time, get insured today to cover your medical expenses' }} />
            </Container>
         );
    }
}
 
export default GroupHealthPlanDobReligare;