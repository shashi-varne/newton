import React, { Component } from 'react';
import Container from '../../../common/Container';

import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';
import { storageService } from 'utils/validators';
import Input from '../../../../common/ui/Input';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import { initialize } from '../common_data';
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
            ui_ped_data: {},
            onlycheckbox: true
        }
        this.initialize = initialize.bind(this);
    }


    componentWillMount() {
        this.initialize();
    }


    async componentDidMount() {

        console.log(this.state.groupHealthPlanData);

        let account_type = this.state.groupHealthPlanData.account_type;
        let radio_title = 'Do you have any pre-existing diseases?';
        if (account_type !== 'self') {
            radio_title = 'Does any of the members have any pre-existing disease?';
        }

        let lead = this.state.groupHealthPlanData.lead || {};

        let form_data = {};
        form_data.city = lead.city;

        this.setState({
            form_data: form_data,
            lead: lead,
            radio_title: radio_title,
            account_type: account_type
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

        if (form_data.is_ped === 'YES') {
            if (!this.state.ui_ped_data === 0) {
                canSubmitForm = false;
                toast('Please select atleast one');
                return;
            }
        }

        let final_dob_data = this.state.groupHealthPlanData.final_dob_data;
        let ui_ped_data = this.state.ui_ped_data;
        for (var i in final_dob_data) {
            let key = final_dob_data[i].key;
            delete ui_ped_data[key];
            if (form_data[key + '_checked']) {
                ui_ped_data[key] = true;
            }
        }
        this.setState({
            form_data: form_data
        })


        if (canSubmitForm) {

            let groupHealthPlanData = this.state.groupHealthPlanData;
            groupHealthPlanData.ui_ped_data = ui_ped_data;

            storageService().setObject('groupHealthPlanData', groupHealthPlanData);
            this.navigate('select-ped');
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

        let optionsMapper = {
            'is_ped': yesNoOptions
        }
        form_data[name] = optionsMapper[name][event].value;
        form_data[name + '_error'] = '';

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
                            {this.state.groupHealthPlanData.final_dob_data.map(this.renderMembers)}
                        </div>
                    }

                </FormControl>

                <ConfirmDialog parent={this} />
            </Container>
        );
    }
}

export default GroupHealthPlanIsPed;