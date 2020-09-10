import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import BottomInfo from '../../../../common/ui/BottomInfo';
import { getConfig } from 'utils/functions';
import { initialize, updateBottomPremium } from '../common_data';
import Input from '../../../../common/ui/Input';
import RadioAndCheckboxList from './radioAndCheckboxList';
import { formatDate, dobFormatTest, isValidDate } from 'utils/validators';
import { isEmpty } from '../../../../utils/validators';

class GroupHealthPlanDobReligare extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            screen_name: 'religare_dob'
        };

        this.initialize = initialize.bind(this);
        this.updateBottomPremium = updateBottomPremium.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {

        const { account_type, religare_dob_data = {} } = this.state.groupHealthPlanData;

        let list = [];

        let radioOptions = (options) => {
            return [
                {
                    'name': options[0],
                    'value': options[0].toLowerCase(),
                },
                {
                    'name': options[1],
                    'value': options[1].toLowerCase(),
                }
            ];
        };

        if (['selfandfamily', 'parents'].includes(account_type)) {
            list = [{
                'label': 'Select eldest member',
                'options': account_type === 'parents' ? radioOptions(['Father', 'Mother']) : radioOptions(['Self', 'Wife']),
                'input_type': 'radio'
            }];
        }

        let dob_label = {
            'Self': account_type === 'self' ? 'Date of birth (DD/MM/YYYY)' : "Your date of birth (DD/MM/YYYY)",
            'Wife': "Wife's date of birth (DD/MM/YYYY)",
            'Father': "Father's date of birth (DD/MM/YYYY)",
            'Mother': "Mother's date of birth (DD/MM/YYYY)",
        };

        this.setState({
            account_type: account_type,
            list: list,
            dob_label: dob_label,
            value: religare_dob_data.dob,
            selectedValue: religare_dob_data.selectedKey,
        });
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

        let dob = this.state.value;

        let error = '';
        if (!isValidDate(dob)) {
            error = 'Please enter valid date';
            return this.setState({ error });
        }
        let groupHealthPlanData = this.state.groupHealthPlanData;
        Object.assign(groupHealthPlanData.post_body, {
            eldest_dob: dob,
        });
        
        if (isEmpty(groupHealthPlanData.religare_dob_data)) {
            groupHealthPlanData.religare_dob_data = {
                selectedKey: this.state.selectedValue,
                dob,
            };
        } else {
            Object.assign(groupHealthPlanData.religare_dob_data, {
                selectedKey: this.state.selectedValue,
                dob,
            });
        }
        this.setLocalProviderData(groupHealthPlanData);
        this.navigate(this.state.next_screen);
    };

    handleChangeRadio = (value) => {
        this.setState({
            selectedValue: value
        });
    };

    handleChange = name => event => {

        let value = event.target.value;

        if(!dobFormatTest(value)) {
            return;
        }

        let input = document.getElementById(name);
        input.onkeyup = formatDate;

        this.setState({
            value: event.target.value,
            value_error : ''
        });
    };

    renderDob = (account_type) => {
        let currentDate = new Date().toISOString().slice(0, 10);

        return (
            <div className="InputField">
                <Input
                    type="text"
                    width="40"
                    label={this.state.dob_label[account_type]}
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
    
    render() {
        let { account_type, list } = this.state;

        let value = account_type === 'self' ? 'Self' : 'Wife'
        
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
                {account_type &&
                    <RadioAndCheckboxList
                        account_type={account_type}
                        name="dob_religare"
                        list={list}
                        handleChangeRadio={this.handleChangeRadio} />}
                
                {this.state.selectedValue &&
                    this.renderDob(this.state.selectedValue)}

                {(account_type === 'self' || account_type === 'family') && this.renderDob(value)}

                <BottomInfo baseData={{ 'content': 'Illness can hit you any time, get insured today to cover your medical expenses' }} />
            </Container>
         );
    }
}
 
export default GroupHealthPlanDobReligare;