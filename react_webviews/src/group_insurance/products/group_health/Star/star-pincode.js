import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import BottomInfo from '../../../../common/ui/BottomInfo';
import Input from '../../../../common/ui/Input';
import { initialize } from '../common_data';
import { FormControl } from 'material-ui/Form';

class GroupHealthPlanStarPincode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ui_members: {}
        }

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let account_type = groupHealthPlanData.account_type;

        let { ui_members } = groupHealthPlanData;

        this.setState({
            account_type: account_type,
        });

        let header_title, adult_member, pincode = '';
        if (account_type === 'family') {
            if (ui_members['wife']) {
                header_title = 'Where does your wife live?';
                adult_member = 'wife';
                pincode = ui_members['wife_pincode'] || ''

            } else if (ui_members['husband']) {
                header_title = 'Where does your husband live?';
                adult_member = 'husband';
                pincode = ui_members['husband_pincode'] || ''
            }
        } else if (account_type === 'selfandfamily') {
            header_title = 'Where do you live?';
            adult_member = 'self';
            pincode = ui_members['self_pincode'] || ''
        }

        this.setState({
            adult_member: adult_member,
            header_title: header_title,
            pincode: pincode
        })
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": 'health suraksha',
            }
        }

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handlePincode = name => event => {
        const pincode = event.target.value;

        if (pincode.length > 6) {
            return
        }

        this.setState({
            [name]: pincode,
            [name+'_error']: ''
        })
    }

    handleClick = () => {
        this.sendEvents('next');
        let { groupHealthPlanData } = this.state;
        
        let canProceed = true;

        let error = ''
        if (!this.state.pincode) {
            error = 'Please enter pincode';
            canProceed = false;
        } else if (this.state.pincode.length < 6) {
            error = 'Please enter valid pincode';
            canProceed = false;
        }

        this.setState({
            pincode_error: error
        });

        let post_body = groupHealthPlanData.post_body;
        let {ui_members} = groupHealthPlanData;

        if (canProceed) {
            ui_members[this.state.adult_member+'_pincode'] = this.state.pincode;

            post_body[this.state.adult_member+'_pincode'] = this.state.pincode;

            this.setLocalProviderData(groupHealthPlanData);
            this.navigate(this.state.next_screen);
        }
    }

    render() {
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title={this.state.header_title}
                fullWidthButton={true}
                onlyButton={true}
                buttonTitle="CONTINUE"
                handleClick={() => this.handleClick()}
            >
                <FormControl fullWidth>
                    <div className="InputField">
                        <Input
                            type="number"
                            width="40"
                            label="Pincode"
                            name="pincode"
                            error={(this.state.pincode_error) ? true : false}
                            helperText={this.state.pincode_error}
                            value={this.state.pincode || ''}
                            onChange={this.handlePincode('pincode')} />
                    </div>
                </FormControl>
                <div style={{fontSize:'13px', color:'#767E86'}}>Premium depends on the city of residence</div>
                <BottomInfo baseData={{ 'content': 'Get cashless treatment at 9900+ hospitals' }} />
            </Container>
        )
    }

};

export default GroupHealthPlanStarPincode;