import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { health_providers } from '../../../constants';
import { storageService } from 'utils/validators';
// calculateAge, isValidDate, IsFutureDate
import PlusMinusInput from '../../../../common/ui/PlusMinusInput';

import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';

const other_adult_member_options = [
    {
        'name': 'Husband',
        'value': 'Husband'
    },
    {
        'name': 'Wife',
        'value': 'Wife'
    }
];

const self_options = [
    {
        'name': 'Self',
        'value': 'Self'
    }
];

class GroupHealthPlanAddMembers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            provider: this.props.match.params.provider,
            groupHealthPlanData: storageService().getObject('groupHealthPlanData'),
            header_title: 'Your date of birth',
            final_dob_data: [],
            son_max: 2,
            self_member: 'Self',
            // son_onlycheckbox: true
        }
    }

    componentWillMount() {
        this.setState({
            providerData: health_providers[this.state.provider],
            account_type: this.state.groupHealthPlanData.account_type,
            header_title: this.state.groupHealthPlanData.account_type === 'parents' ? 'Add parents to be insured' :
                'Add members to be insured'
        })
    }


    async componentDidMount() {


    }


    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    handleClick = () => {

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

    updateParent = (key, value) => {
        this.setState({
            [key]: value
        })
    }

    handleChangeRadio = name => event => {
        this.setState({
            [name]: other_adult_member_options[event].value,
            [name + '_error']: ''
        })

    };


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

                <div className="InputField">
                    <RadioWithoutIcon
                        width="40"
                        label="Policy already includes"
                        class="Gender:"
                        options={self_options}
                        id="self_member"
                        name="self_member"
                        disabledWithValue={true}
                        error={(this.state.self_member_error) ? true : false}
                        helperText={this.state.self_member_error}
                        value={this.state.self_member || ''}
                        onChange={() => {}} 
                    />
                </div>


                <div className="InputField">
                    <RadioWithoutIcon
                        width="40"
                        label="Other adult member"
                        class="Gender:"
                        options={other_adult_member_options}
                        id="other_adult_member"
                        name="other_adult_member"
                        error={(this.state.other_adult_member_error) ? true : false}
                        helperText={this.state.other_adult_member_error}
                        value={this.state.other_adult_member || ''}
                        onChange={this.handleChangeRadio('other_adult_member')} />
                </div>



                <PlusMinusInput
                    name="son"
                    parent={this}
                />
            </Container>
        );
    }
}

export default GroupHealthPlanAddMembers;