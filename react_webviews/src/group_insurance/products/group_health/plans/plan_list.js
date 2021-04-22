import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import Api from 'utils/api';
import ReactTooltip from "react-tooltip";
import { initialize, getPlanDetails } from '../common_data';
import GenericTooltip from '../../../../common/ui/GenericTooltip'
import {formatAmount, isEmpty} from '../../../../utils/validators';
import { compareObjects } from 'utils/validators';

class GroupHealthPlanList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            plan_data: {},
            screen_name: 'plan_list_screen',
            
        }

        this.initialize = initialize.bind(this);
        this.getPlanDetails = getPlanDetails.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {
        this.onload();
    }

    onload = async() =>{
        var groupHealthPlanData = this.state.groupHealthPlanData;
        var resultData = groupHealthPlanData['plan_list'];
        var plan_data = resultData.plan_data;
        this.setState({
            plan_data,
            common: plan_data.common,
            next_screen: 'plan-details'
        })
    }




    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }


    sendEvents(user_action, plan = {}) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": this.state.providerConfig.provider_api,
                "flow": this.state.insured_account_type || '',
                "screen_name": 'select plan',
                'plan_type':this.state.provider === 'HDFCERGO' ? this.state.providerConfig.hdfc_plan_title_mapper[plan.plan_id] : plan.plan_name,
                'recommendation_tag': plan.recommedation_tag || ''
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    selectPlan = (plan, index) => {
        this.sendEvents('next', plan);
        let {provider, groupHealthPlanData, plan_data} = this.state;
        let common = plan_data.common || {};
        let eldest_dict  = plan_data.eldest_dict || {};
        let post_body = groupHealthPlanData.post_body;

        groupHealthPlanData.plan_selected = plan;
        groupHealthPlanData.plan_selected.copay = plan.complete_details.copay;
        groupHealthPlanData.post_body.plan_id = plan.plan_id;
        groupHealthPlanData.base_plan_title = common.base_plan_title
        groupHealthPlanData.post_body.plan = plan.plan_type;
        groupHealthPlanData.post_body.cover_plan = plan.plan_type;
        
        var keys_to_check = ['account_type'];
        
        if(provider === 'HDFCERGO'){
            groupHealthPlanData.plan_selected.plan_title = this.state.providerConfig.hdfc_plan_title_mapper[plan.plan_id];
            keys_to_check = [...keys_to_check, 'city', 'plan_id']
        }
        if(provider === 'RELIGARE') {
            groupHealthPlanData.post_body.eldest_member = eldest_dict.eldest_member;
            groupHealthPlanData.post_body.eldest_dob = eldest_dict.eldest_dob;
            groupHealthPlanData.plan_selected.plan_title = 'Care';
            keys_to_check.push('plan_id')

        }

        this.setLocalProviderData(groupHealthPlanData);
        var current_state = {}
        for(var x in post_body){
            if(keys_to_check.indexOf(x) >= 0){
                current_state[x] = post_body[x]
            }
        }
        for(var y in post_body.member_details){
            current_state[`${y}_dob`] = post_body.member_details[y].dob;
        }
        this.setState({
            current_state
        }, ()=>{
            console.log(current_state)
            console.log(groupHealthPlanData.plan_list_current_state)
            var sameData = compareObjects( Object.keys(current_state) ,current_state, groupHealthPlanData.plan_list_current_state);
            console.log('same', sameData)
            if(!sameData || isEmpty(groupHealthPlanData.plan_details_screen)){
                console.log('fist cond')
                this.getPlanDetails();
            }else{
                console.log('second cond')
                this.setLocalProviderData(groupHealthPlanData);
                this.navigate('plan-details')
            }
        })

        
        
    }

    renderTileMidData = (props, index) => {
        return (
            <div key={index} className="pi-tile">
                <div className="pi-left">{props.label}</div>
                <div className="pi-right">{props.value}</div>
                {props.tooltip_content && <div className="info-img">
                    <GenericTooltip content={props.tooltip_content} productName={getConfig().productName}/>
                </div>}
            </div>
        )
    }

    renderPlans = (props, index) => {
        let plan_data = props;
        return (
            <div className="tile" key={index} onClick={() => this.selectPlan(props, index)}>
                <div className="group-health-recommendation" style={{ backgroundColor: props.recommedation_tag === 'Recommended' ? '#E86364' : '' }}>{plan_data.recommedation_tag}</div>
                <div className="group-health-top-content-plan-logo">
                    <div className="left">
                        <div className="tc-title">{this.state.provider==='HDFCERGO'? this.state.providerConfig.title2 :''}</div>
                        <div className="tc-subtitle">{this.state.provider === 'HDFCERGO' ? this.state.providerConfig.hdfc_plan_title_mapper[props.plan_id] : plan_data.plan_name}</div>
                    </div>
                    <div className="tc-right">
                        <img
                            src={require(`assets/${this.state.providerData.logo_card}`)}
                            alt=""
                            style={{ maxWidth: '140px' }} />
                    </div>
                </div>

                <div className="plan-info">
                    {(plan_data.display_content || []).map((props, index) => 
                    this.renderTileMidData(props, index))}
                </div>

                <div className="bottom-cta">
                    STARTS AT ₹ {formatAmount(props.starts_at_value)}/YEAR
                </div>
            </div>
        );
    }


    render() {


        return (
            <Container
                events={this.sendEvents('just_set_events')}
                skelton={this.state.skelton}
                showError={this.state.showError}
                errorData={this.state.errorData}
                title="3 smart plans to choose from"
                noFooter={true}
                onlyButton={true}
            >
                <div className="group-health-plan-list">
                    <div className="tiles">
                        {this.state.plan_data.plans && this.state.plan_data.plans.map(this.renderPlans)}
                    </div>
                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanList;