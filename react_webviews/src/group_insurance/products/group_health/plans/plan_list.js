import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import ReactTooltip from "react-tooltip";
import { initialize } from '../common_data';
import GenericTooltip from '../../../../common/ui/GenericTooltip'

const hdfc_plan_title_mapper = {
    'hdfc_ergo_silver_smart': 'Silver Smart Plan',
    'hdfc_ergo_gold_smart': 'Gold Smart Plan',
    'hdfc_ergo_platinum_smart' : 'Platinum Smart Plan'
}

class GroupHealthPlanList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show_loader: true,
            plan_data: {},
            screen_name: 'plan_list_screen'
        }

        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {
        let {groupHealthPlanData : {post_body}} = this.state;

        let allowed_post_body_keys = ['adults', 'children', 'city', 'member_details'];
        let body = {};
        for(let key of allowed_post_body_keys){
            body[key] = post_body[key];
        }
        try {

             const res = await Api.post(`api/insurancev2/api/insurance/health/quotation/plans/${this.state.providerConfig.provider_api}`,
             body);

            this.setState({
                show_loader: false
            });
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {

                this.setState({
                    plan_data: resultData,
                    common: resultData.common
                }, () => {
                    ReactTooltip.rebuild()
                })


            } else {
                toast(resultData.error || resultData.message
                    || 'Something went wrong');
            }
        } catch (err) {
            console.log(err)
            this.setState({
                show_loader: false
            });
            toast('Something went wrong');
        }
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
                'plan_type': plan.plan_name || '',
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

        groupHealthPlanData.plan_selected = plan;
        groupHealthPlanData.post_body.plan_id = plan.plan_id;
        groupHealthPlanData.base_plan_title = common.base_plan_title
        groupHealthPlanData.post_body.plan = plan.plan_type;
        groupHealthPlanData.post_body.cover_plan = plan.plan_type;

        if(provider === 'HDFCERGO'){
            groupHealthPlanData.plan_selected.plan_title = hdfc_plan_title_mapper[plan.plan_id];
        }
        if(provider === 'RELIGARE') {
            groupHealthPlanData.post_body.eldest_member = eldest_dict.eldest_member;
            groupHealthPlanData.post_body.eldest_dob = eldest_dict.eldest_dob;
            groupHealthPlanData.plan_selected.plan_title = 'Care';
        }
       
        this.setLocalProviderData(groupHealthPlanData);

        this.navigate(this.state.next_screen || 'plan-details');
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
                        <div className="tc-subtitle">{this.state.provider === 'HDFCERGO' ? hdfc_plan_title_mapper[props.plan_id] : plan_data.plan_name}</div>
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

                <div className="bottom-cta" onClick={() => this.selectPlan(props, index)}>
                    {props.starts_at}
                </div>
            </div>
        );
    }


    render() {


        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
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