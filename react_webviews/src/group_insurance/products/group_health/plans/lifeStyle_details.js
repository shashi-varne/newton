import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import { initialize, updateBottomPremium } from '../common_data';
import RadioAndCheckboxList from './radioAndCheckboxList';

class GroupHealthPlanLifestyleDetail extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            ctaWithProvider: true,
        }

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {
        
        let account_type = this.state.groupHealthPlanData.account_type;

        let list = []

        if (account_type === 'self') {
            
            list = [
                {
                    'label': 'Do you smoke, consume alcohol, or chew tobacco, ghutka or paan or use any recreational drugs? If ‘Yes’ then please provide the frequency & amount consumed.',
                    'options': [
                        {
                            'name': 'Yes',
                            'value': 'Yes'
                        },
                        {
                            'name': 'No',
                            'value': 'No'
                        }
                    ],
                    'input_type': 'radio'
                }
            ]
        } else {
            list = [
                {
                    'label': 'Does any of the insured members smoke, consume alcohol, or chew tobacco, ghutka or paan or use any recreational drugs? If ‘Yes’ then please provide the frequency & amount consumed.',
                    'options': {
                        'family': ['Wife', 'Son', 'None'],
                        'selfandfamily': ['Self', 'Wife', 'Son', 'None'],
                        'parents': ['Father', 'Mother', 'None']
                    },
                    'input_type': 'checkbox'
                }
            ]
        }

        this.setState({
            account_type: this.state.groupHealthPlanData.account_type,
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
                "screen_name": 'lifestyle_details'
            }
        }

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
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
                title='Lifestyle detail'
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
                        name='lifeStyle details'
                        list={list}
                        handleChangeRadio={this.handleChangeRadio} />}
            </Container>
         );
    }
}
 
export default GroupHealthPlanLifestyleDetail;
