import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from '../../../../utils/functions';
import { initialize, updateBottomPremium } from '../common_data';
import RadioAndCheckboxList from './radioAndCheckboxList';

class GroupHealthPlanMedicalHistory extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            ctaWithProvider: true,
            product_name: getConfig().productName
        }

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {

        let account_type = this.state.groupHealthPlanData.account_type;

        let list = [];

        let radioOptions = [
            {
                'name': 'yes',
                'value': 'Yes'
            },
            {
                'name': 'No',
                'value': 'No'
            }
        ]

        if (account_type === 'self') {

            list = [
                {
                    'label': 'Have you been diagnosed / hospitalized for any illness / injury during the last 48 months?',
                    'options': radioOptions,
                    'input_type': 'radio'
                },
                {
                    'label': 'Have you ever filed a claim with your current / previous insurer?',
                    'options': radioOptions,
                    'input_type': 'radio'
                },
                {
                    'label': 'Has your Health insurance been declined, cancelled or charged a higher premium?',
                    'options': radioOptions,
                    'input_type': 'radio'
                },
                {
                    'label': 'Are you already covered under any other health insurance policy of Religare Health Insurance?',
                    'options': radioOptions,
                    'input_type': 'radio'
                },
            ]

        } else {

            list = [
                {
                    'label': 'Have any of the person(s) to be insured been diagnosed / hospitalized for any illness / injury during the last 48 months?',
                    'options': radioOptions,
                    'input_type': 'radio'
                },
                {
                    'label': 'Have any of the person(s) to be insured ever filed a claim with their current / previous insurer?',
                    'options': radioOptions,
                    'input_type': 'radio'
                },
                {
                    'label': 'Who is the member?',
                    'options': {
                        'family': ['Wife', 'Son'],
                        'selfandfamily': ['Self', 'Wife', 'Son'],
                        'parents': ['Father', 'Mother']
                    },
                    'input_type': 'checkbox'
                },
                {
                    'label': 'Has any proposal for Health insurance been declined, cancelled or charged a higher premium?',
                    'options': radioOptions,
                    'input_type': 'radio'
                },
                {
                    'label': 'Is any of the person(s) to be insured, already covered under any other health insurance policy of Religare Health Insurance?',
                    'options': radioOptions,
                    'input_type': 'radio'
                },
            ]
        }

        this.setState({
            account_type: account_type,
            list: list
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
                "screen_name": 'medical_history'
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
    }

    handleChangeRadio = (value) => {
        this.setState({
            selectedValue: value
        })
    }
    
    render() {
        let { account_type, list } = this.state;

        return ( 
            <Container
                events={this.sendEvents('just_set_events')}
                show_loader={this.state.show_loader}
                title='Medical History'
                buttonTitle='CONTINUE'
                withProvider={true}
                buttonData={this.state.bottomButtonData}
                handleClick={() => this.handleClick()}
            >
                <div className="common-top-page-subtitle">
                    This is important to avoid claims rejection later
                </div>
                {account_type && 
                    <RadioAndCheckboxList
                        account_type={account_type}
                        name="medical history"
                        list={list}
                        handleChangeRadio={this.handleChangeRadio} />}
            </Container>
         );
    }
}
 
export default GroupHealthPlanMedicalHistory;