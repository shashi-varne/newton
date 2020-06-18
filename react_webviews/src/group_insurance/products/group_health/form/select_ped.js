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
class GroupHealthPlanSelectPed extends Component {

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


    onload = () => {
        let member_key = this.props.match.params.member_key;
        let final_dob_data = this.state.groupHealthPlanData.final_dob_data;

        let next_state = 'summary';
        let backend_key = '';
        for (var i = 0; i < final_dob_data.length; i++) {
            let key = final_dob_data[i].key;

            if (member_key === key) {
                backend_key = final_dob_data[i].backend_key;
                if (i === final_dob_data.length - 1) {
                    next_state = 'summary';
                } else {
                    next_state = final_dob_data[i + 1].key;
                }

                break;
            }

        }

        let lead = this.state.groupHealthPlanData.lead || {};
        console.log(this.state.groupHealthPlanData);
        let form_data = lead[backend_key] || {};


        this.setState({
            next_state: next_state,
            member_key: member_key,
            form_data: form_data,
            lead: lead,
            backend_key: backend_key
        })
    }

    componentDidUpdate(prevState) {
        if (this.state.member_key !== this.props.match.params.member_key) {
            this.onload();
        }
    }

    componentWillMount() {
        this.initialize();
    }


    async componentDidMount() {
        this.onload();
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
        this.props.history.push({
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



    render() {

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="Wife's pre-existing diseases"
                buttonTitle="CONTINUE"
                withProvider={true}
                handleClick2={this.handleClick2}
                buttonData={this.state.bottomButtonData}
                handleClick={() => this.handleClick()}
            >

                <FormControl fullWidth>

                   

                </FormControl>

                <ConfirmDialog parent={this} />
            </Container>
        );
    }
}

export default GroupHealthPlanSelectPed;