import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import BottomInfo from '../../../../common/ui/BottomInfo';
import { getConfig } from 'utils/functions';
import { initialize } from '../common_data';
import Input from '../../../../common/ui/Input';
import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import { formatDate, dobFormatTest, isValidDate, capitalizeFirstLetter } from 'utils/validators';

const eldMemOptionMapper = {
    'self': ['self'],
    'family': ['spouse', 'husband', 'wife'],
    'selfandfamily': ['self', 'spouse', 'husband', 'wife'],
    'parents': ['father', 'mother']
}

class GroupHealthPlanDobReligare extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eldest_dob: '',
            eldest_dob_error: '',
            screen_name: 'religare_dob'
        }

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {

        let groupHealthPlanData = this.state.groupHealthPlanData;

        this.setState({
            header_title: groupHealthPlanData.account_type === 'self' ? 'Your date of birth' : 'Date of birth details'
        })



        let { eldest_dob, eldest_member, ui_members, account_type } = groupHealthPlanData;

        let mapper = eldMemOptionMapper[account_type];

        let mem_options = [];

        for (var key in ui_members) {
            if (ui_members[key] && mapper.indexOf(key) !== -1) {
                mem_options.push({
                    name: capitalizeFirstLetter(key),
                    value: key
                })
            }
        }


        let show_mem_options = mem_options.length > 1 ? true : false;

        if(!show_mem_options) {
            eldest_member = mem_options[0].value;
        }


        this.setState({
            eldest_dob: eldest_dob,
            eldest_member: eldest_member,
            show_mem_options: show_mem_options,
            mem_options: mem_options
        })

    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "screen_name": "dob_religare"
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleClick = () => {
        this.sendEvents('next');
        let { groupHealthPlanData } = this.state;

        
        let canProceed = true;

        if(!this.state.eldest_member) {
            this.setState({
                eldest_member_error: 'Please select this option'
            });

            return;
        }

        if (!isValidDate(this.state.eldest_dob)) {
            this.setState({
                eldest_dob_error: 'Please enter valid date'
            });

            canProceed = false
        };


        let post_body = groupHealthPlanData.post_body;

        if (canProceed) {
            groupHealthPlanData.eldest_dob = this.state.eldest_dob;
            groupHealthPlanData.eldest_member = this.state.eldest_member;
            
            post_body.eldest_member = this.memberKeyMapper(this.state.eldest_member).backend_key;
            post_body.eldest_dob = this.state.eldest_dob;

            this.setLocalProviderData(groupHealthPlanData);
            this.navigate(this.state.next_screen);
        }

    }

    handleChangeRadio = name => event => {

        let options = this.state.mem_options;
        this.setState({
            [name]: options[event] ? options[event].value : '',
            [name + '_error']: '',
            eldest_dob: ''
        })


    };

    handleChange = name => event => {


        let value = event.target.value;

        if (!dobFormatTest(value)) {
            return;
        }

        let input = document.getElementById(name);
        input.onkeyup = formatDate;

        this.setState({
            [name]: value,
            [name + '_error']: ''
        })
    }

   
    render() {
        let currentDate = new Date().toISOString().slice(0, 10);
        let { account_type } = this.state;


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
                {this.state.show_mem_options &&
                    <div className="InputField">
                        <RadioWithoutIcon
                            width="40"
                            label="Select eldest member"
                            class="Gender:"
                            options={this.state.mem_options}
                            id="eldest_member"
                            name="eldest_member"
                            error={(this.state.eldest_member_error) ? true : false}
                            helperText={this.state.eldest_member_error}
                            value={this.state.eldest_member || ''}
                            onChange={this.handleChangeRadio('eldest_member')} />
                    </div>}

                {this.state.eldest_member &&

                    <div className="InputField">
                        <Input
                            type="text"
                            width="40"
                            label={`${capitalizeFirstLetter(this.state.eldest_member)}'s date of birth (DD/MM/YYYY)`}
                            class="DOB"
                            id='eldest_dob'
                            name='eldest_dob'
                            max={currentDate}
                            error={!!this.state.eldest_dob_error}
                            helperText={this.state.account_type === 'self' && !this.state.eldest_dob_error ? "Adult member's age should be more than 18 yrs" :
                             this.state.eldest_dob_error}
                            value={this.state.eldest_dob || ''}
                            placeholder="DD/MM/YYYY"
                            maxLength="10"
                            onChange={this.handleChange('eldest_dob')} />
                    </div>

                }

                <BottomInfo baseData={{ 'content': 'Illness can hit you any time, get insured today to cover your medical expenses' }} />
            </Container>
        );
    }
}

export default GroupHealthPlanDobReligare;