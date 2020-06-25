import React, { Component } from 'react';
import Container from '../../../common/Container';

import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';
import toast from '../../../../common/ui/Toast';
import { initialize, updateLead } from '../common_data';
import ConfirmDialog from './../plans/confirm_dialog';
import { yesNoOptions } from '../../../constants';
import PlusMinusInput from '../../../../common/ui/PlusMinusInput';
class GroupHealthPlanIsPed extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            form_data: {},
            ctaWithProvider: true,
            relationshipOptions: [],
            onlycheckbox: true,
            get_lead: true
        }
        this.initialize = initialize.bind(this);
        this.updateLead = updateLead.bind(this);
    }


    componentWillMount() {
        this.initialize();
    }


    onload = () => {
        let lead = this.state.lead;


        let next_state = `/group-insurance/group-health/${this.state.provider}/final-summary`;
        this.setState({
            next_state: next_state
        })

        let account_type = lead.account_type;
        let radio_title = 'Do you have any pre-existing diseases?';
        if (account_type !== 'self') {
            radio_title = 'Does any of the members have any pre-existing disease?';
        }

        let is_ped = 'NO';

        let member_base = lead.member_base;
        let form_data = {};

        for (var mem in member_base) {
            let mem_info = member_base[mem];
            if(mem_info.ped_exists) {
                is_ped = 'YES';
                form_data[mem_info.key + '_checked'] = true;
            }
        }

        form_data.is_ped = is_ped;

        for(var key in form_data) {
            this.setState({
                [key]: form_data[key]
            });
        }

        this.setState({
            form_data: form_data,
            lead: lead,
            radio_title: radio_title,
            account_type: account_type,
            member_base: member_base
        })


        this.setState({
            bottomButtonData: {
                ...this.state.bottomButtonData,
                handleClick: this.handleClick
            }
        })
    }

    updateParent = (key, value) => {
        let form_data = this.state.form_data;
        form_data[key] = value;
        this.setState({
            form_data: form_data,
            [key]: value
        }, () => {
            console.log(this.state.form_data);
        });
    }


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

        let form_data = this.state.form_data;
        let canSubmitForm = true;
        if (!form_data.is_ped) {
            form_data.is_ped_error = 'Please select this';
            canSubmitForm = false;
        }

        this.setState({
            form_data: form_data
        })
            
        let member_base = this.state.lead.member_base;

        
        let body = {};
        let next_state = '';
        for (var i in member_base) {
            let key = member_base[i].key;
            let backend_key = member_base[i].backend_key;
            body[backend_key] = {};
            if (form_data[key + '_checked']) {
                body[backend_key].ped_exists = 'true';

                if(!next_state) {
                    next_state = key;
                }
            } else {
                body[backend_key].ped_exists = 'false';
            }
        }

        if (form_data.is_ped === 'YES' && !next_state) {
            canSubmitForm = false;
            toast('Please select atleast one');
        }


        if (canSubmitForm) {

            this.setState({
                next_state: 'select-ped/' + (next_state || this.state.next_state)
            })
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

    handleChangeRadio = name => event => {


        var form_data = this.state.form_data || {};
        let member_base = this.state.member_base;

        let optionsMapper = {
            'is_ped': yesNoOptions
        }
        form_data[name] = optionsMapper[name][event].value;
        form_data[name + '_error'] = '';


        if(form_data.is_ped !== 'YES') {
            for (var i in member_base) {
                let key = member_base[i].key;
                form_data[key + '_checked'] = false;
                this.setState({
                    [key + '_checked'] : false
                })
            }
        }

        this.setState({
            form_data: form_data
        })

    };

    renderMembers = (props, index) => {
        return (
            <div key={index}>
                <PlusMinusInput
                    name={props.key}
                    parent={this}
                />
                <div className="generic-hr"></div>
            </div>
        )
    }

    render() {

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="One last step"
                buttonTitle="CONTINUE"
                withProvider={true}
                handleClick2={this.handleClick2}
                buttonData={this.state.bottomButtonData}
                handleClick={() => this.handleClick()}
            >

                <FormControl fullWidth>

                    <div className="InputField">
                        <RadioWithoutIcon
                            width="40"
                            label={this.state.radio_title}
                            class="Gender:"
                            options={yesNoOptions}
                            id="is_ped"
                            name="is_ped"
                            error={(this.state.form_data.is_ped_error) ? true : false}
                            helperText={this.state.form_data.is_ped_error}
                            value={this.state.form_data.is_ped || ''}
                            onChange={this.handleChangeRadio('is_ped')} />
                    </div>

                    {this.state.account_type !== 'self' &&
                         this.state.form_data.is_ped === 'YES' &&
                        <div>


                            <div className="plus-minus-input-label">
                                Who has pre-existing disease?
                            </div>
                            <div className="generic-hr"></div>
                            {this.state.member_base.map(this.renderMembers)}
                        </div>
                    }

                </FormControl>

                <ConfirmDialog parent={this} />
            </Container>
        );
    }
}

export default GroupHealthPlanIsPed;