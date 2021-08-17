import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import BottomInfo from '../../../../common/ui/BottomInfo';
import Input from '../../../../common/ui/Input';
import { initialize } from '../common_data';
import { FormControl } from 'material-ui/Form';
import { getConfig } from 'utils/functions';

class GroupHealthPlanStarPincode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            screen_name: 'star_pincode',
        };

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {
        let groupHealthPlanData = this.state.groupHealthPlanData;
        let account_type = groupHealthPlanData.account_type;

        const { ui_members } = groupHealthPlanData;

        this.setState({
            account_type: account_type,
        });

        let header_title, pincode = '';
        if (account_type === 'family') {
            header_title = `Where does your ${ui_members.other_adult_member} live?`;
        } else if (account_type === 'self_family') {
            header_title = 'Where do you live?';
        } else if (account_type === 'parents_in_law' || account_type === 'parents' ) {
            if (ui_members.parents_option === 'parents') {
                header_title = 'Where do your parents live?';
            } else {
                header_title = 'Where do your parents in-law live?';
            }
        }
        pincode = groupHealthPlanData.pincode;

        this.setState({
            header_title: header_title,
            pincode: pincode
        });
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": this.state.providerConfig.provider_api,
                "screen_name": "city of residence",
                is_pincode_entered: this.state.pincode ? 'valid' : 'empty',
                flow: this.state.insured_account_type || '',
            }
        }

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams,
        });
    }

    handlePincode = name => event => {
        const pincode = event.target.value;

        if (pincode.length > 6) return;

        this.setState({
            [name]: pincode,
            [name+'_error']: '',
        });
    }

    handleClick = () => {
        this.sendEvents('next');
        let { groupHealthPlanData } = this.state;
        
        let canProceed = true;

        let error = '';
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

        if (canProceed) {
            post_body.postal_code = this.state.pincode;
            groupHealthPlanData.pincode = this.state.pincode;
            groupHealthPlanData.post_body.postal_code = this.state.pincode;
            this.setLocalProviderData(groupHealthPlanData);
            this.navigate(this.state.next_screen);
        }
    }

    render() {
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                skelton={this.state.skelton}
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