import React, { Component } from 'react';
import Container from '../../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import { initialize, getPlanDetails, getPlanList } from '../common_data';
import Input from '../../../../common/ui/Input';
import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import { isEmpty, formatDate, dobFormatTest, isValidDate, capitalizeFirstLetter } from 'utils/validators';
import { calculateAge, compareObjects } from '../../../../utils/validators';
import {getInsuredMembersUi, resetInsuredMembers} from '../constants';

const eldMemOptionMapper = {
    'self': ['self'],
    'family': ['spouse', 'husband', 'wife'],
    'self_family': ['self', 'spouse', 'husband', 'wife'],
    'parents': ['father', 'mother']
}

class GroupHealthPlanDobReligare extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eldest_dob: '',
            eldest_dob_error: '',
            screen_name: 'religare_dob',
            default_helper_text: '',
        }

        this.initialize = initialize.bind(this);
        this.getPlanDetails = getPlanDetails.bind(this);
        this.getPlanList = getPlanList.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {

        let groupHealthPlanData = this.state.groupHealthPlanData;
        const isSelf = groupHealthPlanData.account_type === 'self';
        
        this.setState({
            header_title: isSelf ? 'Your date of birth' : 'Date of birth details',
            default_helper_text: `${isSelf ? "You" : "Adult member's age"} should be 18 years or older`,
        });



        let { eldest_dob, eldest_member, ui_members, account_type } = groupHealthPlanData;

        let mapper = eldMemOptionMapper[account_type];

        let mem_options = [];

        for (var key in ui_members) {
            if (ui_members[key] && mapper.indexOf(key) !== -1) {
                mem_options.push({
                    name: capitalizeFirstLetter(key),
                    value: key
                })
            }
        }


        let show_mem_options = mem_options.length > 1 ? true : false;

        if(!show_mem_options) {
            eldest_member = mem_options[0].value;
        }

        this.setState({
            eldest_dob: eldest_dob,
            eldest_member: eldest_member,
            show_mem_options: show_mem_options,
            mem_options: mem_options
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
                "screen_name": "enter birthday",
                "flow": this.state.insured_account_type || '',
                product: this.state.providerConfig.provider_api,
                is_dob_entered: this.state.eldest_dob ? 'yes' : 'no',
                eldest_member: this.state.eldest_member,
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleClick = async () => {
        this.sendEvents('next');
        let {validation_props, groupHealthPlanData } = this.state || {};
        var {provider} = this.state;

        groupHealthPlanData = resetInsuredMembers(groupHealthPlanData) || {};
        var post_body = groupHealthPlanData.post_body;
        if(post_body && post_body.quotation_id){
            delete post_body['quotation_id'];
        }

        let ui_members = groupHealthPlanData.ui_members || {};
        
        let canProceed = true;

        if(!this.state.eldest_member) {
            this.setState({
                eldest_member_error: 'Please select this option'
            });

            return;
        }

        if (!isValidDate(this.state.eldest_dob)) {
            this.setState({
                eldest_dob_error: 'Please enter valid date'
            });

            canProceed = false;
        }

        if (calculateAge(this.state.eldest_dob) < validation_props.dob_adult.min || calculateAge(this.state.eldest_dob) > validation_props.dob_adult.max ) {
            this.setState({
                eldest_dob_error: `valid age is between ${validation_props.dob_adult.min} and ${validation_props.dob_adult.max - 1} years`
            });

            canProceed = false;
        }

        if (canProceed) {
            let post_body = groupHealthPlanData.post_body || {};

            let insured_members = getInsuredMembersUi(groupHealthPlanData);
            let member_details = {}
            for (var i=0; i < insured_members.length; i++){
                let data = insured_members[i];
    
                member_details[data.backend_key] = {
                    relation: data.relation,
                    gender: 'FEMALE'
                };
    
                if(data.key === this.state.eldest_member) {
                    member_details[data.backend_key].dob = this.state.eldest_dob;
                }
            }
            
            post_body.member_details = member_details;

            if(ui_members.self_gender && post_body.member_details.self_account_key) {
                post_body.member_details.self_account_key.gender = ui_members.self_gender;
            }

            groupHealthPlanData.eldest_dob = this.state.eldest_dob;
            groupHealthPlanData.eldest_member = this.state.eldest_member;
            
            post_body.eldest_member = this.memberKeyMapper(this.state.eldest_member).backend_key;
            post_body.eldest_dob = this.state.eldest_dob;
            
            if(provider === 'GMC'){
                post_body.plan_id = 'fisdom_health_protect';
            }
            groupHealthPlanData.post_body = post_body;
            this.setLocalProviderData(groupHealthPlanData);

            var keys_to_check = ['account_type']
            var current_state = {}
            for(var x in post_body){
                if(keys_to_check.indexOf(x) >= 0){
                    current_state[x] = post_body[x]
                }
            }
            for(var y in post_body.member_details){
                current_state[`${y}_dob`] = post_body.member_details[y].dob;
            }
            if(provider === 'GMC'){
                this.setState({
                    current_state
                }, ()=>{
                    var sameData = compareObjects( Object.keys(current_state),current_state, groupHealthPlanData.plan_list_current_state);
                    if(!sameData || isEmpty(groupHealthPlanData.plan_details_screen)){
                        this.getPlanDetails();
                    }else{
                        this.setLocalProviderData(groupHealthPlanData);
                        this.navigate(this.state.next_screen);
                        return;
                    }
                })
            }else if(provider === 'RELIGARE'){
                this.setLocalProviderData(groupHealthPlanData);
                var current_state = {}
                current_state['account_type'] = post_body['account_type'];
                for(var x in post_body.member_details){
                    console.log(x)
                    current_state[`${x}`] = post_body.member_details[x]['dob'];
                }
                var previousData = groupHealthPlanData.list_previous_data || {};
                var sameData = compareObjects(Object.keys(current_state), current_state, previousData)
                this.setState({
                    current_state
                }, ()=>{
                    if(!sameData || isEmpty(groupHealthPlanData.plan_list)){
                        this.getPlanList();
                    }else{
                        console.log('second')
                        this.navigate('plan-list')
                    }
                })
                return;
            }
        }

    }

    handleChangeRadio = name => event => {
        let options = this.state.mem_options;
        this.setState({
            [name]: options[event] ? options[event].value : '',
            [name + '_error']: '',
            eldest_dob: '',
        });
    };

    handleChange = name => event => {
        let value = event.target.value;

        if (!dobFormatTest(value)) {
            return;
        }

        let input = document.getElementById(name);
        input.onkeyup = formatDate;

        this.setState({
            [name]: value,
            [name + '_error']: '',
        });
    }

   
    render() {
        let currentDate = new Date().toISOString().slice(0, 10);
        const { eldest_member, default_helper_text } = this.state;
        const isSelf = eldest_member === 'self';
        

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title={isSelf ? 'Your date of birth' : 'Date of birth details'}
                fullWidthButton={true}
                buttonTitle="CONTINUE"
                onlyButton={true}
                handleClick={() => this.handleClick()}
            >
                {this.state.show_mem_options &&
                    <div className="InputField">
                        <RadioWithoutIcon
                            width="40"
                            label="Select eldest member"
                            class="Gender:"
                            options={this.state.mem_options}
                            id="eldest_member"
                            name="eldest_member"
                            error={(this.state.eldest_member_error) ? true : false}
                            helperText={this.state.eldest_member_error}
                            value={eldest_member || ''}
                            onChange={this.handleChangeRadio('eldest_member')} />
                    </div>}

                {this.state.eldest_member &&

                    <div className="InputField">
                        <Input
                            type="text"
                            width="40"
                            label={
                                isSelf ?
                                'Date of birth (DD/MM/YYYY)' :
                                `${capitalizeFirstLetter(eldest_member)}'s date of birth (DD/MM/YYYY)`
                            }
                            class="DOB"
                            id='eldest_dob'
                            name='eldest_dob'
                            max={currentDate}
                            error={!!this.state.eldest_dob_error}
                            helperText={
                                isSelf && !this.state.eldest_dob_error ?
                                default_helper_text :
                                this.state.eldest_dob_error
                            }
                            value={this.state.eldest_dob || ''}
                            placeholder="DD/MM/YYYY"
                            maxLength="10"
                            onChange={this.handleChange('eldest_dob')} />
                    </div>

                }
            </Container>
        );
    }
}

export default GroupHealthPlanDobReligare;