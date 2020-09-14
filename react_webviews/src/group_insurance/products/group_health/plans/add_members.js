import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {  genderOptions } from '../../../constants';

// calculateAge, isValidDate, IsFutureDate
import PlusMinusInput from '../../../../common/ui/PlusMinusInput';

import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import toast from '../../../../common/ui/Toast';
import { initialize } from '../common_data';

const other_adult_member_options = [
    {
        'name': 'Husband',
        'value': 'husband'
    },
    {
        'name': 'Wife',
        'value': 'wife'
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
            header_title: 'Your date of birth',
            final_dob_data: [],
            self_member: 'Self',
            plus_minus_keys: ['son', 'daughter'],
            father_onlycheckbox: true,
            mother_onlycheckbox: true,
            ui_members: {},
            screen_name: 'add_members_screen'
        }

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {

        let screenData = this.state.screenData;

        this.setState({
            son_max: screenData.son_max,
            daughter_max: screenData.daughter_max,
            total_plus_minus_max: screenData.total_plus_minus_max,
            account_type: this.state.groupHealthPlanData.account_type,
            header_title: this.state.groupHealthPlanData.account_type === 'parents' ? 'Add parents to be insured' :
                'Add members to be insured'
        })

        let ui_members = this.state.groupHealthPlanData.ui_members || {};
        this.setState({
            son_total: ui_members.son_total || 0,
            son_checked: ui_members.son_total ? true : false,
            daughter_total: ui_members.daughter_total || 0,
            daughter_checked: ui_members.daughter_total ? true : false,
            father_checked: ui_members.father ? true : false,
            mother_checked: ui_members.mother ? true : false,
            other_adult_member: ui_members.other_adult_member || '',
            ui_members: ui_members,
            self_gender: ui_members.self_gender || ''
        }, () => {
            this.setMinMax();
        })

    }


    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    handleClick = () => {

        let canProceed = true;
        let ui_members = this.state.ui_members;

        if (this.state.account_type === 'family') {
            if (!this.state.other_adult_member && !this.state.son_total &&
                !this.state.daughter_total) {
                toast('Atleast select one member');
                return;
            }

        }

        if (this.state.account_type === 'parents') {
            if (!this.state.father_checked && !this.state.mother_checked) {
                toast('Atleast select one member');
                return;
            }

        }

        if (['selfandfamily', 'family'].includes(this.state.account_type) && !this.state.other_adult_member) {
            this.setState({
                other_adult_member_error: 'Please select this option'
            });
            canProceed = false;
        }

        let keys_to_reset = ['self', 'wife', 'husband', 'father', 'mother', 'son', 'son1', 'son2',
            'daughter', 'daughter1', 'daughter2'];


        for (var kr in keys_to_reset) {
            ui_members[keys_to_reset[kr]] = false;
        }

        ui_members.son_total = 0;
        ui_members.daughter_total = 0;


        if (this.state.account_type === 'parents') {
            if (this.state.father_checked) {
                ui_members.father = true;
            }

            if (this.state.mother_checked) {
                ui_members.mother = true;
            }
        }

        if (['selfandfamily', 'family'].includes(this.state.account_type)) {
            ui_members.other_adult_member = this.state.other_adult_member;


            if (this.state.account_type === 'selfandfamily') {
                ui_members.self = true;
            }

            ui_members[this.state.other_adult_member] = true;

            if (this.state.son_total === this.state.son_max) {
                ui_members.son1 = true;
                ui_members.son2 = true;
            }

            if (this.state.son_total === 1) {
                ui_members.son = true;
            }

            if (this.state.daughter_total === this.state.daughter_max) {
                ui_members.daughter1 = true;
                ui_members.daughter2 = true;
            }

            if (this.state.daughter_total === 1) {
                ui_members.daughter = true;
            }

            ui_members.son_total = this.state.son_total || 0;
            ui_members.daughter_total = this.state.daughter_total || 0;

        }


        let adult_keys = ['husband', 'wife', 'father', 'mother', 'self'];
        let adult_total = 0;

        let child_total = (ui_members.son_total || 0) + (ui_members.daughter_total || 0);

        for (var key in adult_keys) {
            if (ui_members[adult_keys[key]]) {
                adult_total++;
            }
        }

        let post_body = this.state.groupHealthPlanData.post_body || {};
        post_body.mem_info = {
            adult: adult_total,
            child: child_total
        }

        if(this.state.account_type === 'selfandfamily') {

            if(!this.state.self_gender) {
                this.setState({
                    self_gender_error: 'Please select gender'
                })
                canProceed = false;
            }

            if((child_total + adult_total) <= 1) {
                toast('Please select atleast one family member');
                canProceed = false;
            }

            if(this.state.self_gender) {
                if(this.state.self_gender === 'MALE' && this.state.other_adult_member === 'husband') {
                    this.setState({
                        other_adult_member_error :'Invalid choice'
                    })
                    canProceed = false;
                }

                if(this.state.self_gender === 'FEMALE' && this.state.other_adult_member === 'wife') {
                    this.setState({
                        other_adult_member_error :'Invalid choice'
                    })
                    canProceed = false;
                }
            }

            ui_members.self_gender = this.state.self_gender || '';
            
        } else {
            ui_members.self_gender = '';
        }

        this.sendEvents('next', ui_members);


        if(canProceed) {
            let groupHealthPlanData = this.state.groupHealthPlanData;
            groupHealthPlanData.ui_members = ui_members;
            groupHealthPlanData.post_body = post_body;
            groupHealthPlanData.eldest_member = ''; //reset
            groupHealthPlanData.eldest_dob = ''; //reset
            this.setLocalProviderData(groupHealthPlanData);
    
            this.navigate(this.state.next_screen || 'plan-dob');
        }
        
    }


    sendEvents(user_action, ui_members) {
        ui_members = ui_members || this.state.ui_members;

        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": 'health suraksha',
                "flow": this.state.insured_account_type || '',
                "screen_name": 'add members',
                'son': ui_members.son_total || '',
                'daughter': ui_members.daughter_total || '',
                'self' : this.state.insured_account_type === 'selfandfamily' || this.state.insured_account_type === 'self' ? 'yes' : 'no',
                'parent' : `${(ui_members.father ? 'father, ' : '')} ${(ui_members.mother ? 'mother' : '') }`,
                'adult_member': ['selfandfamily', 'family'].indexOf(this.state.account_type) !== -1 ? this.state.other_adult_member : ''
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    setMinMax = () => {
        let son_disabled = false;
        let daughter_disabled = false
        if (this.state.son_total === 1 && this.state.daughter_total === 1) {
            this.setState({
                son_ismax: true,
                daughter_ismax: true
            });

        } else {
            this.setState({
                son_ismax: false,
                daughter_ismax: false
            });
        }

        if (this.state.son_total === 2) {
            daughter_disabled = true
        }

        if (this.state.daughter_total === 2) {
            son_disabled = true
        }

        this.setState({
            son_disabled: son_disabled,
            daughter_disabled: daughter_disabled
        });
    }

    updateParent = (key, value) => {
        this.setState({
            [key]: value
        }, () => {
            this.setMinMax();
        })
    }

    handleChangeRadio = name => event => {

        let options = other_adult_member_options;
        if(name === 'self_gender') {
            options = genderOptions;
        }
        this.setState({
            [name]: options[event] ? options[event].value : '',
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

                {['selfandfamily'].indexOf(this.state.account_type) !== -1 &&
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
                            onChange={() => { }}
                        />
                    </div>
                }

            {['selfandfamily'].indexOf(this.state.account_type) !== -1 &&
          <div className="InputField">
            <RadioWithoutIcon
              width="40"
              label="Gender"
              class="Gender:"
              options={genderOptions}
              id="self_gender"
              name="self_gender"
              error={(this.state.self_gender_error) ? true : false}
              helperText={this.state.self_gender_error}
              value={this.state.self_gender || ''}
              onChange={this.handleChangeRadio('self_gender')} />
          </div>}


                {['selfandfamily', 'family'].indexOf(this.state.account_type) !== -1 &&
                    <div>
                        <div className="InputField">
                            <RadioWithoutIcon
                                width="40"
                                label={this.state.account_type === 'selfandfamily' ? 'Other adult member' : 'Adult member'}
                                class="Gender:"
                                options={other_adult_member_options}
                                id="other_adult_member"
                                name="other_adult_member"
                                error={(this.state.other_adult_member_error) ? true : false}
                                helperText={this.state.other_adult_member_error}
                                value={this.state.other_adult_member || ''}
                                onChange={this.handleChangeRadio('other_adult_member')} 
                                canUnSelect={true}/>
                        </div>



                        <div className="plus-minus-input-label">
                            Children (upto {this.state.total_plus_minus_max})
                    </div>
                        <div className="generic-hr"></div>
                        <PlusMinusInput
                            name="son"
                            parent={this}
                        />
                        <div className="generic-hr"></div>
                        <PlusMinusInput
                            name="daughter"
                            parent={this}
                        />
                        <div className="generic-hr"></div>
                    </div>}

                {['parents'].indexOf(this.state.account_type) !== -1 &&
                    <div>
                        <div className="plus-minus-input-label">
                            Parents
                    </div>
                        <div className="generic-hr"></div>
                        <PlusMinusInput
                            name="father"
                            parent={this}
                        />
                        <div className="generic-hr"></div>
                        <PlusMinusInput
                            name="mother"
                            parent={this}
                        />
                        <div className="generic-hr"></div>
                    </div>}
            </Container>
        );
    }
}

export default GroupHealthPlanAddMembers;